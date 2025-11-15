# Guide: Publishing Your `pnpm` Monorepo

This guide covers the command-line steps to publish your `pnpm` workspace packages. These commands are run from the **root directory** of your `webticks` project.

---

## Publishing to the Public `npm` Registry

Use this method to publish your packages for anyone to install.

### 1. Install Dependencies
First, ensure all workspace packages are linked and dependencies are installed.

```bash
pnpm install
```
2. Log in to npm
You only need to do this once. This command authenticates your machine with the npm registry.

```bash
npm login
```
3. Update Package Versions (Recommended)
Before publishing, it's a best practice to bump the version number. pnpm can do this for all your packages at once.

Bash

# For a patch release (e.g., 1.0.0 -> 1.0.1)
```bash
pnpm version patch
```
# Or for a minor release (e.g., 1.0.0 -> 1.1.0)

```bash
pnpm version minor
```
4. Publish All Packages

This single command will find every package in your workspaces and publish them to npm.
```bash
pnpm publish -r --access public
```
-r (or --recursive): Tells pnpm to run this command in all workspace packages.

--access public: This is required for scoped packages (like @webticks/reactjs) to be published to the public npm registry.

Publishing to a Private npm Registry
If you use a private registry (like GitHub Packages, Artifactory, or Verdaccio), the process is slightly different.

Method 1: Configure .npmrc (Recommended)
```
# Source - https://stackoverflow.com/a/54540693
# Posted by Nathan
# Retrieved 2025-11-12, License - CC BY-SA 4.0

registry=https://registry.npmjs.com/
_auth="<token>"
email=<email>
always-auth=true
```
This is the standard and most reliable method.

Create a file named .npmrc in the root of your webticks project.

Add a line to this file that scopes your packages to your private registry's URL.

File: webticks/.npmrc

**@webticks:registry=https://your-private-registry-url.com**