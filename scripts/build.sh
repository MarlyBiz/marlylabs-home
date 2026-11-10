#!/bin/sh
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
mkdir -p node_modules
cp index.html sw.js manifest.webmanifest _headers dist/
cp -r icons dist/
echo "dist/ ready: $(ls dist | tr '\n' ' ')"
