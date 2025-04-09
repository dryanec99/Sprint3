#!/bin/bash

# Script to update all HTML files to make the Community Fridge logo clickable
# This will find all header h1 tags with "Community Fridge" and make them clickable

# Directory containing HTML files
HTML_DIR="/Users/adriandimitrov/Downloads/sprint4/frontend"

# Find all HTML files
HTML_FILES=$(find "$HTML_DIR" -name "*.html")

# Counter for modified files
MODIFIED_COUNT=0

# Process each HTML file
for file in $HTML_FILES; do
  echo "Processing $file..."
  
  # Check if the file contains a header h1 with Community Fridge that's not already a link
  if grep -q "<h1>Community Fridge</h1>" "$file"; then
    echo "  Found header to update"
    
    # Replace the header with a clickable version
    sed -i '' 's|<h1>Community Fridge</h1>|<h1><a href="/" style="color: white; text-decoration: none;">Community Fridge</a></h1>|g' "$file"
    
    echo "  Updated header to be clickable"
    MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
  else
    echo "  No matching header found or already modified"
  fi
done

echo "Completed! Modified $MODIFIED_COUNT files."
