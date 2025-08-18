import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSound } from '../hooks/useSound'

const Terms = () => {
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
          <h1 className="text-4xl font-bold text-white mb-4">Kullanım Şartları</h1>
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
              <h2 className="text-2xl font-bold text-white mb-4">1. Hizmetin Tanımı</h2>
              <p className="text-gray-300 mb-4">
                serpyx.com, kullanıcıların oyun oynayarak SPX Coin adlı sanal oyun içi varlıklar kazanmasına imkân tanır.
              </p>
              <p className="text-gray-300 mb-4">
                SPX Coin yalnızca oyun içi kullanım için tasarlanmış bir dijital varlıktır.
              </p>
              <p className="text-gray-300 mb-4">
                SPX Coin:
              </p>
              <ul className="text-gray-300 space-y-2 ml-6">
                <li>• Kripto para değildir</li>
                <li>• Resmî ödeme aracı değildir</li>
                <li>• Yatırım aracı olarak kullanılamaz</li>
                <li>• Gerçek dünyada parasal değere sahip değildir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Hesap Açma</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Kullanıcı, kayıt sırasında doğru, güncel ve eksiksiz bilgi vermekle yükümlüdür</li>
                <li>• Kullanıcı hesabı kişiseldir; üçüncü kişilerle paylaşılması yasaktır</li>
                <li>• 13 yaşından küçük kişiler Siteyi kullanamaz</li>
                <li>• 13–18 yaş arasındaki kullanıcılar yalnızca ebeveyn izni ile katılabilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Sanal Varlıklar ve Ödemeler</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Kullanıcılar SPX Coin'leri oyun içinde kazanabilir veya üçüncü taraf ödeme sağlayıcıları aracılığıyla satın alabilir</li>
                <li>• Tüm ödeme işlemleri bağımsız ödeme sağlayıcıları üzerinden yapılır; serpyx.com kullanıcıların kart bilgilerini asla saklamaz</li>
                <li>• Satın alınan sanal varlıklar geri iade edilemez, iptal edilemez ve nakde çevrilemez</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Kullanım Kuralları</h2>
              <p className="text-gray-300 mb-4">Kullanıcılar:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Siteyi yalnızca kişisel, eğlence amaçlı kullanabilir</li>
                <li>• SPX Coin veya oyun içi özellikler yasa dışı amaçlarla kullanılamaz</li>
                <li>• Kara para aklama, yasa dışı bahis, kumar veya finansal dolandırıcılık amacıyla kullanmak kesinlikle yasaktır</li>
                <li>• Siteye izinsiz erişim, hackleme, kopyalama veya tersine mühendislik girişimleri yasaktır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Fikri Mülkiyet</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Site, oyun mekaniği, içerikler, grafikler, yazılımlar ve logolar serpyx.com'a aittir</li>
                <li>• Kullanıcılar, bu içerikleri izinsiz kopyalayamaz, dağıtamaz veya ticari amaçla kullanamaz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Sorumluluk Reddi</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• serpyx.com, hizmetin kesintisiz veya hatasız olacağını garanti etmez</li>
                <li>• Kullanıcı, Siteyi kendi sorumluluğu altında kullandığını kabul eder</li>
                <li>• SPX Coin veya dijital ürünlerin gerçek dünyada bir değeri olmadığı açıkça beyan edilmektedir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Hesap Sonlandırma</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• serpyx.com, kullanım koşullarını ihlal eden kullanıcıların hesaplarını kapatma hakkını saklı tutar</li>
                <li>• Kullanıcı, hesabını istediği zaman kapatma hakkına sahiptir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Yürürlük ve Yetki</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Bu Koşullar, Türkiye Cumhuriyeti yasalarına tabidir</li>
                <li>• Her türlü uyuşmazlıkta Eskişehir Mahkemeleri ve İcra Daireleri yetkilidir</li>
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

export default Terms
