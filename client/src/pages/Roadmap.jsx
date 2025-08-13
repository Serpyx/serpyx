import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

const Roadmap = () => {
  const { t } = useLanguage()

  const roadmapData = [
    {
      phase: t('roadmapPhase1'),
      title: t('roadmapPhase1Title'),
      description: t('roadmapPhase1Desc'),
      features: [
        `✅ ${t('roadmapFeature1')}`,
        `✅ ${t('roadmapFeature2')}`,
        `✅ ${t('roadmapFeature3')}`,
        `✅ ${t('roadmapFeature4')}`,
        `✅ ${t('roadmapFeature5')}`,
        `✅ ${t('roadmapFeature6')}`
      ],
      status: 'completed',
      icon: '🔧',
      progress: 100
    },
    {
      phase: t('roadmapPhase2'),
      title: t('roadmapPhase2Title'),
      description: t('roadmapPhase2Desc'),
      features: [
        `📋 ${t('roadmapFeature7')}`,
        `📋 ${t('roadmapFeature8')}`,
        `📋 ${t('roadmapFeature9')}`,
        `📋 ${t('roadmapFeature10')}`,
        `📋 ${t('roadmapFeature11')}`,
        `📋 ${t('roadmapFeature12')}`
      ],
      status: 'current',
      icon: '🚀',
      progress: 75
    },
    {
      phase: t('roadmapPhase3'),
      title: t('roadmapPhase3Title'),
      description: t('roadmapPhase3Desc'),
      features: [
        `📋 ${t('roadmapFeature13')}`,
        `📋 ${t('roadmapFeature14')}`,
        `📋 ${t('roadmapFeature15')}`,
        `📋 ${t('roadmapFeature16')}`,
        `📋 ${t('roadmapFeature17')}`,
        `📋 ${t('roadmapFeature18')}`
      ],
      status: 'upcoming',
      icon: '🌐',
      progress: 0
    },
    {
      phase: t('roadmapPhase4'),
      title: t('roadmapPhase4Title'),
      description: t('roadmapPhase4Desc'),
      features: [
        `📋 ${t('roadmapFeature19')}`,
        `📋 ${t('roadmapFeature20')}`,
        `📋 ${t('roadmapFeature21')}`,
        `📋 ${t('roadmapFeature22')}`,
        `📋 ${t('roadmapFeature23')}`,
        `📋 ${t('roadmapFeature24')}`
      ],
      status: 'upcoming',
      icon: '🎯',
      progress: 0
    },
    {
      phase: t('roadmapPhase5'),
      title: t('roadmapPhase5Title'),
      description: t('roadmapPhase5Desc'),
      features: [
        `📋 ${t('roadmapFeature25')}`,
        `📋 ${t('roadmapFeature26')}`,
        `📋 ${t('roadmapFeature27')}`,
        `📋 ${t('roadmapFeature28')}`,
        `📋 ${t('roadmapFeature29')}`,
        `📋 ${t('roadmapFeature30')}`
      ],
      status: 'future',
      icon: '🔗',
      progress: 0
    },
    {
      phase: t('roadmapPhase6'),
      title: t('roadmapPhase6Title'),
      description: t('roadmapPhase6Desc'),
      features: [
        `📋 ${t('roadmapFeature31')}`,
        `📋 ${t('roadmapFeature32')}`,
        `📋 ${t('roadmapFeature33')}`,
        `📋 ${t('roadmapFeature34')}`,
        `📋 ${t('roadmapFeature35')}`,
        `📋 ${t('roadmapFeature36')}`
      ],
      status: 'future',
      icon: '🪙',
      progress: 0
    }
  ]

  const tokenInfo = {
    name: 'SPX Coin (Planlanan)',
    symbol: 'SPX',
    symbolIcon: '🪙',
    note: t('tokenNoteText')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-500/10'
      case 'current': return 'border-yellow-500 bg-yellow-500/10'
      case 'upcoming': return 'border-blue-500 bg-blue-500/10'
      case 'future': return 'border-purple-500 bg-purple-500/10'
      default: return 'border-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'current': return '🔄'
      case 'upcoming': return '📋'
      case 'future': return '🌍'
      default: return '⏳'
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Bilgilendirme - Küçük banner */}
        <div className="w-full bg-gradient-to-r from-blue-900/60 to-purple-900/60 text-blue-200 text-center text-xs py-2 px-4 mb-6 rounded-lg border border-blue-500/30">
          <span className="text-blue-300 font-medium">ℹ️</span> {t('roadmapInfo')}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <img src="/yazı.png" alt="Serpyx Yazı" className="h-20 mx-auto mb-6" />
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            {t('roadmapDescription')}
          </p>
          <div className="mt-8 flex justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">{t('roadmapCompleted')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-gray-400">{t('roadmapInProgress')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-400">{t('roadmapPlanned')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-400">{t('roadmapFuture')}</span>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative mb-20">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-yellow-500 via-blue-500 to-purple-500"></div>
          
          <div className="space-y-16">
            {roadmapData.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                  phase.status === 'completed' ? 'bg-green-500 border-green-500' :
                  phase.status === 'current' ? 'bg-yellow-500 border-yellow-500 animate-pulse' :
                  phase.status === 'upcoming' ? 'bg-blue-500 border-blue-500' :
                  'bg-purple-500 border-purple-500'
                }`}></div>

                {/* Content */}
                <div className={`ml-16 card ${getStatusColor(phase.status)}`}>
                  <div className="flex items-start space-x-6">
                    <div className="text-4xl">{phase.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400 font-medium bg-gray-800 px-3 py-1 rounded-full">
                          {phase.phase}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getStatusIcon(phase.status)}</span>
                          {phase.status === 'current' && (
                            <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded">
                              {phase.progress}% {t('completed')}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3">
                        {phase.title}
                      </h3>
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                        {phase.description}
                      </p>
                      
                      {/* Progress Bar for Current Phase */}
                      {phase.status === 'current' && (
                        <div className="mb-6">
                          <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>{t('progress')}</span>
                            <span>{phase.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${phase.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <h4 className="text-white font-bold mb-3">📋 {t('features')}</h4>
                        <div className="space-y-2">
                          {phase.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start space-x-2 text-sm">
                              <span className="text-green-400 mt-1">•</span>
                              <span className="text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Token Economics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12 flex items-center justify-center">
            <img src="/spx.png" alt="SPX" className="w-12 h-12 rounded-full mr-4" />
            {t('tokenEconomics')}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Token Details */}
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">📊 {t('tokenInfo')}</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t('tokenName')}</span>
                  <span className="text-white font-bold">{tokenInfo.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t('tokenSymbol')}</span>
                  <span className="text-green-400 font-bold flex items-center">
                    <img src="/spx.png" alt="SPX" className="w-6 h-6 mr-2 rounded-full" />
                    {tokenInfo.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">{t('tokenNote')}</span>
                  <span className="text-gray-300 text-sm">{tokenInfo.note}</span>
                </div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">📈 {t('tokenomics')}</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="text-blue-300 font-bold mb-2">{t('totalSupply')}</h4>
                  <p className="text-white font-bold text-lg">{t('totalSupplyAmount')}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <h5 className="text-yellow-300 font-bold text-sm">{t('gameRewards')}</h5>
                    <p className="text-white text-sm">40%</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
                    <h5 className="text-purple-300 font-bold text-sm">{t('development')}</h5>
                    <p className="text-white text-sm">30%</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
                    <h5 className="text-green-300 font-bold text-sm">{t('community')}</h5>
                    <p className="text-white text-sm">20%</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-3 border border-red-500/20">
                    <h5 className="text-red-300 font-bold text-sm">{t('liquidity')}</h5>
                    <p className="text-white text-sm">10%</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xs italic">{t('tokenomicsNote')}</p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="card">
              <h3 className="text-2xl font-bold text-white mb-6">💡 {t('useCases')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <h5 className="text-green-300 font-bold text-sm">{t('inGamePurchases')}</h5>
                      <p className="text-gray-300 text-xs">{t('inGamePurchasesDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 border border-purple-500/20">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h5 className="text-purple-300 font-bold text-sm">{t('tournamentRewards')}</h5>
                      <p className="text-gray-300 text-xs">{t('tournamentRewardsDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
                    <span className="text-2xl">💎</span>
                    <div>
                      <h5 className="text-yellow-300 font-bold text-sm">{t('nftMarketplace')}</h5>
                      <p className="text-gray-300 text-xs">{t('nftMarketplaceDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-3 border border-blue-500/20">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h5 className="text-blue-300 font-bold text-sm">{t('governance')}</h5>
                      <p className="text-gray-300 text-xs">{t('governanceDesc')}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-xs italic">{t('useCasesNote')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mb-20"
        >
          <div className="card bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/20">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-white mb-6">🚀 {t('ourVision')}</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-5xl mx-auto leading-relaxed">
                {t('visionDescription')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎮</div>
                  <h4 className="text-white font-bold text-xl mb-3">{t('playAndEarn')}</h4>
                  <p className="text-gray-400">{t('playAndEarnDesc')}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <img src="/spx.png" alt="SPX" className="w-12 h-12 rounded-full mr-3" />
                    <span className="text-4xl">💰</span>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-3">{t('saveAndInvest')}</h4>
                  <p className="text-gray-400 mb-3">{t('saveAndInvestDesc')}</p>
                  <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg p-3 border border-blue-500/30">
                    <p className="text-sm text-blue-300 font-medium">{t('convertToSpx')}</p>
                    <p className="text-xs text-gray-400">{t('convertRate')}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🚀</div>
                  <h4 className="text-white font-bold text-xl mb-3">{t('growAndShare')}</h4>
                  <p className="text-gray-400">{t('growAndShareDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="text-center"
        >
          <div className="card bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">🎯 {t('earlyAccessAdvantages')}</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              {t('earlyAccessDescription')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <h4 className="text-green-400 font-bold text-lg mb-3">🏆 {t('founderBadge')}</h4>
                <p className="text-gray-300 text-sm">{t('founderBadgeDesc')}</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <h4 className="text-yellow-400 font-bold text-lg mb-3">🎁 {t('bonusCoin')}</h4>
                <p className="text-gray-300 text-sm">{t('bonusCoinDesc')}</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h4 className="text-blue-400 font-bold text-lg mb-3">🗳️ {t('votingRights')}</h4>
                <p className="text-gray-300 text-sm">{t('votingRightsDesc')}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <h4 className="text-purple-400 font-bold text-lg mb-3">💎 {t('vipAccess')}</h4>
                <p className="text-gray-300 text-sm">{t('vipAccessDesc')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Roadmap 