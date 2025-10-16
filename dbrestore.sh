#!/bin/bash

# Database connection details for local development
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="feedback"
DB_USER="postgres"
DB_PASSWORD="postgres"

BACKUP_DIR=".backups"

# Function to find the most recent backup
find_latest_backup() {
    LATEST=$(find "$BACKUP_DIR" -name "backup_*.sql" 2>/dev/null | sort -r | head -n 1)
    echo "$LATEST"
}

# Determine which backup file to use
if [ -z "$1" ]; then
    # No argument provided, use most recent backup
    BACKUP_FILE=$(find_latest_backup)
    if [ -z "$BACKUP_FILE" ]; then
        echo "No backup files found in $BACKUP_DIR"
        exit 1
    fi
    echo "No backup file specified, using most recent: $BACKUP_FILE"
else
    # Use provided backup file path
    BACKUP_FILE="$1"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

# Confirm before restoring
echo "WARNING: This will restore the database from: $BACKUP_FILE"
echo "This operation will DROP and recreate the database: $DB_NAME"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Drop and recreate database
echo "Dropping and recreating database..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# Restore the backup
echo "Restoring database from backup..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Database restored successfully from: $BACKUP_FILE"
else
    echo "Database restore failed!"
    exit 1
fi
