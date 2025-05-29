#!/bin/bash

# Set the root directory
ROOT_DIR="input"

# Define output directories for v1 and v2
V1_DIR="$ROOT_DIR/v1"
V2_DIR="$ROOT_DIR/v2"

# Create the v1 and v2 directories
mkdir -p "$V1_DIR"
mkdir -p "$V2_DIR"

# Find all leaf directories containing both v1.ts and v2.ts
find "$ROOT_DIR" -type f -name "v1.ts" | while read -r v1_path; do
    dir_path=$(dirname "$v1_path")
    
    # Check if v2.ts also exists in the same directory
    if [[ -f "$dir_path/v2.ts" ]]; then
        # Get the relative path from the root directory
        rel_path="${dir_path#$ROOT_DIR/}"
        
        # Create corresponding directories in v1 and v2 folders
        mkdir -p "$V1_DIR/$rel_path"
        mkdir -p "$V2_DIR/$rel_path"

        # Copy and rename the files
        cp "$dir_path/v1.ts" "$V1_DIR/$rel_path/file.ts"
        cp "$dir_path/v2.ts" "$V2_DIR/$rel_path/file.ts"
    fi
done
