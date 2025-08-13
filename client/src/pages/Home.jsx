import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../hooks/useAuthStore'
import { useSound } from '../hooks/useSound'
import { useLanguage } from '../contexts/LanguageContext'

const Home = () => {
  const { isAuthenticated } = useAuthStore()
  const { 
    playButtonClick, 
    playHoverSound, 
    playPageTransition
  } = useSound()
  const { t } = useLanguage()

  const features = [
    {
      icon: '🎮',
      title: t('snakeGame'),
      description: t('snakeGameDesc')
    },
    {
      icon: '/coin.PNG',
      title: t('earnCoins'),
      description: t('earnCoinsDesc'),
      isImage: true
    },
    {
      icon: '🏆',
      title: t('leaderboardTitle'),
      description: t('leaderboardDesc')
    },
    {
      icon: '🚀',
      title: t('futureVision'),
      description: t('futureVisionDesc')
    }
  ]

  const roadmapSteps = [
    {
      phase: t('currently'),
      title: t('gamePlatform'),
      description: t('gamePlatformDesc'),
      status: 'completed'
    },
    {
      phase: 'Q2 2025',
      title: t('betaLaunch'),
      description: t('betaLaunchDesc'),
      status: 'current'
    },
    {
      phase: 'Q3 2025',
      title: t('openBeta'),
      description: t('openBetaDesc'),
      status: 'upcoming'
    },
    {
      phase: 'Q2 2026',
      title: t('blockchainIntegration'),
      description: t('blockchainIntegrationDesc'),
      status: 'future'
    }
  ]



  return (
    <div className="relative min-h-screen overflow-hidden pt-0">
      {/* Reklam Alanları - Sol ve Sağ */}
      <div className="hidden xl:flex fixed left-4 top-1/2 transform -translate-y-1/2 z-30">
        <div className="ad-placeholder-left">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">{t('adArea')}</p>
            <p className="ad-size">{t('adSize')}</p>
            <small className="ad-note">{t('adNote')}</small>
          </div>
        </div>
      </div>
      
      <div className="hidden xl:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
        <div className="ad-placeholder-right">
          <div className="ad-content">
            <div className="ad-icon">
              <span>📱</span>
            </div>
            <p className="ad-title">{t('adArea')}</p>
            <p className="ad-size">{t('adSize')}</p>
            <small className="ad-note">{t('adNote')}</small>
          </div>
        </div>
      </div>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Serpyx_video.mp4" type="video/mp4" />
        {t('videoNotSupported')}
      </video>
      {/* Overlay (isteğe bağlı, koyuluk için) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
      {/* Main Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <img src="/yazı.png" alt="Serpyx Yazı" className="h-24 md:h-32 mx-auto mb-6" />
              <p className="text-2xl md:text-3xl text-gray-300 mb-8">
                {t('playEarnBuild').split(', ').map((part, index) => (
                  <span key={index}>
                    {index === 2 ? (
                      <span className="text-snake-400 font-bold">{part}</span>
                    ) : (
                      part
                    )}
                    {index < 2 && ', '}
                  </span>
                ))}
              </p>
              <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                {t('homeDescription')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/play" 
                      className="btn-primary text-lg px-8 py-4"
                      onClick={playButtonClick}
                      onMouseEnter={playHoverSound}
                    >
                      🎮 {t('playNow')}
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="btn-secondary text-lg px-8 py-4"
                      onClick={playButtonClick}
                      onMouseEnter={playHoverSound}
                    >
                      📊 {t('viewDashboard')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn-primary text-lg px-8 py-4"
                      onClick={playButtonClick}
                      onMouseEnter={playHoverSound}
                    >
                      🚀 {t('startNow')}
                    </Link>
                    <Link 
                      to="/login" 
                      className="btn-secondary text-lg px-8 py-4"
                      onClick={playButtonClick}
                      onMouseEnter={playHoverSound}
                    >
                      🔐 {t('login')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                {t('whySerpyx')}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t('whySerpyxDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="card text-center"
                >
                  <div className="text-4xl mb-4">
                    {feature.isImage ? (
                      <img src={feature.icon} alt={feature.title} className="w-12 h-12 mx-auto rounded-full" />
                    ) : (
                      feature.icon
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                {t('roadmapTitle')}
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t('roadmapDesc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roadmapSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className={`card relative ${
                    step.status === 'completed' ? 'border-snake-500' :
                    step.status === 'current' ? 'border-yellow-500' :
                    'border-gray-600'
                  }`}
                >
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                    step.status === 'completed' ? 'bg-snake-500' :
                    step.status === 'current' ? 'bg-yellow-500 animate-pulse' :
                    'bg-gray-500'
                  }`} />
                  
                  <div className="text-sm text-gray-400 mb-2">
                    {step.phase}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Link 
                to="/roadmap" 
                className="btn-primary text-lg px-8 py-4"
                onClick={playButtonClick}
                onMouseEnter={playHoverSound}
              >
                📋 {t('detailedRoadmap')}
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-snake-900/50 to-snake-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                {t('bePartOfFuture')}
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                {t('earlyJoinAdvantages')}
              </p>
              
              {!isAuthenticated && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    🚀 {t('joinNow')}
                  </Link>
                  <Link to="/leaderboard" className="btn-secondary text-lg px-8 py-4">
                    🏆 {t('seeRanking')}
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home 