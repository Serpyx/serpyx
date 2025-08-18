# 🎯 Google AdSense Kurulum Rehberi

## 📋 Adım Adım Kurulum

### 1. Google AdSense Hesabı Oluşturma
1. https://www.google.com/adsense adresine gidin
2. Google hesabınızla giriş yapın
3. "Başlayın" butonuna tıklayın
4. Site bilgilerinizi girin:
   - **Site URL:** https://serpyx.com
   - **Site Adı:** Serpyx
   - **Kategori:** Oyun

### 2. Site Doğrulaması
1. **HTML Etiketi** yöntemini seçin
2. Verilen kodu `client/index.html` dosyasına ekleyin
3. Siteyi yayınlayın ve doğrulayın

### 3. Publisher ID Alma
1. Hesap onaylandıktan sonra Publisher ID'nizi alın
2. Format: `ca-pub-XXXXXXXXXX`

### 4. Kod Güncellemeleri

#### A. index.html Güncelleme
```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
 crossorigin="anonymous"></script>
```

#### B. AdBanner.jsx Güncelleme
```jsx
data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
```

### 5. Reklam Birimleri Oluşturma

#### Ana Sayfa Banner (728x90)
- **Ad Slot:** `1234567890`
- **Konum:** Sayfa ortası

#### Oyun Sonrası Banner (320x90)
- **Ad Slot:** `1234567891`
- **Konum:** Oyun bitişinde

#### Yan Sidebar (160x600)
- **Ad Slot:** `1234567892`
- **Konum:** Sol ve sağ kenarlar

## 🎮 Reklam Yerleşimleri

### ✅ Mevcut Reklam Alanları:
1. **Ana Sayfa (Home)** - Orta banner
2. **Oyun Sayfası (Game)** - Oyun sonrası
3. **Yan Sidebar** - Sol ve sağ kenarlar (desktop)

### 📱 Mobil Uyumluluk:
- Yan reklamlar mobilde gizlenir
- Sadece banner reklamlar gösterilir
- Responsive tasarım

## ⚠️ Önemli Notlar

### Reklam Politikaları:
- ✅ Oyun içinde reklam yok
- ✅ Sadece sayfa geçişlerinde
- ✅ Kullanıcı deneyimini bozmaz
- ✅ Mobil uyumlu

### Performans:
- Reklamlar sayfa yükleme hızını etkilemez
- Lazy loading kullanılır
- Fallback placeholder'lar mevcut

## 🚀 Hızlı Başlangıç

1. AdSense hesabı açın
2. Publisher ID'nizi alın
3. Kodları güncelleyin
4. Reklam birimlerini oluşturun
5. Test edin ve yayınlayın

## 📞 Destek

Sorun yaşarsanız:
- Google AdSense Yardım Merkezi
- Serpyx Destek Ekibi
- Dokümantasyon: Bu dosya

---
**Not:** Bu rehber AdSense hesabınız onaylandıktan sonra kullanılmalıdır.




