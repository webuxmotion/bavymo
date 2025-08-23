#!/bin/bash

source ./deploy.conf

# ==============================
# APP DEPLOYMENT
# ==============================
cd $APP_DIR || exit

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
npm run build
cd ..

# ==============================
# RESTART APP WITH PM2
# ==============================
pm2 delete $APP_NAME || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save

# ==============================
# FINAL MESSAGE
# ==============================
echo "✅ Minimal deployment completed! App rebuilt and restarted."