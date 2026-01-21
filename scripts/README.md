# Publishing Scripts

This directory contains scripts for publishing the @webticks packages to npm.

## Initial Publish Script

### `initial-publish.sh`

This script performs the first-time publish of all @webticks packages to npm.

**Prerequisites:**
- You must be logged in to npm: `npm login`
- You need publish permissions for the `@webticks` scope
- All dependencies must be installed: `pnpm install`

**What it does:**
1. ✅ Verifies you're logged in to npm
2. 🔨 Builds packages that require building (Angular, Nuxt)
3. 📦 Publishes all 8 packages in dependency order:
   - @webticks/core (first, as others depend on it)
   - @webticks/node
   - @webticks/react
   - @webticks/angular
   - @webticks/vue
   - @webticks/next
   - @webticks/sveltekit
   - @webticks/nuxt
4. 📊 Shows a summary of published/failed packages
5. 📝 Provides next steps for configuring trusted publishing

**Usage:**

```bash
# From the project root
./scripts/initial-publish.sh
```

**Features:**
- Confirmation prompt before publishing
- Publishes with `--provenance` for supply chain security
- Publishes with `--access public` for scoped packages
- Error handling and summary reporting
- Tracks which packages succeeded/failed

**After Publishing:**

Once all packages are published, configure trusted publishing on npm:

1. Visit each package's access page:
   - https://www.npmjs.com/package/@webticks/core/access
   - https://www.npmjs.com/package/@webticks/node/access
   - (and so on for all 8 packages)

2. Click "Publish from GitHub Actions"

3. Enter:
   - **Repository**: `Celerinc/webticks`
   - **Workflow**: `publish-to-npm.yml`

4. Future publishes will use OIDC (no tokens needed!)

**Troubleshooting:**

- **Error: Not logged in**: Run `npm login` first
- **Error: 2FA required**: Use an automation token or enter OTP when prompted
- **Error: Package already exists**: Package was already published, skip to trusted publishing configuration
- **Error: Permission denied**: Ensure you have publish access to the `@webticks` scope

## Future Publishing

After initial publish and trusted publishing configuration, use the GitHub Action workflow:
- Manual trigger via GitHub Actions UI
- Automatic on release creation
- Automatic on version tag push (if enabled)
