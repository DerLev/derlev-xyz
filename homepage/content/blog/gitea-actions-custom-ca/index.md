---
title: 'Gitea Actions with a custom CA'
date: 2024-05-17T00:07:46+02:00
draft: false
description: How Gitea's Act Runner needs to be configured to allow the use of a custom self hosted certificate authority
authors: ["DerLev"]
tags: ["gitea"]
---

I've been tampering with Gitea lately and specifically Gitea's Act Runner. Since I am hosting Gitea locally I am using certificates issued by my own CA with Caddy as my web server.

Although the Act Runner binary can connect to the Gitea instance just fine since I included the CA's root cert in the `/usr/local/share/ca-certificates` trust store, workflows running on the runner inside a Docker container cannot since the cert is not included in the container image. That means that we have to mount the cert into the container and additionally point any applications to it (like Node.js).

```box { type=note }
This file is cut to only include the options edited from the default
```

{{< file "yaml" "config.yaml" >}}

```yaml
runner:
  envs:
    NODE_EXTRA_CERTS: /etc/ssl/certs/ca-certificates.crt
  # ...

container:
  options: '--mount type=bind,source=/etc/ssl/certs/ca-certificates.crt,target=/etc/ssl/certs/ca-certificates.crt,readonly'
  valid_volumes: ['/etc/ssl/certs/ca-certificates.crt']
  # ...

# ...
```

With these options we mount the the `/etc/ssl/certs/ca-certificates.crt` file into the container running the actions workflow. We also need to specify this file for Node.js to use since actions like my [eslint-annotations](https://github.com/DerLev/eslint-annotations/) use the Node.js runtime which itself employs its own trusted roots store. We just need to specify the `NODE_EXTRA_CERTS` environment variable to include our root cert.

That's it! With that our Gitea Act Runner can run workflows through our local Gitea instance secured by our own CA.

```box { type=source }
https://forum.gitea.com/t/cannot-checkout-a-repository-hosted-on-a-gitea-instance-using-self-signed-certificate-server-certificate-verification-failed/7903/3
```
