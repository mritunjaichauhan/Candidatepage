#!/bin/bash

# Print Node and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install with npm
echo "Installing dependencies with npm ci..."
npm ci

# Build the application
echo "Building the application..."
npm run build

echo "Build completed!"
