#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Apply database migrations (this also generates Prisma Client)
echo "Applying database migrations and generating Prisma Client..."
npx prisma migrate dev --name init

# Start the application on port 9000
echo "Starting the application on port 9000..."
npm run dev -- -p 9000
