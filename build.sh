#!/bin/bash

# Ensure we're using npm
if command -v npm >/dev/null 2>&1; then
    echo "Using npm for installation..."
    # Remove existing node_modules if it exists
    rm -rf node_modules
    # Clean npm cache
    npm cache clean --force
    # Install dependencies
    npm ci
    # Build the project
    npm run build
else
    echo "npm is not installed!"
    exit 1
fi
