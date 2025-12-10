# Yalc Development Guide

This guide explains how to use [yalc](https://github.com/wclr/yalc) for local package development with WebTicks.

## Hybrid Approach: Workspace + Yalc

WebTicks uses a hybrid dependency management approach:

- **Packages** (`packages/*`): Use **pnpm workspace** for internal dependencies
  - Fast, efficient linking between packages during development
  - Changes to `@webticks/core` are immediately available to all framework packages
  - Run `pnpm install` at the root to set up workspace symlinks

- **Examples** (`examples/*`): Use **yalc** for local testing
  - Mimics real npm installation process
  - Tests packages as users would consume them
  - Isolated from workspace to ensure realistic testing

This approach gives you the best of both worlds: fast package development with workspace, and realistic testing with yalc.

## Prerequisites

Before using yalc, ensure workspace dependencies are installed:

```bash
# From the project root
pnpm install
```

This creates symlinks between packages (e.g., `@webticks/react` → `@webticks/core`).

## What is Yalc?

Yalc is a tool for managing local package dependencies. It acts as a local npm registry on your machine, allowing you to test packages locally before publishing them to npm. It's more reliable than `npm link` and better mimics the actual npm install process.

## Installation

Install yalc globally:

```bash
npm install -g yalc
```

## Publishing Packages Locally

### Publish a Single Package

Navigate to the package directory and publish it locally:

```bash
cd packages/core
yalc publish
```

This copies the package files to yalc's global store (`~/.yalc/packages`).

### Publish All Packages

To publish all WebTicks packages at once:

```bash
# From the project root
cd packages/core && yalc publish && cd ../..
cd packages/react && yalc publish && cd ../..
cd packages/vue && yalc publish && cd ../..
cd packages/angular && yalc publish && cd ../..
cd packages/nextjs && yalc publish && cd ../..
cd packages/nuxt && yalc publish && cd ../..
cd packages/sveltekit && yalc publish && cd ../..
cd packages/node && yalc publish && cd ../..
```

## Using Packages in Example Apps

### Add a Package to an Example App

Navigate to the example app and add the package:

```bash
cd examples/react-app
yalc add @webticks/react
npm install
```

This creates a `.yalc` directory in your project and updates `package.json`.

### Update a Package

After making changes to a package, push the updates to all linked projects:

```bash
cd packages/core
yalc push
```

This automatically updates all example apps that have added this package via yalc.

### Watch Mode (Recommended for Development)

For active development, use `yalc push --watch` to automatically push changes:

```bash
cd packages/core
yalc push --watch
```

## Removing Yalc Packages

### Remove from a Single Project

```bash
cd examples/react-app
yalc remove @webticks/react
npm install
```

### Remove All Yalc Packages

```bash
yalc remove --all
npm install
```

## Common Workflows

### Developing a New Feature

1. Make changes to the package (e.g., `packages/core`)
2. Changes are automatically available to other packages via workspace
3. Publish the package to yalc: `yalc publish` or `yalc push` if already linked
4. Test in an example app
5. Repeat until satisfied

### Testing Across Multiple Frameworks

1. Publish the core package: `cd packages/core && yalc publish`
2. Publish framework packages that depend on core
3. Add packages to example apps: `cd examples/react-app && yalc add @webticks/react`
4. Test each example app

### Cleaning Up

Before committing, ensure you've removed yalc dependencies:

```bash
# In each example app
yalc remove --all
npm install
```

## Tips

- **Use `yalc push`** instead of `yalc publish` when updating an already-published package
- **Check `.yalc` folder** - This folder should not be committed to git (already in `.gitignore`)
- **Use `yalc installations show`** - See which projects are using a specific package
- **Combine with watch mode** - Use `yalc push --watch` for automatic updates during development

## Troubleshooting

### Package not updating

Try removing and re-adding the package:

```bash
yalc remove @webticks/core
yalc add @webticks/core
npm install
```

### Module not found errors

Ensure you've run `npm install` after adding yalc packages:

```bash
npm install
```

### Stale cache

Clear yalc's global store:

```bash
yalc installations clean @webticks/core
```

## Environment Variables

The WebTicks packages now support the `WEBTICKS_APP_ID` environment variable. When using yalc for local development:

1. Create a `.env` file in your example app
2. Add: `WEBTICKS_APP_ID=your-app-id-here`
3. For Vite-based apps, use: `VITE_WEBTICKS_APP_ID=your-app-id-here`

The app ID will be automatically included as a `webticks-app-id` header in all tracking requests.
