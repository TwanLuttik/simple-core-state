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
echo "📝 Updating version ($VERSION_TYPE)..."
npm version $VERSION_TYPE

# Get the new version number
NEW_VERSION=$(node -p "require('./package.json').version")

# Publish to npm
echo "🚀 Publishing to npm..."
npm publish

echo -e "${GREEN}✨ Released version $NEW_VERSION successfully!${NC}"
