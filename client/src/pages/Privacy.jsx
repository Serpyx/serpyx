import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound'

const Privacy = () => {
  const { playHoverSound } = useSound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Gizlilik Politikası</h1>
          <p className="text-gray-400">Son güncelleme: 7 Ağustos 2024</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl"
        >
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Giriş</h2>
              <p className="text-gray-300 mb-4">
                Serpyx olarak, kullanıcılarımızın gizliliğine saygı duyuyoruz. Bu gizlilik politikası, 
                platformumuzu kullanırken toplanan bilgilerin nasıl kullanıldığını ve korunduğunu açıklar.
              </p>
              <p className="text-gray-300">
                Bu politikayı kabul ederek, belirtilen şekilde verilerinizin işlenmesine izin vermiş olursunuz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Topladığımız Bilgiler</h2>
              <h3 className="text-xl font-semibold text-white mb-3">2.1 Hesap Bilgileri</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Kullanıcı adı</li>
                <li>• E-posta adresi</li>
                <li>• Şifre (şifrelenmiş olarak saklanır)</li>
                <li>• Hesap oluşturma tarihi</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.2 Oyun Verileri</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Oyun skorları ve istatistikler</li>
                <li>• Kazanılan coinler ve ödüller</li>
                <li>• Oyun tercihleri ve ayarlar</li>
                <li>• Başarım ve görev ilerlemeleri</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">2.3 Teknik Veriler</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• IP adresi</li>
                <li>• Tarayıcı türü ve sürümü</li>
                <li>• İşletim sistemi</li>
                <li>• Cihaz bilgileri</li>
                <li>• Çerezler ve yerel depolama</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Verilerin Kullanım Amacı</h2>
              <p className="text-gray-300 mb-4">
                Topladığımız verileri aşağıdaki amaçlarla kullanırız:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Hesap oluşturma ve yönetimi</li>
                <li>• Oyun deneyimini kişiselleştirme</li>
                <li>• Platform güvenliğini sağlama</li>
                <li>• Teknik sorunları çözme</li>
                <li>• Platform performansını iyileştirme</li>
                <li>• Yasal yükümlülükleri yerine getirme</li>
                <li>• İletişim ve destek hizmetleri</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Veri Paylaşımı</h2>
              <p className="text-gray-300 mb-4">
                Kişisel verilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmayız:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Açık rızanız olduğunda</li>
                <li>• Yasal zorunluluk durumunda</li>
                <li>• Platform güvenliği için gerekli olduğunda</li>
                <li>• Hizmet sağlayıcılarımızla (sadece gerekli veriler)</li>
                <li>• İş transferi durumunda</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Veri Güvenliği</h2>
              <p className="text-gray-300 mb-4">
                Verilerinizi korumak için aşağıdaki güvenlik önlemlerini alırız:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• SSL/TLS şifreleme</li>
                <li>• Güvenli veri depolama</li>
                <li>• Düzenli güvenlik denetimleri</li>
                <li>• Erişim kontrolü ve yetkilendirme</li>
                <li>• Veri yedekleme ve kurtarma</li>
                <li>• Personel eğitimi ve farkındalık</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Çerezler ve Takip Teknolojileri</h2>
              <p className="text-gray-300 mb-4">
                Platformumuzda aşağıdaki çerez türlerini kullanırız:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Gerekli Çerezler:</strong> Platform işlevselliği için zorunlu</li>
                <li>• <strong>Performans Çerezleri:</strong> Platform performansını iyileştirme</li>
                <li>• <strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlama</li>
                <li>• <strong>Analitik Çerezler:</strong> Kullanım istatistikleri</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz, ancak bu platform 
                işlevselliğini etkileyebilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Kullanıcı Hakları</h2>
              <p className="text-gray-300 mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Verilerinize erişim hakkı</li>
                <li>• Verilerinizi düzeltme hakkı</li>
                <li>• Verilerinizi silme hakkı</li>
                <li>• İşlemeyi sınırlama hakkı</li>
                <li>• Veri taşınabilirliği hakkı</li>
                <li>• İtiraz etme hakkı</li>
                <li>• Otomatik karar vermeye itiraz hakkı</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Veri Saklama Süresi</h2>
              <p className="text-gray-300 mb-4">
                Verilerinizi aşağıdaki süreler boyunca saklarız:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Hesap verileri:</strong> Hesap aktif olduğu sürece</li>
                <li>• <strong>Oyun verileri:</strong> Hesap silinene kadar</li>
                <li>• <strong>Teknik loglar:</strong> 12 ay</li>
                <li>• <strong>Çerezler:</strong> Tarayıcı ayarlarına bağlı</li>
                <li>• <strong>Yasal zorunluluk:</strong> Yasal gereklilik süresi</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Çocukların Gizliliği</h2>
              <p className="text-gray-300 mb-4">
                Platformumuz 13 yaş altı kullanıcılar için tasarlanmamıştır. 
                13 yaş altı kullanıcıların kişisel verilerini bilerek toplamayız.
              </p>
              <p className="text-gray-300">
                Eğer 13 yaş altı bir çocuğun verilerini topladığımızı fark edersek, 
                bu verileri derhal sileriz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Uluslararası Veri Transferi</h2>
              <p className="text-gray-300">
                Verileriniz Türkiye'de saklanır ve işlenir. Uluslararası transfer durumunda, 
                uygun güvenlik önlemleri alınır ve yasal gereklilikler sağlanır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Politika Değişiklikleri</h2>
              <p className="text-gray-300">
                Bu gizlilik politikası güncellenebilir. Önemli değişiklikler platformda 
                duyurulur ve kullanıcılar bilgilendirilir. Politikayı kullanmaya devam 
                etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">12. İletişim</h2>
              <p className="text-gray-300 mb-4">
                Gizlilik politikası ile ilgili sorularınız için:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• E-posta: privacy@serpyx.com</li>
                <li>• Adres: Serpyx Teknoloji A.Ş.</li>
                <li>• Telefon: +90 xxx xxx xx xx</li>
                <li>• KVKK Başvuru Formu: <Link to="/kvkk-form" className="text-snake-400 hover:text-snake-300 underline">Buraya Tıklayın</Link></li>
              </ul>
            </section>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link 
            to="/register" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-snake-500 to-snake-600 text-white font-bold rounded-xl hover:from-snake-600 hover:to-snake-700 transition-all duration-300 shadow-lg"
            onMouseEnter={playHoverSound}
          >
            ← Kayıt Sayfasına Dön
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default Privacy
