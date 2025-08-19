#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🚀 Starting release process..."

# Clean dist folder
echo "📦 Cleaning dist folder..."
rm -rf dist

# Build TypeScript files without source maps
echo "🛠️  Building TypeScript files..."
npm run build

# Update version based on argument or patch by default
VERSION_TYPE=${1:-patch}
PREID=${2:-}
PUBLISH_TAG=${3:-latest}

echo "📝 Updating version ($VERSION_TYPE${PREID:+, preid=$PREID})..."
if [[ "$VERSION_TYPE" == pre* ]]; then
  npm version "$VERSION_TYPE" --preid="${PREID:-beta}"
else
  npm version "$VERSION_TYPE"
fi

# Get the new version number
NEW_VERSION=$(node -p "require('./package.json').version")

# Publish to npm (with dist-tag)
echo "🚀 Publishing to npm with tag '$PUBLISH_TAG'..."
npm publish --tag "$PUBLISH_TAG"

echo -e "${GREEN}✨ Released version $NEW_VERSION (tag: $PUBLISH_TAG) successfully!${NC}"
