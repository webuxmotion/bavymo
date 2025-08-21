#!/bin/bash

# ==============================
# CONFIGURATION VARIABLES
# ==============================
APP_NAME="bavymo"
APP_DIR="/var/www/$APP_NAME"
REPO_URL="https://github.com/webuxmotion/bavymo"
DOMAIN=""
VITE_SOCKET_URL=""
EMAIL=""
BASE_URL="https://$DOMAIN"

# ==============================
# SYSTEM UPDATE & DEPENDENCIES
# ==============================
sudo apt update && sudo apt upgrade -y
sudo apt install -y git build-essential curl ufw nginx certbot

# ==============================
# NODEJS INSTALLATION
# ==============================
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ==============================
# FIREWALL SETUP
# ==============================
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# ==============================
# CERTBOT PREPARATION (HTTP ONLY)
# ==============================
sudo mkdir -p /var/www/certbot/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/certbot

# Temporary Nginx config for certbot
NGINX_TEMP_CONF="/etc/nginx/sites-available/$APP_NAME-temp"
sudo tee $NGINX_TEMP_CONF > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    location / {
        return 404;
    }
}
EOL

sudo ln -sf $NGINX_TEMP_CONF /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# ==============================
# OBTAIN SSL CERTIFICATES
# ==============================
sudo certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL

# ==============================
# NGINX CONFIG FOR HTTPS + REDIRECT
# ==============================
NGINX_CONF="/etc/nginx/sites-available/$APP_NAME"
sudo tee $NGINX_CONF > /dev/null <<EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    location /webhook {
        proxy_pass http://localhost:9000/webhook;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo nginx -t -c /etc/nginx/sites-available/$APP_NAME
sudo nginx -c /etc/nginx/sites-available/$APP_NAME

# ==============================
# APP DEPLOYMENT
# ==============================
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR || exit

if [ ! -d "$APP_DIR/.git" ]; then
    git clone $REPO_URL $APP_DIR
else
    git reset --hard
    git pull origin main
fi

npm install

# ==============================
# CREATE ENV FILE
# ==============================
cd client
npm install

cat > .env.production <<EOL
VITE_SOCKET_URL=$VITE_SOCKET_URL
EOL

cd ../server
npm install
cd ..

# ==============================
# BUILD AND RUN APP WITH PM2
# ==============================
npm run build

sudo npm install -g pm2
pm2 delete $APP_NAME || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup systemd

# ==============================
# FINAL MESSAGE
# ==============================
echo "✅ Deployment completed! Visit: $BASE_URL"
echo "⚠️ Don't forget to set up auto-renewal for Certbot:"
echo "sudo crontab -e"
echo "0 3 * * * certbot renew --quiet"
