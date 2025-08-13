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
              <h2 className="text-2xl font-bold text-white mb-4">1. Genel Hükümler</h2>
              <p className="text-gray-300 mb-4">
                Serpyx oyun platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. 
                Bu şartlar, platformun kullanımı ile ilgili tüm hak ve yükümlülükleri düzenler.
              </p>
              <p className="text-gray-300">
                Platform, 18 yaş ve üzeri kullanıcılar için tasarlanmıştır. 18 yaş altı kullanıcılar 
                ebeveyn veya vasilerinin izni ile platformu kullanabilirler.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">2. Hesap Oluşturma ve Güvenlik</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Hesap oluştururken doğru ve güncel bilgiler vermekle yükümlüsünüz</li>
                <li>• Hesap güvenliğinizden siz sorumlusunuz</li>
                <li>• Şifrenizi kimseyle paylaşmamalısınız</li>
                <li>• Şüpheli aktivite durumunda bizi bilgilendirmelisiniz</li>
                <li>• Bir hesap oluşturma hakkınız vardır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Oyun Kuralları ve Davranış</h2>
              <p className="text-gray-300 mb-4">
                Platformda aşağıdaki davranışlar kesinlikle yasaktır:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Hile yapmak, bot kullanmak veya otomatik oyun araçları</li>
                <li>• Diğer kullanıcıları rahatsız etmek veya taciz etmek</li>
                <li>• Uygunsuz, saldırgan veya yasadışı içerik paylaşmak</li>
                <li>• Spam göndermek veya platformu kötüye kullanmak</li>
                <li>• Telif hakkı ihlali yapmak</li>
                <li>• Diğer kullanıcıların hesaplarını ele geçirmeye çalışmak</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. Sanal Para ve Ödüller</h2>
              <p className="text-gray-300 mb-4">
                Platformda kazanılan coinler ve ödüller sanal değerlerdir ve gerçek para ile değiştirilemez.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Coinler sadece platform içinde kullanılabilir</li>
                <li>• Gerçek para değeri yoktur</li>
                <li>• Platform kapatılırsa coinler kaybolabilir</li>
                <li>• Coin transferi yapılamaz</li>
                <li>• Hile ile kazanılan coinler silinebilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Gizlilik ve Veri Kullanımı</h2>
              <p className="text-gray-300 mb-4">
                Kişisel verileriniz <Link to="/privacy" className="text-snake-400 hover:text-snake-300 underline">Gizlilik Politikamız</Link> 
                kapsamında korunmaktadır.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• E-posta adresiniz hesap yönetimi için kullanılır</li>
                <li>• Oyun istatistikleriniz platformda saklanır</li>
                <li>• Çerezler kullanıcı deneyimini iyileştirmek için kullanılır</li>
                <li>• Verileriniz üçüncü taraflarla paylaşılmaz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">6. Fikri Mülkiyet Hakları</h2>
              <p className="text-gray-300 mb-4">
                Platform ve içeriği Serpyx'e aittir ve telif hakları korunmaktadır.
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Platform içeriğini kopyalayamazsınız</li>
                <li>• Ticari amaçla kullanamazsınız</li>
                <li>• Reverse engineering yapamazsınız</li>
                <li>• Platform adını ve logosunu izinsiz kullanamazsınız</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. Sorumluluk Reddi</h2>
              <p className="text-gray-300 mb-4">
                Platform "olduğu gibi" sunulmaktadır ve aşağıdaki durumlardan sorumlu değiliz:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Platform kesintileri veya teknik sorunlar</li>
                <li>• Veri kaybı veya hesap erişim sorunları</li>
                <li>• Üçüncü taraf hizmetlerin sorunları</li>
                <li>• Kullanıcılar arası anlaşmazlıklar</li>
                <li>• Sanal para kayıpları</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">8. Hesap Askıya Alma ve Kapatma</h2>
              <p className="text-gray-300 mb-4">
                Aşağıdaki durumlarda hesabınız askıya alınabilir veya kapatılabilir:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Kullanım şartlarını ihlal etmek</li>
                <li>• Hile yapmak veya bot kullanmak</li>
                <li>• Diğer kullanıcıları rahatsız etmek</li>
                <li>• Uygunsuz davranış sergilemek</li>
                <li>• Platform güvenliğini tehdit etmek</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Değişiklikler</h2>
              <p className="text-gray-300">
                Bu kullanım şartları önceden haber vermeksizin değiştirilebilir. 
                Değişiklikler platformda yayınlandığı tarihten itibaren geçerli olur. 
                Platformu kullanmaya devam etmeniz, güncellenmiş şartları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. İletişim</h2>
              <p className="text-gray-300">
                Kullanım şartları ile ilgili sorularınız için lütfen bizimle iletişime geçin:
              </p>
              <ul className="text-gray-300 space-y-2 mt-4">
                <li>• E-posta: support@serpyx.com</li>
                <li>• Discord: discord.gg/serpyx</li>
                <li>• Twitter: @serpyx_game</li>
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
