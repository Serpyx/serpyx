#!/bin/bash

echo "🚀 Serpyx Sunucu Kurulum Scripti Başlıyor..."
echo "=========================================="

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hata kontrolü
set -e

echo -e "${YELLOW}📦 1. Sistem güncellemesi yapılıyor...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ Sistem güncellemesi tamamlandı!${NC}"

echo -e "${YELLOW}📦 2. Node.js kurulumu yapılıyor...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
echo -e "${GREEN}✅ Node.js kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📦 3. Git kurulumu yapılıyor...${NC}"
apt install -y git
echo -e "${GREEN}✅ Git kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📦 4. PM2 kurulumu yapılıyor...${NC}"
npm install -g pm2
echo -e "${GREEN}✅ PM2 kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📦 5. Nginx kurulumu yapılıyor...${NC}"
apt install -y nginx
echo -e "${GREEN}✅ Nginx kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📦 6. UFW firewall kurulumu yapılıyor...${NC}"
apt install -y ufw
echo -e "${GREEN}✅ UFW firewall kurulumu tamamlandı!${NC}"

echo -e "${YELLOW}📦 7. Proje klonlanıyor...${NC}"
cd /var/www
if [ -d "serpyx" ]; then
    echo "Serpyx klasörü zaten var, güncelleniyor..."
    cd serpyx
    git pull
else
    echo "Serpyx projesi klonlanıyor..."
    git clone https://github.com/yourusername/serpyx.git
    cd serpyx
fi
echo -e "${GREEN}✅ Proje klonlandı!${NC}"

echo -e "${YELLOW}📦 8. Dosya izinleri ayarlanıyor...${NC}"
chown -R www-data:www-data /var/www/serpyx
chmod -R 755 /var/www/serpyx
echo -e "${GREEN}✅ Dosya izinleri ayarlandı!${NC}"

echo -e "${YELLOW}📦 9. Server bağımlılıkları yükleniyor...${NC}"
cd /var/www/serpyx/server
npm install
echo -e "${GREEN}✅ Server bağımlılıkları yüklendi!${NC}"

echo -e "${YELLOW}📦 10. Client bağımlılıkları yükleniyor...${NC}"
cd /var/www/serpyx/client
npm install
echo -e "${GREEN}✅ Client bağımlılıkları yüklendi!${NC}"

echo -e "${YELLOW}📦 11. Client build ediliyor...${NC}"
npm run build
echo -e "${GREEN}✅ Client build edildi!${NC}"

echo -e "${YELLOW}📦 12. .env dosyası oluşturuluyor...${NC}"
cd /var/www/serpyx
cat > .env << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=5000
API_URL=http://46.62.167.63:5000
FRONTEND_URL=https://serpyx.com

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=serpyx
DB_USER=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=serpyx-super-secret-jwt-key-2025-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=serpyx-super-secret-refresh-key-2025-production
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (Gmail)
EMAIL_USER=serpyx0@gmail.com
EMAIL_PASS=hlvc nxwv echd aegy

# Production
CORS_ORIGIN=https://serpyx.com
EOF
echo -e "${GREEN}✅ .env dosyası oluşturuldu!${NC}"

echo -e "${YELLOW}📦 13. PM2 ile backend başlatılıyor...${NC}"
cd /var/www/serpyx/server
pm2 start app.js --name "serpyx-backend"
pm2 save
pm2 startup
echo -e "${GREEN}✅ Backend başlatıldı!${NC}"

echo -e "${YELLOW}📦 14. Nginx konfigürasyonu oluşturuluyor...${NC}"
cat > /etc/nginx/sites-available/serpyx << 'EOF'
server {
    listen 80;
    server_name serpyx.com www.serpyx.com 46.62.167.63;

    # Frontend
    location / {
        root /var/www/serpyx/client/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF
echo -e "${GREEN}✅ Nginx konfigürasyonu oluşturuldu!${NC}"

echo -e "${YELLOW}📦 15. Nginx etkinleştiriliyor...${NC}"
ln -sf /etc/nginx/sites-available/serpyx /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx etkinleştirildi!${NC}"

echo -e "${YELLOW}📦 16. Firewall ayarları yapılıyor...${NC}"
ufw --force enable
ufw allow ssh
ufw allow 80
ufw allow 443
ufw allow 5000
echo -e "${GREEN}✅ Firewall ayarları yapıldı!${NC}"

echo -e "${YELLOW}📦 17. SSL sertifikası alınıyor...${NC}"
apt install -y certbot python3-certbot-nginx
certbot --nginx -d serpyx.com -d www.serpyx.com --non-interactive --agree-tos --email admin@serpyx.com
echo -e "${GREEN}✅ SSL sertifikası alındı!${NC}"

echo -e "${YELLOW}📦 18. Otomatik SSL yenileme ayarlanıyor...${NC}"
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
echo -e "${GREEN}✅ SSL yenileme ayarlandı!${NC}"

echo ""
echo -e "${GREEN}🎉 SERPYX SUNUCU KURULUMU TAMAMLANDI!${NC}"
echo "=========================================="
echo -e "${GREEN}✅ Frontend: https://serpyx.com${NC}"
echo -e "${GREEN}✅ Backend API: https://serpyx.com/api${NC}"
echo -e "${GREEN}✅ E-posta sistemi: Aktif${NC}"
echo ""
echo -e "${YELLOW}📊 Durum kontrolü:${NC}"
echo "PM2 durumu: pm2 status"
echo "Nginx durumu: systemctl status nginx"
echo "Firewall durumu: ufw status"
echo ""
echo -e "${GREEN}🚀 Serpyx başarıyla deploy edildi!${NC}"
