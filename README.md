# 🐍 Serpyx - Oyna, Kazan, Geleceği İnşa Et

Serpyx, modern web teknolojileri ile geliştirilmiş, kripto para entegrasyonlu yılan oyunudur. Oyuncular coin kazanabilir, başarımlar elde edebilir ve gelecekte bu coinleri gerçek kripto para birimine dönüştürebilir.

## 🚀 Q2 2025 Altyapı Planı

### 📅 Zaman Çizelgesi
- **Başlangıç**: Nisan 2025
- **Bitiş**: Haziran 2025
- **Toplam Süre**: 3 Ay

### 🎯 Ana Hedefler
- ✅ **Backend Altyapısı**: Node.js/Express API
- ✅ **Veritabanı**: PostgreSQL + Redis
- ✅ **Blockchain**: Ethereum testnet entegrasyonu
- ✅ **Güvenlik**: JWT, Rate limiting, Helmet
- ✅ **Dokümantasyon**: Swagger/OpenAPI

### 🛠️ Teknoloji Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js 18+, Express.js
- **Database**: PostgreSQL 15+, Redis 7+
- **Blockchain**: Ethereum, Web3.js, MetaMask
- **DevOps**: Docker, GitHub Actions, AWS/Vercel

## ✨ Özellikler

- 🎮 **Modern Yılan Oyunu**: Canvas API ile geliştirilmiş akıcı oyun deneyimi
- 🪙 **Coin Sistemi**: Oyun sırasında coin kazanın
- 🏆 **Başarım Sistemi**: Çeşitli hedefler ve ödüller
- 📅 **Günlük Görevler**: Her gün yeni görevler ve bonuslar
- 🎁 **Günlük Bonus**: Düzenli giriş yaparak bonus coin kazanın
- 🎨 **Özelleştirme**: Farklı yılan renkleri ve karakterler
- 📊 **İstatistikler**: Detaylı oyun istatistikleri
- 🏪 **Mağaza**: Coin ile renk satın alın
- 📈 **Lider Tablosu**: En iyi oyuncuları görün
- 🎵 **Müzik Kontrolü**: Oyun müziği ve ses efektleri
- 🔗 **Blockchain Entegrasyonu**: SPX token sistemi (Q2 2025)

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm 8+
- PostgreSQL 15+
- Redis 7+
- Docker (opsiyonel)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/serpyx/serpyx-game.git
cd serpyx-game
```

2. **Frontend bağımlılıklarını yükleyin**
```bash
cd client
npm install
```

3. **Backend bağımlılıklarını yükleyin**
```bash
cd ../server
npm install
```

4. **Environment variables'ı ayarlayın**
```bash
cp env.example .env
# .env dosyasını düzenleyin
```

5. **Veritabanını başlatın**
```bash
# Docker ile (önerilen)
docker-compose up -d postgres redis

# Veya manuel olarak
# PostgreSQL ve Redis'i başlatın
```

6. **Backend'i başlatın**
```bash
cd server
npm run dev
```

7. **Frontend'i başlatın**
```bash
cd client
npm run dev
```

8. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🛠️ Geliştirme

### Mevcut Scriptler

```bash
# Frontend
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run preview      # Build önizleme
npm run lint         # Linting
npm run lint:fix     # Linting düzeltme

# Backend
npm run dev          # Geliştirme sunucusu
npm run test         # Testleri çalıştır
npm run migrate      # Veritabanı migration
npm run seed         # Veritabanı seed
```

### Docker ile Geliştirme

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece backend'i başlat
docker-compose up backend

# Logları görüntüle
docker-compose logs -f backend

# Servisleri durdur
docker-compose down
```

### Proje Yapısı

```
serpyx/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── assets/        # Statik dosyalar
│   │   └── utils/         # Yardımcı fonksiyonlar
│   └── public/            # Public dosyalar
├── server/                 # Backend (Node.js)
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── database/      # Veritabanı işlemleri
│   │   ├── utils/         # Yardımcı fonksiyonlar
│   │   └── blockchain/    # Blockchain entegrasyonu
│   └── logs/              # Log dosyaları
└── docs/                  # Dokümantasyon
```

