#!/bin/bash

echo "🚀 Serpyx Nginx ve Backend Düzeltme Scripti"
echo "=========================================="

# 1. Nginx Config'i düzelt
echo "📝 Nginx config düzeltiliyor..."
cat > /etc/nginx/sites-available/serpyx.com << 'EOF'
server {
    listen 80;
    server_name serpyx.com www.serpyx.com 46.62.167.63;

    root /var/www/serpyx/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 2. Dosya izinlerini düzelt
echo "🔐 Dosya izinleri düzeltiliyor..."
chown -R www-data:www-data /var/www/serpyx
chmod -R 755 /var/www/serpyx

# 3. index.html dosyasını oluştur (eğer yoksa)
echo "📄 index.html oluşturuluyor..."
cat > /var/www/serpyx/client/dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Serpyx</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; text-align: center; }
        .status { padding: 20px; margin: 10px; border-radius: 5px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <h1>🚀 Serpyx Çalışıyor!</h1>
    <div id="status">Backend kontrol ediliyor...</div>
    
    <script>
        fetch('/api/health')
            .then(res => res.json())
            .then(data => {
                document.getElementById('status').innerHTML = 
                    '<div class="status success">✅ Backend: ' + data.message + '</div>';
            })
            .catch(err => {
                document.getElementById('status').innerHTML = 
                    '<div class="status error">❌ Backend Hatası: ' + err.message + '</div>';
            });
    </script>
</body>
</html>
EOF

# 4. Backend'i yeniden başlat
echo "🔄 Backend yeniden başlatılıyor..."
pm2 restart serpyx-backend

# 5. Nginx test ve restart
echo "🔧 Nginx test ediliyor..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✅ Nginx config doğru"
    systemctl restart nginx
    echo "✅ Nginx yeniden başlatıldı"
else
    echo "❌ Nginx config hatası!"
    exit 1
fi

# 6. Test
echo "🧪 Test ediliyor..."
sleep 2
echo "Backend test:"
curl -s http://localhost:5000/api/health | head -1
echo ""
echo "Frontend test:"
curl -I http://localhost 2>/dev/null | head -1

echo ""
echo "🎉 Tamamlandı! Şimdi http://46.62.167.63 adresini test et!"





