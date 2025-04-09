#!/bin/bash

# Stop and remove the containers
docker-compose down

# Update all route files to use the correct db module path
find /Users/adriandimitrov/Downloads/Sprint3-ASYA-ANGELOVA-patch-1-2/app/routes -name "*.js" -type f -exec sed -i '' 's|require(\x27./db\x27)|require(\x27../services/db\x27)|g' {} \;

# Rebuild and restart the containers
docker-compose up -d

echo "Updated all route files and restarted Docker containers"
