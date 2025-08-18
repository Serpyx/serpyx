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
          <p className="text-gray-400">Son güncelleme: 16.08.2025</p>
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Toplanan Veriler</h2>
              <p className="text-gray-300 mb-4">
                serpyx.com aşağıdaki verileri toplayabilir:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Hesap oluşturma sırasında verilen bilgiler (ad, kullanıcı adı, e-posta)</li>
                <li>• Oyun içi hareketler, SPX Coin bakiyesi ve skorlar</li>
                <li>• Ödeme işlemlerinde kullanılan bilgiler (kart verileri yalnızca ödeme sağlayıcı tarafından işlenir, Site tarafından saklanmaz)</li>
                <li>• IP adresi, tarayıcı bilgileri, cihaz türü</li>
                <li>• Çerezler (cookies) aracılığıyla kullanım verileri</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Verilerin Kullanımı</h2>
              <p className="text-gray-300 mb-4">
                Toplanan veriler şu amaçlarla kullanılabilir:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Kullanıcılara oyun hizmetlerini sunmak</li>
                <li>• SPX Coin bakiyesini ve satın alımları yönetmek</li>
                <li>• Kullanıcı deneyimini geliştirmek</li>
                <li>• Güvenlik ve sahtekârlık önleme</li>
                <li>• Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Çerezler</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Site, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanabilir</li>
                <li>• Kullanıcı, tarayıcı ayarlarından çerezleri reddedebilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Veri Paylaşımı</h2>
              <p className="text-gray-300 mb-4">
                Kişisel veriler, ticari amaçlarla üçüncü şahıslarla paylaşılmaz.
              </p>
              <p className="text-gray-300 mb-4">Ancak:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Yasal zorunluluk halinde yetkili kurumlarla paylaşılabilir</li>
                <li>• Ödeme işlemleri için gerekli bilgiler yalnızca ödeme sağlayıcılara aktarılır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Uluslararası Veri Aktarımı</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• serpyx.com'un sunucuları Türkiye dışında bulunabilir. Bu durumda veriler yurtdışına aktarılabilir</li>
                <li>• Tüm veri aktarımlarında KVKK ve GDPR standartlarına uyulur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Veri Güvenliği</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• serpyx.com, kullanıcı verilerini korumak için endüstri standartlarında teknik ve idari önlemler alır</li>
                <li>• Ancak internet üzerinden veri iletiminin tamamen güvenli olacağı garanti edilemez</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Kullanıcı Hakları</h2>
              <p className="text-gray-300 mb-4">
                Kullanıcılar KVKK ve GDPR kapsamında şu haklara sahiptir:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Kişisel verilerine erişim talebi</li>
                <li>• Verilerin düzeltilmesini veya silinmesini isteme</li>
                <li>• İşlenmesini durdurma veya kısıtlama talebi</li>
                <li>• Veri taşınabilirliği hakkı</li>
                <li>• İtiraz hakkı</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Bu talepler için <a href="mailto:serpyx0@gmail.com" className="text-snake-400 hover:text-snake-300 underline">serpyx0@gmail.com</a> üzerinden bizimle iletişime geçebilirsiniz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Politika Değişiklikleri</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Bu Gizlilik Politikası zaman zaman güncellenebilir</li>
                <li>• Güncellemeler sitede yayımlandığı andan itibaren geçerli olur</li>
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
