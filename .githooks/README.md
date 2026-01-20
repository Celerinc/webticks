# Git Hooks Setup

This directory contains git hooks that should be installed for this project.

## Installation

Run this command from the project root to install the hooks:

```bash
# Copy the pre-push hook to .git/hooks/
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

Or set git to use this directory for hooks:

```bash
git config core.hooksPath .githooks
```

## Pre-Push Hook

The `pre-push` hook automatically:

1. Checks for `workspace:*` dependencies in package.json files
2. Replaces them with actual version numbers (e.g., `^0.0.1`)
3. Stages the modified files
4. Prevents the push and asks you to commit the changes

This ensures that your packages always have real version numbers in the repository, making them ready for npm publishing.

### Example Output

```
🔍 Checking for workspace:* dependencies...
📝 Found workspace:* dependencies. Replacing with ^0.0.1...
✅ Replaced workspace:* with ^0.0.1 in:
packages/node/package.json
packages/react/package.json

⚠️  Files have been staged. Please commit these changes before pushing:
   git commit -m 'chore: replace workspace dependencies with version 0.0.1'
```

## Why This Approach?

- ✅ **Version control** - Actual versions are committed to the repository
- ✅ **Transparency** - You can see exactly what versions are being used
- ✅ **npm ready** - Packages are always ready to publish
- ✅ **Automatic** - No manual find/replace needed
- ✅ **Safe** - Prevents pushing with workspace:* dependencies
