---
title: 'ZFS Backup to PBS and Backblaze'
date: 2025-04-04T18:34:47+02:00
description: 'How a ZFS dataset can be backed up to Proxmox Backup Server and Backblaze'
authors: ["DerLev"]
tags: ['zfs', 'pbs', 'backblaze', 'backup']
---

Recently I finally implemented a good backup strategy and went with [Proxmox
Backup Server](https://www.proxmox.com/en/products/proxmox-backup-server/overview)
and [Backblaze](https://www.backblaze.com/) as my backup targets. I have a ZFS
pool on my Proxmox host which I use for my file storage. I did that with the
[guide from apalrd](https://www.apalrd.net/posts/2023/ultimate_nas/).
The data on there needed to be backed up. Here is how I did it:

## The idea

I want to backup some ZFS datasets to my Proxmox Backup Server which will then
backup all its data to Backblaze. The data Backblaze receives should also be
encrypted since I do have all my important documents in Paperless-ngx which
saves its data to that ZFS pool. Because the dataset where the Paperless data
resides is encrypted at rest, the backup to PBS should be too.

### Problems to tackle

1. Backup ZFS datasets to PBS
2. Encrypt the backup so that PBS cannot read it
3. Backup the PBS datastore to Backblaze, this also needs to be encrypted

## From ZFS to PBS

Backing up from the source, so the ZFS datasets, to Proxmox Backup Server is
relatively simple. Just install the `proxmox-backup-client` and you are good to
go. But hold on, what if the data is being written to while the backup is in
process? For that I wrote a simple bash script which will first create a
snapshot, from which the backup client will then create its backup.

{{< file "bash" "backup-to-pbs.sh" >}}

```bash
#!/bin/bash

# function to delete left over backup snapshots
function delete_pbs_snapshots {
  # list all snapshots
  output=$(zfs list -t snapshot -o name -H)

  for snapshot in $output; do
    # isolate the snapshot name from the dataset name
    snapshot_name=$(echo $snapshot | sed "s|.*@||")

    # if the snapshot begins with pbs_ delete it
    if [[ $snapshot_name == "pbs_"* ]]; then
      echo "Deleting snapshot: $snapshot"
      zfs destroy $snapshot
    fi
  done
}

delete_pbs_snapshots

# the datasets to be backed up
datasets=("somepool/archive" "somepool/another-dataset")

snapshot_locations=()

# for each dataset configured create a new snapshot to read off of
for dataset in "${datasets[@]}"; do
  # format the snapshot name
  snapshot_name="pbs_$(printf '%(%Y-%m-%d_%H:%M:%S)T')"
  snapshot_path="$dataset@$snapshot_name"
  echo "Creating snapshot: $snapshot_path"
  zfs snapshot "$snapshot_path"
  # add the full path of the snapshot the array
  snapshot_locations+=("/$dataset/.zfs/snapshot/$snapshot_name")
done

# backup locations for pbs client
backup_cmd=""

# add each snapshot to the backup locations
for snapshot in "${snapshot_locations[@]}"; do
  # get the dataset path
  dataset_path=$(echo "$snapshot" | sed "s|/.zfs/snapshot/.*||")
  # add the dataset to the locations being backed up
  # saving as datasetname.pxar
  backup_cmd="$backup_cmd $(echo ${dataset_path:1} | tr '/' '-').pxar:$snapshot"
done

# username, server, location, password for pbs
export PBS_REPOSITORY='root@pam!zfs-backups@pbs.vlan.party:backups'
export PBS_PASSWORD="userPasswdOrApiKey"

echo $backup_cmd

# backup to pbs in the somepool namespace using metadata as a change detection
proxmox-backup-client backup $(echo $backup_cmd) --ns somepool --change-detection-mode=metadata

delete_pbs_snapshots
```

After saving this script in a location like `/opt/pbs-backup/backup-to-pbs.sh`
and making it executable (`chmod +x backup-to-pbs.sh`) you can execute it with
a systemd service and timer.

{{< file "systemd" "pbs-backup.service" >}}

```ini
[Unit]
Description=Backup ZFS datasets to PBS
Requires=zfs.target
After=zfs.target

[Service]
Type=oneshot
ExecStart=/opt/pbs-backup/backup-to-pbs.sh
```

{{< file "systemd" "pbs-backup.timer" >}}

```ini
[Unit]
Description=Run PBS backups one a week

[Timer]
OnCalendar=Sun 00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Using `systemctl daemon-reload` and `systemctl enable pbs-backup.timer --now`
your ZFS datasets will be backed up at 12:00 AM every Sunday to your Proxmox
Backup Server.

### Encrypting backups before sending to PBS

To encrypt backups before sending them to PBS you can use an encryption key.
To create it enter the following command.

{{< file "bash" "root: ~" >}}

```bash
# this will create a new default key with no password
# . if you want to password protect it remove the kdf flag
# . you can use PBS_ENCRYPTION_PASSWORD in your backup script to enter the password
proxmox-backup-client key create --kdf none
```

```box { type=caution }
Be sure to backup your key! You can print it out and store it in a safe place,
the backup client has a command for that (`paperkey`) which you can read about
[here](https://pbs.proxmox.com/docs/backup-client.html#using-a-master-key-to-store-and-recover-encryption-keys).
```

## From PBS to Backblaze

Now that your data is stored on the Proxmox Backup Server it's time to back that
up to Backblaze. We'll use [Rclone](https://rclone.org/) for that since it has
all the features we need.

Install Rclone on your PBS server.

{{< file "bash" "root: ~" >}}

```bash
# look at the version distributed through apt here first
# https://rclone.org/install/#package-manager
apt install rclone
# if you need a newer version use a different method of installation
```

Using `rclone config` you can now configure your Backblaze bucket. Look
[here](https://rclone.org/b2/) for further reference.

For encryption we'll use the crypt remote from Rclone which will layer on top of
another remote and encrypt the files and filenames. Use `rclone config`, adding
another remote once again and using `crypt` as the storage type. Look
[here](https://rclone.org/b2/) for further reference.

```box { type=caution }
Keep the passwords you entered in a safe place. You won't be able to display
them again as they are obfuscated in the `rclone.conf`. If you do not have them
handy you won't be able to restore from Backblaze!
```

Your `.config/rclone/rclone.conf` should now look something like this:

{{< file "config" "rclone.conf" >}}

```ini
[Backblaze]
type = b2
account = yourAccountId
key = yourKey
hard_delete = true

[EncryptedBackblaze]
type = crypt
remote = Backblaze:backblaze-bucket
password = someRandomChars
password2 = someOtherRandomChars
```

To start your first sync you can run the following command. Note that the number
of concurrent transfers is dependent on your number of CPU cores, available RAM,
and upload speed.

{{< file "bash" "root: ~" >}}

```bash
# /mnt/datastore/backups should be replaced with your datastore location
rclone --verbose --fast-list --update --transfers 16 sync /mnt/datastore/backups/ EncryptedBackblaze:
```

Depending the datastore size and internet speed this can take a few hours, so it
might be better to run this command with `screen` so that you can leave the
session and not interrupt the upload.

After the first sync is done you can create a systemd service and timer to
automatically back up the datastore. This will be done much quicker since PBS is
very great at deduplicating data.

{{< file "systemd" "backblaze-rclone.service" >}}

```ini
[Unit]
Description=Backup /mnt/datastore/backups to Backblaze B2 Cloud Storage

[Service]
Type=oneshot
ExecStart=/usr/bin/rclone --verbose --fast-list --update --transfers 16 sync /mnt/datastore/backups/ EncryptedBackblaze:
```

{{< file "systemd" "backblaze-rclone.timer" >}}

```ini
[Unit]
Description=Run Backblaze B2 Sync once a week

[Timer]
OnCalendar=Mon 00:00
Persistent=true

[Install]
WantedBy=timers.target
```

After running `systemctl daemon-reload` and
`systemctl enable backblaze-rclone.timer --now` your datastore will be backed up
every Monday at 12:00 AM.

Now you are done! You have now successfully backed up your data to the cloud.
Just make sure that you have all encryption keys and passwords kept at a safe
place you can access in case your disks go belly up.
