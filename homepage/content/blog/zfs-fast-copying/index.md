---
title: 'ZFS Fast File Copy'
date: 2024-05-11T19:45:09+02:00
draft: false
description: How you can copy files between different ZFS datasets at lightning fast speeds
authors: ["DerLev"]
tags: ["zfs"]
---

Just a quick thing that I recently discovered:  
ZFS can copy/move files between datasets very fast.

To do this you will need at least `ZFS 2.2` on your pool. To check that you can run the first command. If that command returns a dash for the pool version use the second command, your pool uses feature flags instead of version numbers. If the feature filtered by grep returns `enabled` you are good to go.

{{< file "bash" "/bin/bash" >}}

```bash
zpool get version PoolName

# if above returns '-' use this
zpool get all PoolName | grep feature@block_cloning
```

To copy or move a file you will just need to use `--reflink=auto` with the copy command. Sadly this does not work with the `mv` command so you will need to delete the original file if you want to move it.

{{< file "bash" "/bin/bash" >}}

```bash
cp --reflink=auto /mnt/zpool/from/path /mnt/zpool/to/path
```

This operation should be really fast because ZFS just needs to edit its journal (ZIL/SLOG) to reference the same blocks for the file in the new dataset.

That's it for this short article. As I wrote in the about page, this is what most of the articles will look like. Just short notes for special commands or other things.

```box { type=tip }
Further reading & sources:  
https://github.com/openzfs/zfs/discussions/15447  
https://github.com/openzfs/zfs/issues/405  
https://github.com/openzfs/zfs/pull/13392
```
