#!/bin/bash

# Update all HTML files to reference the JavaScript files from their new location in static/js
find /Users/adriandimitrov/Downloads/Sprint3-ASYA-ANGELOVA-patch-1-2/frontend -name "*.html" -type f -exec sed -i '' 's|src="../\([^"]*\.js\)"|src="/static/js/\1"|g' {} \;

echo "Updated all HTML files to reference JavaScript files from static/js directory"
