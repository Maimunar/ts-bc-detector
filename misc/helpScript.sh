#!/bin/bash

# Check for input directory
if [ -z "$1" ]; then
    echo "Usage: $0 <directory> [output_file]"
    exit 1
fi

# Set input directory and output file
INPUT_DIR="$1"
OUTPUT_FILE="${2:-output.txt}"

# Ensure the input directory exists
if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Directory '$INPUT_DIR' does not exist."
    exit 1
fi

# Find all files, get their directories, make paths relative, sort uniquely, and save
find "$INPUT_DIR" -type f -exec dirname {} \; \
    | sed "s|^$INPUT_DIR/||" \
    | sort -u \
    > "$OUTPUT_FILE"

echo "Directory paths saved to $OUTPUT_FILE"
