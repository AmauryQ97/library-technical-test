# Technical Test Library

## Prerequisites

- Node 24.5.0
- pnpm 10.14.0
- PostgreSQL 14.18
- Bash (for setup script)

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AmauryQ97/library-technical-test
   cd library-technical-test
   ```

2. **Set up the database**
   - Run the setup script (requires sudo privileges for PostgreSQL):
     ```bash
     chmod +x setup-db.sh
     ./setup-db.sh
     ```

## To improve

[] more tests  
[] check book isn't already existing
[] roles like admin, editor, reader..
[] improve some error messages
[] use sse (server sent event) to inform front when a resource has been updated/or all
[] implement all features in front
[] implement author and loan in back and front
[] logs