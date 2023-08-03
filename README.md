# derlev-xyz

[![CI/CD](https://github.com/DerLev/derlev-xyz/actions/workflows/integration-deployment.yml/badge.svg?branch=main&event=push)](https://github.com/DerLev/derlev-xyz/actions/workflows/integration-deployment.yml)

**Monorepo of derlev.xyz**

## Dircetory structure

```plaintext
📦derlev-xyz
 ┣ 📂dashboard
 ┃ ┣ ✨···
 ┃ ┗ 📜README.md
 ┣ 📂functions
 ┃ ┣ ✨···
 ┃ ┗ 📜README.md
 ┣ 📂homepage
 ┃ ┣ ✨···
 ┃ ┗ 📜README.md
 ┣ ✨···
 ┣ 🔑LICENSE
 ┗ 📜README.md
```

Inside each of these three subfolders is a Nodejs app with Yarn. In each README 
is more info about the app. Sadly due to how Googles buildpacks work every 
directory has its own seperate `package.json` and `yarn.lock`.
