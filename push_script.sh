#!/bin/bash

# Ensure jq is installed (a lightweight JSON processor)
if ! command -v jq &> /dev/null
then
    echo "jq (a lightweight JSON processor) is required but not installed. Please install it and try again."
    exit 1
fi

# Define path to the config file
CONFIG_FILE="./configs/config.json"

# Extract current version
CURRENT_VERSION=$(jq -r '.site.version' $CONFIG_FILE)

# Split version into major, minor, and patch components
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"

# Increment patch version
PATCH_VERSION=$(( ${VERSION_PARTS[2]} + 1 ))

# Construct new version string
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.$PATCH_VERSION"

# Update version in config file
jq ".site.version = \"$NEW_VERSION\"" $CONFIG_FILE > temp.json && mv temp.json $CONFIG_FILE

echo "Version updated to: $NEW_VERSION"

# Run the node script
node ./generate-manifest.js

# Add changes to git and push to GitHub
# git add .
# git commit -m "Auto-update: Version bump to $NEW_VERSION"
# git push

# echo "Changes pushed to GitHub!"

