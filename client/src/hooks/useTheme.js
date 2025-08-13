import { useState, useEffect, useCallback } from 'react'

const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('purple')
  const [isInitialized, setIsInitialized] = useState(false)

  const themes = {
    purple: {
      name: 'Mor',
      bgClass: 'theme-purple',
      navbarClass: 'navbar-purple',
      color: 'from-indigo-900 via-purple-900 to-slate-900',
      price: 0,
      isPremium: false
    },
    blue: {
      name: 'Mavi',
      bgClass: 'theme-blue',
      navbarClass: 'navbar-blue',
      color: 'from-blue-900 via-indigo-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    green: {
      name: 'Yeşil',
      bgClass: 'theme-green',
      navbarClass: 'navbar-green',
      color: 'from-emerald-900 via-teal-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    red: {
      name: 'Kırmızı',
      bgClass: 'theme-red',
      navbarClass: 'navbar-red',
      color: 'from-red-900 via-rose-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    orange: {
      name: 'Turuncu',
      bgClass: 'theme-orange',
      navbarClass: 'navbar-orange',
      color: 'from-orange-900 via-amber-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    pink: {
      name: 'Pembe',
      bgClass: 'theme-pink',
      navbarClass: 'navbar-pink',
      color: 'from-pink-900 via-fuchsia-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    cyan: {
      name: 'Cyan',
      bgClass: 'theme-cyan',
      navbarClass: 'navbar-cyan',
      color: 'from-cyan-900 via-blue-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    yellow: {
      name: 'Sarı',
      bgClass: 'theme-yellow',
      navbarClass: 'navbar-yellow',
      color: 'from-yellow-900 via-orange-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    lime: {
      name: 'Lime',
      bgClass: 'theme-lime',
      navbarClass: 'navbar-lime',
      color: 'from-lime-900 via-green-800 to-slate-900',
      price: 5,
      isPremium: true
    },
    violet: {
      name: 'Violet',
      bgClass: 'theme-violet',
      navbarClass: 'navbar-violet',
      color: 'from-violet-900 via-purple-800 to-slate-900',
      price: 5,
      isPremium: true
    }
  }

  const applyTheme = useCallback((themeName) => {
    if (!themes[themeName]) return
    
    // Önce tüm tema class'larını temizle
    Object.values(themes).forEach(theme => {
      document.body.classList.remove(theme.bgClass)
    })
    
    // Yeni tema class'ını ekle
    document.body.classList.add(themes[themeName].bgClass)
    
    // Ana container'ı da güncelle (App.jsx'teki div)
    const mainContainer = document.querySelector('#app-container')
    if (mainContainer) {
      // Tüm tema class'larını temizle
      Object.values(themes).forEach(theme => {
        mainContainer.classList.remove(theme.bgClass)
      })
      // Yeni tema class'ını ekle
      mainContainer.classList.add(themes[themeName].bgClass)
    }
  }, [themes])

  const changeTheme = useCallback((themeName) => {
    if (!themes[themeName]) return
    
    setCurrentTheme(themeName)
    localStorage.setItem('selectedTheme', themeName)
    applyTheme(themeName)
  }, [themes, applyTheme])

  useEffect(() => {
    // Local storage'dan tema seçimini al
    const savedTheme = localStorage.getItem('selectedTheme') || 'purple'
    
    // Geçerli bir tema mi kontrol et
    if (themes[savedTheme]) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Geçersiz tema ise varsayılan temayı kullan
      setCurrentTheme('purple')
      applyTheme('purple')
      localStorage.setItem('selectedTheme', 'purple')
    }
    
    setIsInitialized(true)
  }, [applyTheme, themes])

  return {
    currentTheme,
    themes,
    changeTheme,
    currentThemeData: themes[currentTheme],
    isInitialized
  }
}

export default useTheme
