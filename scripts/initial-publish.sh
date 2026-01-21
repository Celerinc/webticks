#!/bin/bash

# Initial Publish Script for @webticks packages
# This script builds and publishes all packages for the first time
# After this, you can configure trusted publishing on npm

set -e  # Exit on error

echo "========================================="
echo "WebTicks Initial Publish Script"
echo "========================================="
echo ""

# Check if user is logged in to npm
if ! npm whoami &> /dev/null; then
    echo "❌ Error: You are not logged in to npm"
    echo "Please run: npm login"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Get version from root package.json
VERSION=$(node -p "require('./package.json').version")
echo "📦 Publishing version: $VERSION"
echo ""

# Confirm before proceeding
read -p "Are you sure you want to publish all packages? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "========================================="
echo "Step 1: Building packages"
echo "========================================="
echo ""

# Build Angular package
echo "🔨 Building @webticks/angular..."
cd packages/angular
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    pnpm build
    echo "✅ Built @webticks/angular"
else
    echo "⚠️  No build script for @webticks/angular"
fi
cd ../..

# Build Nuxt package
echo "🔨 Building @webticks/nuxt..."
cd packages/nuxt
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    pnpm build
    echo "✅ Built @webticks/nuxt"
else
    echo "⚠️  No build script for @webticks/nuxt"
fi
cd ../..

echo ""
echo "========================================="
echo "Step 2: Publishing packages"
echo "========================================="
echo ""

# Array to track published packages
PUBLISHED=()
FAILED=()

# Function to publish a package
publish_package() {
    local package_name=$1
    local package_dir=$2
    
    echo "📦 Publishing $package_name..."
    cd "$package_dir"
    
    if npm publish --access public --provenance 2>&1; then
        echo "✅ Published $package_name@$VERSION"
        PUBLISHED+=("$package_name")
    else
        echo "❌ Failed to publish $package_name"
        FAILED+=("$package_name")
    fi
    
    cd - > /dev/null
    echo ""
}

# Publish packages in dependency order
publish_package "@webticks/core" "packages/core"
publish_package "@webticks/node" "packages/node"
publish_package "@webticks/react" "packages/react"
publish_package "@webticks/angular" "packages/angular"
publish_package "@webticks/vue" "packages/vue"
publish_package "@webticks/next" "packages/nextjs"
publish_package "@webticks/sveltekit" "packages/sveltekit"
publish_package "@webticks/nuxt" "packages/nuxt"

echo ""
echo "========================================="
echo "Summary"
echo "========================================="
echo ""

if [ ${#PUBLISHED[@]} -gt 0 ]; then
    echo "✅ Successfully published ${#PUBLISHED[@]} package(s):"
    for pkg in "${PUBLISHED[@]}"; do
        echo "   - $pkg@$VERSION"
    done
    echo ""
fi

if [ ${#FAILED[@]} -gt 0 ]; then
    echo "❌ Failed to publish ${#FAILED[@]} package(s):"
    for pkg in "${FAILED[@]}"; do
        echo "   - $pkg"
    done
    echo ""
    exit 1
fi

echo "========================================="
echo "Next Steps"
echo "========================================="
echo ""
echo "1. Configure trusted publishing on npm for each package:"
echo "   Visit: https://www.npmjs.com/package/PACKAGE_NAME/access"
echo ""
echo "2. For each package, click 'Publish from GitHub Actions' and enter:"
echo "   - Repository: Celerinc/webticks"
echo "   - Workflow: publish-to-npm.yml"
echo ""
echo "3. After configuration, future publishes will use OIDC (no tokens needed)"
echo ""
echo "✅ All packages published successfully!"
