# 🐍 Serpyx - Snake Game Platform

Serpyx, modern web teknolojileri ile geliştirilmiş bir yılan oyunu platformudur. Kullanıcılar oyun oynayabilir, NFT toplayabilir, sıralamalarda yarışabilir ve arkadaşlarıyla etkileşime geçebilir.

## 🚀 Özellikler

### 🎮 Oyun Özellikleri
- **Klasik Yılan Oyunu**: Geleneksel yılan oyunu deneyimi
- **Çoklu Renk Seçenekleri**: Yılanınızı özelleştirin
- **NFT Karakterler**: Özel yılan karakterleri toplayın
- **Puan Sistemi**: Yüksek skorlar elde edin
- **Günlük Görevler**: Her gün yeni görevler tamamlayın

### 💎 Ekonomi Sistemi
- **Coin Sistemi**: Oyun içi para birimi
- **SPX Token**: Premium para birimi
- **NFT Marketplace**: Özel karakterler satın alın
- **Dönüştürme Sistemi**: Coin'leri SPX'e çevirin

### 🏆 Sosyal Özellikler
- **Liderlik Tablosu**: En iyi oyuncuları görün
- **Profil Sistemi**: Kişisel istatistiklerinizi takip edin
- **Başarım Sistemi**: Rozetler kazanın
- **Günlük Bonus**: Her gün giriş yaparak bonus alın

## 🛠️ Teknolojiler

### Frontend
- **React 18**: Modern UI framework
- **Vite**: Hızlı build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animasyonlar
- **Zustand**: State management

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **SQLite**: Veritabanı
- **bcryptjs**: Şifre hashleme
- **UUID**: Benzersiz ID'ler

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adım 1: Projeyi Klonlayın
```bash
git clone https://github.com/yourusername/serpyx.git
cd serpyx
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
# Server bağımlılıkları
cd server
npm install

# Client bağımlılıkları
cd ../client
npm install
```

### Adım 3: Ortam Değişkenlerini Ayarlayın
```bash
# Server klasöründe .env dosyası oluşturun
cd server
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
PORT=5000
NODE_ENV=development
```

### Adım 4: Uygulamayı Başlatın
```bash
# Geliştirme modunda başlatmak için
npm run dev

# Veya ayrı ayrı başlatmak için:
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client
cd client
npm run dev
```

## 🌐 Kullanım

### Kayıt Olma
1. Ana sayfada "Kayıt Ol" butonuna tıklayın
2. Kullanıcı adı, e-posta ve şifre girin
3. E-posta doğrulama linkini kontrol edin (console'da görünür)
4. Giriş yapın

### Oyun Oynama
1. "Oyna" sayfasına gidin
2. Oyun kontrollerini kullanın:
   - **WASD** veya **Ok tuşları**: Yılanı yönlendirin
   - **Space**: Oyunu duraklatın/devam ettirin
3. Yemi yiyerek büyüyün ve puan kazanın

### NFT Toplama
1. "Mağaza" sayfasına gidin
2. NFT sekmesini seçin
3. SPX ile özel karakterler satın alın
4. Profilinizde karakterinizi seçin

### Sıralamada Yer Alın
1. Yüksek skorlar elde edin
2. "Sıralama" sayfasında konumunuzu görün
3. Diğer oyuncularla yarışın

## 📱 Mobil Uyumluluk

Serpyx tamamen mobil uyumludur:
- **Responsive Tasarım**: Tüm ekran boyutlarında çalışır
- **Touch Kontrolleri**: Mobil cihazlarda dokunmatik kontroller
- **Optimize Edilmiş UI**: Mobil cihazlar için özel düzenlemeler

## 🔧 Geliştirme

### Proje Yapısı
```
serpyx/
├── client/                 # Frontend React uygulaması
│   ├── src/
│   │   ├── components/     # React bileşenleri
│   │   ├── pages/         # Sayfa bileşenleri
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Yardımcı fonksiyonlar
│   └── public/            # Statik dosyalar
├── server/                # Backend Node.js uygulaması
│   ├── controllers/       # API controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Veritabanı modelleri
│   └── routes/           # API routes
└── README.md
```

### API Endpoints
- `POST /api/register` - Kullanıcı kaydı
- `POST /api/login` - Kullanıcı girişi
- `GET /api/leaderboard` - Liderlik tablosu
- `POST /api/update-stats` - İstatistik güncelleme
- `GET /api/profile/:userId` - Kullanıcı profili

## 🚀 Production Deployment

### Vercel (Frontend)
```bash
cd client
npm run build
vercel --prod
```

### Railway/Heroku (Backend)
```bash
cd server
git add .
git commit -m "Production ready"
git push heroku main
```

## 🔒 Güvenlik

- **Şifre Hashleme**: bcryptjs ile güvenli şifre saklama
- **CORS Koruması**: Cross-origin istekleri kontrol edilir
- **Input Validasyonu**: Tüm kullanıcı girdileri doğrulanır
- **SQL Injection Koruması**: Prepared statements kullanılır

## 🐛 Hata Ayıklama

### Yaygın Sorunlar

1. **E-posta Doğrulama Çalışmıyor**
   - Console'da doğrulama linkini kontrol edin
   - Mock e-posta servisi kullanılıyor

2. **Mobil Görünüm Bozuk**
   - Tarayıcıyı yenileyin
   - Responsive tasarım güncellemeleri yapıldı

3. **Sıralama Güncellenmiyor**
   - Gerçek veritabanı bağlantısı kuruldu
   - API endpoint'leri eklendi

## 📈 Gelecek Özellikler

- [ ] **Blockchain Entegrasyonu**: Gerçek NFT sistemi
- [ ] **Çok Oyunculu Mod**: Arkadaşlarla oynama
- [ ] **Turnuva Sistemi**: Haftalık/aylık turnuvalar
- [ ] **Sosyal Özellikler**: Arkadaş ekleme, mesajlaşma
- [ ] **Mobil Uygulama**: iOS/Android uygulamaları

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **E-posta**: info@serpyx.com
- **Website**: https://serpyx.com
- **Discord**: [Serpyx Community](https://discord.gg/serpyx)

## 🙏 Teşekkürler

- React ve Vite ekibine
- Tailwind CSS geliştiricilerine
- Tüm açık kaynak topluluğuna

---

**Serpyx** - Modern yılan oyunu deneyimi 🐍✨ 