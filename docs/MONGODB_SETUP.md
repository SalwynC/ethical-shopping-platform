# MongoDB Atlas Setup Guide

## Quick MongoDB Atlas Setup (FREE - 5 minutes)

### Step 1: Create Free Account
1. Go to: https://cloud.mongodb.com/
2. Click "Get started free" 
3. Sign up with email/Google
4. Choose "Build a database"

### Step 2: Create Free Cluster
1. Select "M0 Sandbox" (FREE forever)
2. Choose your cloud provider (AWS recommended)
3. Select nearest region
4. Cluster name: "ethical-shopping"
5. Click "Create"

### Step 3: Setup Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `ethishop-admin`
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Atlas admin"
6. Click "Add User"

### Step 4: Setup Network Access
1. Click "Network Access" in left sidebar  
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<password>` with your actual password

### Step 6: Update .env file
Update your `backend/.env` file:
```
DATABASE_URL="mongodb+srv://ethishop-admin:YOUR_PASSWORD@ethical-shopping.xxxxx.mongodb.net/ethical-shopping-platform?retryWrites=true&w=majority"
```

### Alternative: Local MongoDB with Docker (if you prefer)
```bash
# Pull and run MongoDB in Docker
docker pull mongo:latest
docker run --name mongodb -p 27017:27017 -d mongo:latest

# Then use this in .env:
DATABASE_URL="mongodb://localhost:27017/ethical-shopping-platform"
```

## Benefits of MongoDB Atlas:
- ✅ FREE 512MB storage
- ✅ No installation needed
- ✅ Automatic backups
- ✅ Global availability
- ✅ Built-in monitoring
- ✅ Perfect for development & production

Once you have the connection string, update the .env file and we can test the connection!