## 🎮 Oyun Özellikleri

### Oyun Modları
- **Serbest Oyun**: Engelsiz klasik yılan oyunu
- **Kampanya**: Seviye bazlı zorluk artışı (Q2 2025)

### Kontroller
- **WASD** veya **Ok Tuşları**: Yılan yönlendirme
- **Space**: Oyunu duraklat/devam et
- **ESC**: Ana menüye dön

### Coin Kazanma
- Normal yem yeme: +1 coin
- Bonus yem: +5-10 coin
- Başarımlar: 25-2000 coin
- Günlük görevler: 50-200 coin
- Günlük bonus: 10-100 coin
- Blockchain rewards: SPX token (Q2 2025)

## 🏆 Başarımlar

- **İlk Coin**: İlk coinini topla
- **Coin Toplayıcı**: 100 coin topla
- **Coin Ustası**: 1000 coin topla
- **İlk Oyun**: İlk oyununu oyna
- **Düzenli Oyuncu**: 10 oyun oyna
- **Veteran Oyuncu**: 100 oyun oyna
- **Skor Avcısı**: 50 skor yap
- **Skor Ustası**: 100 skor yap
- **Düzenli Oyuncu**: 3 gün üst üste oyna
- **Haftalık Oyuncu**: 7 gün üst üste oyna
- **Aylık Oyuncu**: 30 gün üst üste oyna
- **Renk Meraklısı**: İlk rengini satın al
- **Renk Koleksiyoncusu**: 10 renk satın al
- **Hayatta Kalan**: 5 dakika hayatta kal
- **Dayanıklı**: 10 dakika hayatta kal

## 🎨 Özelleştirme

### Yılan Renkleri
- Yeşil (Varsayılan)
- Mavi
- Kırmızı
- Mor
- Turuncu
- Pembe
- Altın
- Gümüş

### Karakterler
- Klasik Yılan
- NFT Yılan (Q2 2025)

## 📊 İstatistikler

Oyun aşağıdaki istatistikleri takip eder:
- Toplam coin
- Oynanan oyun sayısı
- En yüksek skor
- Günlük streak
- Açılan renk sayısı
- Hayatta kalma süresi
- Blockchain işlemleri (Q2 2025)

## 🔧 Yapılandırma

### Environment Variables
```env
# Frontend
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Serpyx

# Backend
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_NAME=serpyx
JWT_SECRET=your-secret-key
```

### Build Optimizasyonları
- Code splitting
- Tree shaking
- Minification
- Gzip compression
- Image optimization

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd client
npm run build
vercel --prod
```

### AWS (Backend)
```bash
cd server
docker build -t serpyx-backend .
docker push your-registry/serpyx-backend
```

### Docker Compose (Production)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm run test
```

### Backend Tests
```bash
cd server
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

## 📈 Performans

### Frontend
- **Lighthouse Score**: 95+
- **Bundle Size**: < 500KB
- **Load Time**: < 2s

### Backend
- **Response Time**: < 200ms
- **Throughput**: 1000+ req/s
- **Uptime**: 99.9%

## 🔐 Güvenlik

### Frontend
- Content Security Policy
- XSS Protection
- CSRF Protection

### Backend
- JWT Authentication
- Rate Limiting
- Input Validation
- SQL Injection Protection
- Helmet.js Security Headers

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Website**: [serpyx.com](https://serpyx.com)
- **Email**: info@serpyx.com
- **Discord**: [Serpyx Community](https://discord.gg/serpyx)

## 🙏 Teşekkürler

- React ekibine
- Vite ekibine
- Tailwind CSS ekibine
- Framer Motion ekibine
- Tüm katkıda bulunanlara

---

**Serpyx** - Oyna, Kazan, Geleceği İnşa Et 🚀

*Q2 2025 Blockchain Infrastructure Coming Soon!* 