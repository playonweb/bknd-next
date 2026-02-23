#!/bin/bash

# Script to sync local .env secrets to GitHub Secrets
# Requires GitHub CLI (gh) to be installed and authenticated

if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create one from env.example"
  exit 1
fi

# Load .env variables
# Note: This is a simple loader, doesn't handle spaces or complex values perfectly
# but works for standard key=value pairs.
while IFS= read -r line || [ -n "$line" ]; do
  # Skip comments and empty lines
  [[ $line =~ ^#.*$ ]] && continue
  [[ -z $line ]] && continue

  # Extract key and value
  key=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)

  if [ -z "$value" ]; then
    echo "Skipping $key (empty value)"
    continue
  fi

  # Special handling for KUBECONFIG if it's a path
  if [ "$key" == "KUBECONFIG_PATH" ]; then
    expanded_path="${value/#\~/$HOME}"
    if [ -f "$expanded_path" ]; then
      echo "Syncing KUBECONFIG content from $expanded_path..."
      gh secret set KUBECONFIG < "$expanded_path"
    else
      echo "Warning: KUBECONFIG file not found at $expanded_path"
    fi
    continue
  fi

  echo "Syncing $key..."
  gh secret set "$key" --body "$value"

done < .env

echo "✅ All secrets synced to GitHub!"