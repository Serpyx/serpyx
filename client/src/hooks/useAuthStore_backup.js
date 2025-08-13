import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// SPX ile alınacak özel ürünler
const SPX_ITEMS = [
  {
    id: 'vip_badge',
    name: 'VIP Rozeti',
    description: 'Özel VIP rozeti ile diğerlerinden ayrılın (1 SPX = 1000 Coin)',
    price: 1,
    type: 'badge',
    icon: '👑',
    rarity: 'rare',
    permanent: true
  },
  {
    id: 'double_coins',
    name: '2x Coin Multiplier',
    description: '10 oyun boyunca 2 kat daha fazla coin kazanın (2 SPX = 2000 Coin)',
    price: 2,
    type: 'booster',
    icon: '💰',
    rarity: 'epic',
    gameCount: 10
  },
  {
    id: 'shield_protection',
    name: 'Kalkan Koruması',
    description: 'Bir oyun boyunca duvarlara çarpmayın (3 SPX = 3000 Coin)',
    price: 3,
    type: 'protection',
    icon: '🛡️',
    rarity: 'legendary',
    oneGame: true
  },
  {
    id: 'speed_boost',
    name: 'Hız Artırıcı',
    description: '10 oyun boyunca yılanınız daha hızlı hareket eder (2 SPX = 2000 Coin)',
    price: 2,
    type: 'booster',
    icon: '⚡',
    rarity: 'rare',
    gameCount: 10
  },
  {
    id: 'lucky_charm',
    name: 'Şans Tılsımı',
    description: '10 oyun boyunca bonus yemlerin daha sık çıkmasını sağlar (2 SPX = 2000 Coin)',
    price: 2,
    type: 'charm',
    icon: '🍀',
    rarity: 'epic',
    gameCount: 10
  },
  {
    id: 'golden_snake',
    name: 'Altın Yılan Efekti',
    description: 'Oyun içinde yılanınız altın renginde parlar ve özel efektler gösterir (5 SPX = 5000 Coin)',
    price: 5,
    type: 'skin',
    icon: '🐍',
    rarity: 'legendary',
    permanent: true
  },
  {
    id: 'time_freeze',
    name: 'Zaman Durdurucu',
    description: 'Bir oyun boyunca yılanınızı durdurabilirsiniz (4 SPX = 4000 Coin)',
    price: 4,
    type: 'power',
    icon: '⏸️',
    rarity: 'mythic',
    oneGame: true
  },

]

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      coins: 0,
      highScore: 0,
      totalScore: 0, // Toplam skor eklendi
      spxBalance: 0,
      snakeColor: '#22c55e',
      selectedCharacter: 'default', // 'default', 'nft-snake', etc.
      campaignProgress: {},
      achievements: {},
      activeSpxItems: [], // Aktif SPX ürünleri
      activeTimers: {}, // Süreli ürünler için sayaçlar
      usedOneGameItems: [], // Bir oyunluk kullanılan ürünler
      gameCountItems: {}, // 10 oyunluk ürünler için sayaçlar
  
  login: (userData, token) => {
    console.log('Store - Logging in with user data:', userData);
    
    // Check if user already exists in localStorage by username
    const userKey = `serpyx-user-${userData.username}`;
    const existingUserData = localStorage.getItem(userKey);
    let existingCoins = 0;
    let existingHighScore = 0;
    let existingTotalScore = 0; // Toplam skor eklendi
    let existingSnakeColor = '#22c55e';
    let existingSpxBalance = 0;
    
    if (existingUserData) {
      try {
        const parsed = JSON.parse(existingUserData);
        existingCoins = parsed.coins || 0;
        existingHighScore = parsed.highScore || 0;
        existingTotalScore = parsed.totalScore || 0; // Toplam skor eklendi
        existingSnakeColor = parsed.snakeColor || '#22c55e';
        existingSpxBalance = parsed.spxBalance || 0;
        console.log('Store - Found existing user data:', { 
          coins: existingCoins, 
          highScore: existingHighScore,
          totalScore: existingTotalScore, // Toplam skor eklendi
          snakeColor: existingSnakeColor,
          spxBalance: existingSpxBalance
        });
      } catch (e) {
        console.log('Store - No existing user data found');
      }
    } else {
      // Yeni kullanıcı için temiz başlangıç
      console.log('Store - New user, starting with clean data');
      existingCoins = 100; // Başlangıç coin'i
      existingHighScore = 0;
      existingTotalScore = 0; // Toplam skor eklendi
      existingSnakeColor = '#22c55e';
      existingSpxBalance = 0;
    }
    
    // Game count items'ı localStorage'dan yükle
    const gameCountKey = `spxGameCount-${userData.username}`;
    const gameCountData = localStorage.getItem(gameCountKey);
    let gameCountItems = {};
    
    if (gameCountData) {
      try {
        const parsedGameCount = JSON.parse(gameCountData);
        // Sadece pozitif değerleri al
        Object.keys(parsedGameCount).forEach(itemId => {
          if (parsedGameCount[itemId] > 0) {
            gameCountItems[itemId] = parsedGameCount[itemId];
          }
        });
        console.log('Store - Loaded game count items:', gameCountItems);
      } catch (e) {
        console.log('Store - Error loading game count items:', e);
      }
    }
    
    // Kalıcı ürünleri localStorage'dan yükle
    const spxItemsKey = `spxItems-${userData.username}`;
    const spxItemsData = localStorage.getItem(spxItemsKey);
    let activeSpxItems = [];
    
    if (spxItemsData) {
      try {
        activeSpxItems = JSON.parse(spxItemsData);
        console.log('Store - Loaded permanent items:', activeSpxItems);
      } catch (e) {
        console.log('Store - Error loading permanent items:', e);
      }
    }
    
    const userWithData = { 
      ...userData, 
      coins: existingCoins, 
      highScore: existingHighScore,
      totalScore: existingTotalScore, // Toplam skor eklendi
      snakeColor: existingSnakeColor,
      spxBalance: existingSpxBalance
    };
    
    set({
      user: userWithData,
      token,
      isAuthenticated: true,
      coins: existingCoins,
      highScore: existingHighScore,
      totalScore: existingTotalScore, // Toplam skor eklendi
      snakeColor: existingSnakeColor,
      spxBalance: existingSpxBalance,
      gameCountItems: gameCountItems,
      activeSpxItems: activeSpxItems
    })
    
    // Kullanıcı verisini localStorage'a kaydet
    const userDataToSave = {
      username: userData.username,
      email: userData.email,
      coins: existingCoins,
      highScore: existingHighScore,
      totalScore: existingTotalScore, // Toplam skor eklendi
      snakeColor: existingSnakeColor,
      spxBalance: existingSpxBalance,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(userKey, JSON.stringify(userDataToSave));
    console.log('Store - Saved user data to localStorage on login:', userDataToSave);
  },
  
  logout: () => {
    console.log('Store - Logging out, keeping user data but clearing auth');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      // Keep coins and highScore in localStorage
    })
  },
  
  updateCoins: (newCoins) => {
    const currentCoins = get().coins;
    const currentUser = get().user;
    console.log('Store - Updating coins from', currentCoins, 'to', newCoins);
    
    set({ coins: newCoins })
    
    // Update user data as well
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        coins: newCoins 
      };
      set({ user: updatedUser })
      
      // Save user data to localStorage
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        coins: newCoins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: get().selectedCharacter,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      console.log('Store - Saved user data to localStorage:', userData);
    }
  },
  
  updateHighScore: (newScore) => {
    const currentUser = get().user;
    console.log('Store - Updating high score to', newScore);
    set({ highScore: newScore })
    
    // Save user data to localStorage
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        coins: get().coins,
        highScore: newScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: get().selectedCharacter,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      console.log('Store - Saved user data to localStorage:', userData);
    }
  },

  updateTotalScore: (newScore) => {
    const currentUser = get().user;
    const currentTotalScore = get().totalScore;
    const newTotalScore = currentTotalScore + newScore;
    console.log('Store - Updating total score from', currentTotalScore, 'to', newTotalScore);
    set({ totalScore: newTotalScore })
    
    // Save user data to localStorage
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: newTotalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: get().selectedCharacter,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      console.log('Store - Saved user data to localStorage:', userData);
    }
  },
  
  updateUser: (userData) => {
    set({ user: userData })
  },

  updateSnakeColor: (color) => {
    set({ snakeColor: color })
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: color,
        selectedCharacter: get().selectedCharacter,
        campaignProgress: get().campaignProgress,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  },

  updateSelectedCharacter: (character) => {
    set({ selectedCharacter: character })
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: character,
        campaignProgress: get().campaignProgress,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  },

  updateCampaignProgress: (level, completed) => {
    const prev = get().campaignProgress || {};
    const newProgress = { ...prev, [level]: completed };
    set({ campaignProgress: newProgress });
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        campaignProgress: newProgress,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  },

  updateSpxBalance: (newBalance) => {
    const currentUser = get().user;
    console.log('Store - Updating SPX balance from', get().spxBalance, 'to', newBalance);
    set({ spxBalance: newBalance })

    // Update user data as well
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        spxBalance: newBalance 
      };
      set({ user: updatedUser })
      
      // Save user data to localStorage
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        username: currentUser.username,
        email: currentUser.email,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: get().selectedCharacter,
        spxBalance: newBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      console.log('Store - Saved user data to localStorage:', userData);
    }
  },

  // SPX ürünlerini kontrol et
  checkActiveSpxItems: () => {
    const currentUser = get().user;
    if (!currentUser) return [];

    const activeItems = [];
    
    // Game count items'dan aktif ürünleri al
    const gameCountItems = get().gameCountItems;
    Object.keys(gameCountItems).forEach(itemId => {
      if (gameCountItems[itemId] > 0) {
        activeItems.push(itemId);
      }
    });
    
    // Kalıcı ürünleri ekle
    const activeSpxItems = get().activeSpxItems;
    activeItems.push(...activeSpxItems);
    
    return activeItems;
  },

  // Aktif ürünleri cache'le
  getActiveItems: () => {
    const currentUser = get().user;
    if (!currentUser) return [];

    const activeItems = [];
    
    // Game count items'dan aktif ürünleri al
    const gameCountItems = get().gameCountItems;
    Object.keys(gameCountItems).forEach(itemId => {
      if (gameCountItems[itemId] > 0) {
        activeItems.push(itemId);
      }
    });
    
    // Kalıcı ürünleri ekle
    const activeSpxItems = get().activeSpxItems;
    activeItems.push(...activeSpxItems);
    
    return activeItems;
  },

  // 2x coin multiplier aktif mi kontrol et
  isDoubleCoinsActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('double_coins');
  },

  // Hız artırıcı aktif mi kontrol et
  isSpeedBoostActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('speed_boost');
  },

  // Kalkan koruması aktif mi kontrol et
  isShieldActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('shield_protection');
  },

  // Altın yılan aktif mi kontrol et
  isGoldenSnakeActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('golden_snake');
  },

  // VIP rozeti aktif mi kontrol et
  isVipBadgeActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('vip_badge');
  },

  // Şans tılsımı aktif mi kontrol et
  isLuckyCharmActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('lucky_charm');
  },

  // Zaman durdurucu aktif mi kontrol et
  isTimeFreezeActive: () => {
    const activeItems = get().getActiveItems();
    return activeItems.includes('time_freeze');
  },

  // 10 oyunluk ürün satın alma
  purchaseGameCountItem: (itemId, gameCount = 10) => {
    const currentUser = get().user;
    const spxBalance = get().spxBalance;
    
    // SPX bakiyesini kontrol et
    const item = SPX_ITEMS.find(item => item.id === itemId);
    if (!item || spxBalance < item.price) {
      return false;
    }
    
    // Ürünü satın al
    const newSpxBalance = spxBalance - item.price;
    const gameCountItems = get().gameCountItems;
    
    set({ 
      spxBalance: newSpxBalance,
      gameCountItems: { ...gameCountItems, [itemId]: gameCount }
    });
    
    // localStorage'a kaydet
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        spxBalance: newSpxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      
      // Game count bilgisini kaydet
      const gameCountKey = `spxGameCount-${currentUser.username}`;
      const gameCountData = { ...gameCountItems, [itemId]: gameCount };
      localStorage.setItem(gameCountKey, JSON.stringify(gameCountData));
    }
    
    return true;
  },

  // Kalıcı ürün satın alma
  purchasePermanentItem: (itemId) => {
    const currentUser = get().user;
    const spxBalance = get().spxBalance;
    
    // SPX bakiyesini kontrol et
    const item = SPX_ITEMS.find(item => item.id === itemId);
    if (!item || spxBalance < item.price) {
      return false;
    }
    
    // Ürünü satın al
    const newSpxBalance = spxBalance - item.price;
    const activeSpxItems = get().activeSpxItems;
    
    set({ 
      spxBalance: newSpxBalance,
      activeSpxItems: [...activeSpxItems, itemId]
    });
    
    // localStorage'a kaydet
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        spxBalance: newSpxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      
      // Kalıcı ürün bilgisini kaydet
      const spxItemsKey = `spxItems-${currentUser.username}`;
      const spxItemsData = [...activeSpxItems, itemId];
      localStorage.setItem(spxItemsKey, JSON.stringify(spxItemsData));
    }
    
    return true;
  },

  // Bir oyunluk ürün satın alma
  purchaseOneGameItem: (itemId) => {
    const currentUser = get().user;
    const spxBalance = get().spxBalance;
    
    // SPX bakiyesini kontrol et
    const item = SPX_ITEMS.find(item => item.id === itemId);
    if (!item || spxBalance < item.price) {
      return false;
    }
    
    // Ürünü satın al
    const newSpxBalance = spxBalance - item.price;
    const usedOneGameItems = get().usedOneGameItems;
    
    set({ 
      spxBalance: newSpxBalance,
      usedOneGameItems: [...usedOneGameItems, itemId]
    });
    
    // localStorage'a kaydet
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        spxBalance: newSpxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      
      // Bir oyunluk ürün bilgisini kaydet
      const oneGameItemsKey = `usedOneGameItems-${currentUser.username}`;
      const oneGameItemsData = [...usedOneGameItems, itemId];
      localStorage.setItem(oneGameItemsKey, JSON.stringify(oneGameItemsData));
    }
    
    return true;
  },

  // Süreli ürün satın alma
  purchaseTimedItem: (itemId, duration) => {
    const currentUser = get().user;
    const spxBalance = get().spxBalance;
    
    // SPX bakiyesini kontrol et
    const item = SPX_ITEMS.find(item => item.id === itemId);
    if (!item || spxBalance < item.price) {
      return false;
    }
    
    // Ürünü satın al
    const newSpxBalance = spxBalance - item.price;
    const activeTimers = get().activeTimers;
    const endTime = Date.now() + (duration * 1000);
    
    set({ 
      spxBalance: newSpxBalance,
      activeTimers: { ...activeTimers, [itemId]: endTime }
    });
    
    // localStorage'a kaydet
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        spxBalance: newSpxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
      
      // Timer bilgisini kaydet
      const timerKey = `spxTimers-${currentUser.username}`;
      const timerData = { ...activeTimers, [itemId]: endTime };
      localStorage.setItem(timerKey, JSON.stringify(timerData));
    }
    
    return true;
  },

  // Bir oyunluk ürün kullanma
  useOneGameItem: (itemId) => {
    const currentUser = get().user;
    const usedOneGameItems = get().usedOneGameItems;
    
    // Ürünün kullanılıp kullanılmadığını kontrol et
    if (usedOneGameItems.includes(itemId)) {
      return false;
    }
    
    // Ürünü kullanıldı olarak işaretle
    set({ usedOneGameItems: [...usedOneGameItems, itemId] });
    
    // localStorage'a kaydet
    if (currentUser) {
      const usedItemsKey = `usedOneGameItems-${currentUser.username}`;
      localStorage.setItem(usedItemsKey, JSON.stringify([...usedOneGameItems, itemId]));
    }
    
    return true;
  },

  // Oyun sonunda bir oyunluk ürünleri sıfırla
  resetOneGameItems: () => {
    set({ usedOneGameItems: [] });
    const currentUser = get().user;
    if (currentUser) {
      const usedItemsKey = `usedOneGameItems-${currentUser.username}`;
      localStorage.removeItem(usedItemsKey);
    }
  },

  // Oyun sonunda game count'u azalt
  decrementGameCount: () => {
    const gameCountItems = get().gameCountItems;
    const currentUser = get().user;
    const newGameCountItems = {};
    
    Object.keys(gameCountItems).forEach(itemId => {
      if (gameCountItems[itemId] > 1) {
        newGameCountItems[itemId] = gameCountItems[itemId] - 1;
      }
      // 0'a düşen ürünler otomatik olarak kaldırılır
    });
    
    set({ gameCountItems: newGameCountItems });
    
    // localStorage'ı güncelle
    if (currentUser) {
      const gameCountKey = `spxGameCount-${currentUser.username}`;
      localStorage.setItem(gameCountKey, JSON.stringify(newGameCountItems));
    }
  },

  // Süreli ürünlerin kalan süresini kontrol et
  getRemainingTime: (itemId) => {
    const activeTimers = get().activeTimers;
    const endTime = activeTimers[itemId];
    if (!endTime) return 0;
    
    const remaining = Math.max(0, endTime - Date.now());
    return Math.ceil(remaining / 1000); // Saniye cinsinden
  },

  // Süresi biten ürünleri temizle
  cleanupExpiredItems: () => {
    const activeTimers = get().activeTimers;
    const currentTime = Date.now();
    const newActiveTimers = {};
    
    Object.keys(activeTimers).forEach(itemId => {
      if (activeTimers[itemId] > currentTime) {
        newActiveTimers[itemId] = activeTimers[itemId];
      }
    });
    
    set({ activeTimers: newActiveTimers });
    
    // localStorage'ı güncelle
    const currentUser = get().user;
    if (currentUser) {
      const timerKey = `spxTimers-${currentUser.username}`;
      localStorage.setItem(timerKey, JSON.stringify(newActiveTimers));
    }
  },

  convertCoinsToSpx: () => {
    const coins = get().coins;
    const spx = get().spxBalance;
    if (coins >= 1000) {
      const toConvert = Math.floor(coins / 1000);
      const newCoins = coins - toConvert * 1000;
      const newSpx = spx + toConvert;
      set({ coins: newCoins, spxBalance: newSpx });
      const currentUser = get().user;
      if (currentUser) {
        const userKey = `serpyx-user-${currentUser.username}`;
        const userData = {
          ...currentUser,
          coins: newCoins,
          highScore: get().highScore,
          totalScore: get().totalScore,
          snakeColor: get().snakeColor,
          selectedCharacter: get().selectedCharacter,
          campaignProgress: get().campaignProgress,
          spxBalance: newSpx,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      }
    }
  },

  updateAchievement: (key) => {
    const prev = get().achievements || {};
    if (!prev[key]) {
      const newAchievements = { ...prev, [key]: true };
      set({ achievements: newAchievements });
      const currentUser = get().user;
      if (currentUser) {
        const userKey = `serpyx-user-${currentUser.username}`;
        const userData = {
          ...currentUser,
          coins: get().coins,
          highScore: get().highScore,
          totalScore: get().totalScore,
          snakeColor: get().snakeColor,
          selectedCharacter: get().selectedCharacter,
          campaignProgress: get().campaignProgress,
          spxBalance: get().spxBalance,
          achievements: newAchievements,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      }
    }
  },
    }),
    {
      name: 'serpyx-storage', // unique name for localStorage
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        coins: state.coins,
        highScore: state.highScore,
        totalScore: state.totalScore,
        snakeColor: state.snakeColor,
        selectedCharacter: state.selectedCharacter,
        campaignProgress: state.campaignProgress,
        spxBalance: state.spxBalance,
        achievements: state.achievements,
        gameCountItems: state.gameCountItems,
        activeSpxItems: state.activeSpxItems
      })
    }
  )
)