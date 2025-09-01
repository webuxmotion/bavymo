#!/bin/bash

# Load environment variables
source ./.env.system
source ./.env.client
source ./.env.server

# ==============================
# APP DEPLOYMENT
# ==============================
cd "$SYS_APP_DIR" || exit

# Update repo
git fetch origin
git reset --hard origin/main

# ==============================
# CLIENT
# ==============================
cd client
npm install
cat > .env.production <<EOL
VITE_SOCKET_URL=$VITE_SOCKET_URL
EOL
npm run build
cd ..

# ==============================
# SERVER
# ==============================
cd server
npm install
cat > .env.production <<EOL
MONGO_USER=$SRV_MONGO_USER
MONGO_PASSWORD="$SRV_MONGO_PASSWORD"
MONGO_DB=$SRV_MONGO_DB
MONGO_HOST=$SRV_MONGO_HOST
MONGO_PORT=$SRV_MONGO_PORT
EOL
npm run build
cd ..

# ==============================
# RESTART APP WITH PM2
# ==============================
pm2 delete "$SYS_APP_NAME" || true
pm2 start npm --name "$SYS_APP_NAME" -- start --env production
pm2 save

echo "✅ Soft deployment completed! App rebuilt and restarted."