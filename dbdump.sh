#!/bin/bash

# Database connection details for local development
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="feedback"
DB_USER="postgres"
DB_PASSWORD="postgres"

# Create backup directory if it doesn't exist
BACKUP_DIR=".backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Perform the database dump
echo "Creating database backup..."
PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_FILE"
else
    echo "Backup failed!"
    exit 1
fi
