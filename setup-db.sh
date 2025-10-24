#!/bin/bash

# Database configuration
DB_NAME="library_db"
DB_USER="postgres"
DB_PASSWORD="postgres"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT &>/dev/null; then
    echo "PostgreSQL is not running. Please start PostgreSQL and try again."
    exit 1
fi

# Create database and user
echo "Setting up database..."

# Create database if not exists
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists or creation failed"

# Create user if not exists
sudo -u postgres psql -c "DO \$\$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
    ELSE
        ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
    END IF;
END \$\$;" 2>/dev/null || echo "User creation/update failed"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Connect to the database and set up schema privileges
sudo -u postgres psql -d $DB_NAME -c "
    -- Grant all privileges on schema public
    GRANT ALL ON SCHEMA public TO $DB_USER;
    
    -- Grant all privileges on all tables in the public schema
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
    
    -- Grant all privileges on all sequences in the public schema
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
    
    -- Set default privileges for future objects
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TYPES TO $DB_USER;
" || echo "Failed to set up schema privileges"

echo "\nYou can now start the application with: pnpm dev"