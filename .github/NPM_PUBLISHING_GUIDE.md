# NPM Publishing Setup Guide

This guide explains how to set up and use the GitHub Action to publish your @webticks packages to npm.

## Prerequisites

1. **npm Account**: You need an npm account. Sign up at [npmjs.com](https://www.npmjs.com) if you don't have one.

2. **npm Organization**: Create the `@webticks` organization on npm:
   - Go to https://www.npmjs.com/org/create
   - Create organization named `webticks`
   - Choose "Free" plan (for public packages)

3. **npm Access Token**: Generate an automation token:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Automation"
   - Copy the token (you won't see it again!)

## Setup Steps

### 1. Add npm Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm automation token
6. Click **Add secret**

### 2. Update Package Dependencies

Before publishing, you need to replace `workspace:*` dependencies with actual version numbers.

Run this script or manually update each package.json:

```bash
# Update all package.json files to use version 0.0.1 instead of workspace:*
find packages -name "package.json" -exec sed -i '' 's/"workspace:\*"/"^0.0.1"/g' {} \;
```

Or manually update:
- `packages/node/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`
- `packages/react/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`
- `packages/angular/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`
- `packages/vue/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`
- `packages/nextjs/package.json` - Change `@webticks/react` from `workspace:*` to `^0.0.1`
- `packages/sveltekit/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`
- `packages/nuxt/package.json` - Change `@webticks/core` from `workspace:*` to `^0.0.1`

### 3. Add Package Metadata

For better npm listing, add these fields to each package.json:

```json
{
  "description": "Your package description",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/webticks.git",
    "directory": "packages/PACKAGE_NAME"
  },
  "keywords": ["analytics", "tracking", "web-analytics"],
  "homepage": "https://github.com/yourusername/webticks#readme",
  "bugs": {
    "url": "https://github.com/yourusername/webticks/issues"
  }
}
```

## How to Publish

### Option 1: Manual Trigger (Recommended for first publish)

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Publish to npm** workflow
4. Click **Run workflow** button
5. Select branch (usually `main`)
6. Check "Publish all packages"
7. Click **Run workflow**

### Option 2: Create a Release

1. Go to your GitHub repository
2. Click **Releases** → **Create a new release**
3. Create a new tag (e.g., `v0.0.1`)
4. Fill in release title and description
5. Click **Publish release**
6. The workflow will automatically trigger

### Option 3: Push a Version Tag

```bash
git tag v0.0.1
git push origin v0.0.1
```

## Workflow Features

✅ **Automatic builds** - Builds Angular and Nuxt packages before publishing
✅ **Provenance** - Adds npm provenance for supply chain security
✅ **Public access** - Publishes packages as public (free)
✅ **Dependency order** - Publishes core first, then dependent packages
✅ **Summary** - Shows all published package versions

## Trigger Options

The workflow can be triggered in three ways (configured in the YAML):

1. **Manual** (`workflow_dispatch`) - Via GitHub UI
2. **Release** (`release: created`) - When you create a GitHub release
3. **Tag push** (commented out) - When you push a version tag

You can enable/disable these in `.github/workflows/publish-to-npm.yml`

## Publishing Order

Packages are published in dependency order:

1. `@webticks/core` (no dependencies)
2. `@webticks/node` (depends on core)
3. `@webticks/react` (depends on core)
4. `@webticks/angular` (depends on core)
5. `@webticks/vue` (depends on core)
6. `@webticks/next` (depends on react)
7. `@webticks/sveltekit` (depends on core)
8. `@webticks/nuxt` (depends on core)

## Troubleshooting

### Error: "You must be logged in to publish packages"
- Check that `NPM_TOKEN` secret is set correctly in GitHub
- Verify the token hasn't expired

### Error: "You do not have permission to publish"
- Ensure you're a member of the `@webticks` npm organization
- Check that the organization exists on npm

### Error: "Package name too similar to existing package"
- The `@webticks` scope might be taken
- Choose a different scope or package name

### Error: "Version already exists"
- Increment the version number in package.json
- npm doesn't allow republishing the same version

## Version Management

### Manual Versioning (Current Setup)

Update versions manually before publishing:

```bash
# Update all packages to new version
# Edit each package.json manually or use a script
```

### Automated Versioning (Optional)

You can use tools like:
- **Changesets**: `pnpm add -D -w @changesets/cli`
- **Lerna**: `pnpm add -D -w lerna`
- **npm version**: Built-in npm command

## After First Publish

Once published, users can install your packages:

```bash
npm install @webticks/core
npm install @webticks/react
npm install @webticks/node
# etc.
```

## Next Steps

1. ✅ Set up npm organization
2. ✅ Add NPM_TOKEN to GitHub secrets
3. ✅ Update workspace dependencies to version numbers
4. ✅ Add package metadata (description, author, etc.)
5. ✅ Run the workflow manually for first publish
6. ✅ Verify packages on npmjs.com
7. ✅ Update README.md with npm installation instructions

## Security Notes

- Never commit your npm token to git
- Use automation tokens (not classic tokens) for CI/CD
- Enable 2FA on your npm account
- Regularly rotate your npm tokens
- Use provenance for supply chain security (already enabled)
