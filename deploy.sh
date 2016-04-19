#!/usr/bin/env bash
# This bash file will deploy the dist folder to the project gh-page
set -e

# Base directory for this entire project
BASEDIR=$(cd $(dirname $0) && pwd)

# Destination directory for built code
ASSETSDIR="$BASEDIR/dist"

# make folder and copy files
mkdir "$ASSETSDIR"

cp "$BASEDIR/index.html" "$ASSETSDIR"
cp "$BASEDIR/bower.json" "$ASSETSDIR"
cp  -R "$BASEDIR/img" "$ASSETSDIR"
cp  -R "$BASEDIR/lib" "$ASSETSDIR"

# Create a new Git repo in dist folder
cd "$ASSETSDIR"
bower install
git init

# Set user details
git config user.name "iAyeBot"
git config user.email "iayebot@websemantics.ca"

# First commit, .. horray!
git add .
git commit -m "Deploy to gh-pages"

# Force push ...
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
