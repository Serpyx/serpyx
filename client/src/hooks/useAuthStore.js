import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
      selectedTheme: null, // Oyun alanı teması kaldırıldı
      selectedCharacter: 'default', // 'default', 'nft-snake', etc.
  selectedNFTCharacter: null, // Seçili NFT karakteri
      campaignProgress: {},
      achievements: {},
      activeSpxItems: [], // Aktif SPX ürünleri
      activeTimers: {}, // Süreli ürünler için sayaçlar
      usedOneGameItems: [], // Bir oyunluk kullanılan ürünler
      ownedNFTs: [], // Sahip olunan NFT'ler
      nftInventory: {}, // NFT envanteri (quality -> nft listesi)
      globalNFTCounts: {}, // Global NFT adetleri (nftId -> kalan adet)
  
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
    let existingSelectedNFTCharacter = null;
    let existingOwnedNFTs = [];
    
    if (existingUserData) {
      try {
        const parsed = JSON.parse(existingUserData);
        existingCoins = parsed.coins || 0;
        existingHighScore = parsed.highScore || 0;
        existingTotalScore = parsed.totalScore || 0; // Toplam skor eklendi
        existingSnakeColor = parsed.snakeColor || '#22c55e';
        existingSpxBalance = parsed.spxBalance || 0;
        existingSelectedNFTCharacter = parsed.selectedNFTCharacter || null;
        existingOwnedNFTs = parsed.ownedNFTs || [];
        console.log('Store - Found existing user data:', { 
          coins: existingCoins, 
          highScore: existingHighScore,
          totalScore: existingTotalScore, // Toplam skor eklendi
          snakeColor: existingSnakeColor,
          spxBalance: existingSpxBalance,
          selectedNFTCharacter: existingSelectedNFTCharacter,
          ownedNFTs: existingOwnedNFTs
        });
      } catch (e) {
        console.log('Store - No existing user data found');
      }
    } else {
      // Yeni kullanıcı için temiz başlangıç + Ashstripe NFT
      console.log('Store - New user, starting with clean data + Ashstripe NFT');
      existingCoins = 100; // Başlangıç coin'i
      existingHighScore = 0;
      existingTotalScore = 0; // Toplam skor eklendi
      existingSnakeColor = '#22c55e';
      existingSpxBalance = 1000; // Test amaçlı 1000 SPX
      
      // Ashstripe NFT'sini otomatik ver
      const ashstripeNFT = {
        id: 'ashstripe',
        name: 'Ashstripe',
        image: '/Serpyx_NFT/common_quality/Ashstripe.png',
        quality: 'common',
        acquiredAt: new Date().toISOString()
      };
      
      existingSelectedNFTCharacter = ashstripeNFT; // Varsayılan profil fotoğrafı
      existingOwnedNFTs = [ashstripeNFT];
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
      selectedNFTCharacter: existingSelectedNFTCharacter,
      ownedNFTs: existingOwnedNFTs
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
      selectedNFTCharacter: existingSelectedNFTCharacter,
      ownedNFTs: existingOwnedNFTs,
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
    console.log('Store - Updating snake color from', get().snakeColor, 'to', color);
    set({ snakeColor: color });
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
        campaignProgress: get().campaignProgress,
        spxBalance: get().spxBalance,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  },

  updateSelectedTheme: (theme) => {
    console.log('Store - Updating selected theme from', get().selectedTheme, 'to', theme);
    set({ selectedTheme: theme });
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedTheme: theme,
        selectedCharacter: get().selectedCharacter,
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
        selectedCharacter: get().selectedCharacter,
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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
        selectedNFTCharacter: get().selectedNFTCharacter,
        ownedNFTs: get().ownedNFTs,
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

    const spxItemsKey = `spxItems-${currentUser.username}`;
    const spxItemsData = localStorage.getItem(spxItemsKey);
    if (!spxItemsData) return [];

    try {
      const spxItems = JSON.parse(spxItemsData);
      return spxItems;
    } catch (e) {
      console.log('Error parsing SPX items:', e);
      return [];
    }
  },

  // 2x coin multiplier aktif mi kontrol et
  isDoubleCoinsActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('double_coins');
  },

  // Hız artırıcı aktif mi kontrol et
  isSpeedBoostActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('speed_boost');
  },

  // Kalkan koruması aktif mi kontrol et
  isShieldActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('shield_protection');
  },

  // Altın yılan aktif mi kontrol et
  isGoldenSnakeActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('golden_snake');
  },

  // VIP rozeti aktif mi kontrol et
  isVipBadgeActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('vip_badge');
  },

  // Şans tılsımı aktif mi kontrol et
  isLuckyCharmActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('lucky_charm');
  },

  // Mıknatıs gücü aktif mi kontrol et
  isMagnetActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('magnet_power');
  },

  // Zaman durdurucu aktif mi kontrol et
  isTimeFreezeActive: () => {
    const activeItems = get().checkActiveSpxItems();
    return activeItems.includes('time_freeze');
  },

  // Süreli ürün satın alma (geçici olarak devre dışı)
  purchaseTimedItem: (itemId, duration) => {
    return false; // Geçici olarak devre dışı
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

  // Süreli ürünlerin kalan süresini kontrol et (geçici olarak devre dışı)
  getRemainingTime: (itemId) => {
    return 0; // Geçici olarak devre dışı
  },

  // Süresi biten ürünleri temizle (geçici olarak devre dışı)
  cleanupExpiredItems: () => {
    // Geçici olarak devre dışı
  },

  convertCoinsToSpx: () => {
    const coins = get().coins;
    const spx = get().spxBalance;
    if (coins >= 100) {
      const toConvert = Math.floor(coins / 100);
      const newCoins = coins - toConvert * 100;
      const newSpx = spx + toConvert;
      
      // Coin'leri güncelle
      get().updateCoins(newCoins);
      
      // SPX bakiyesini güncelle (Navbar'ı da günceller)
      get().updateSpxBalance(newSpx);
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

  // NFT Fonksiyonları
  purchaseNFT: (nftId, quality, price) => {
    const currentSpx = get().spxBalance;
    const currentUser = get().user;
    
    // Ashstripe ücretsiz
    if (nftId === 'ashstripe') {
      const ownedNFTs = get().ownedNFTs || [];
      if (ownedNFTs.some(nft => nft.id === 'ashstripe')) {
        return { success: false, message: 'Bu NFT\'ye zaten sahipsiniz!' };
      }
      
      // Ashstripe NFT objesi oluştur
      const ashstripeNFT = {
        id: 'ashstripe',
        name: 'Ashstripe',
        image: '/Serpyx_NFT/common_quality/Ashstripe.png',
        quality: 'common',
        acquiredAt: new Date().toISOString()
      }
      
      const newOwnedNFTs = [...ownedNFTs, ashstripeNFT];
      set({ ownedNFTs: newOwnedNFTs });
      
      // Eğer profil fotoğrafı yoksa Ashstripe'ı profil fotoğrafı yap
      const currentSelectedNFT = get().selectedNFTCharacter;
      if (!currentSelectedNFT) {
        set({ selectedNFTCharacter: ashstripeNFT });
      }
      
      // localStorage'a kaydet
      if (currentUser) {
        const userKey = `serpyx-user-${currentUser.username}`;
        const userData = {
          ...currentUser,
          coins: get().coins,
          highScore: get().highScore,
          totalScore: get().totalScore,
          snakeColor: get().snakeColor,
          selectedCharacter: get().selectedCharacter,
          selectedNFTCharacter: currentSelectedNFT || ashstripeNFT,
          campaignProgress: get().campaignProgress,
          spxBalance: currentSpx,
          ownedNFTs: newOwnedNFTs,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      }
      
      return { success: true, message: 'Ashstripe NFT ücretsiz olarak alındı!' };
    }
    
    if (currentSpx < price) {
      return { success: false, message: 'Yeterli SPX yok!' };
    }
    
    // NFT'nin zaten sahip olunup olunmadığını kontrol et
    const ownedNFTs = get().ownedNFTs || [];
    if (ownedNFTs.some(nft => nft.id === nftId)) {
      return { success: false, message: 'Bu NFT\'ye zaten sahipsiniz!' };
    }
    
    // Global NFT adetini kontrol et
    const remainingCount = get().getNFTRemainingCount(nftId);
    if (remainingCount <= 0) {
      return { success: false, message: 'Bu NFT tükenmiş!' };
    }
    
    // Global adeti azalt
    const decrementSuccess = get().decrementNFTCount(nftId);
    if (!decrementSuccess) {
      return { success: false, message: 'Bu NFT tükenmiş!' };
    }
    
    // SPX'den düş
    const newSpx = currentSpx - price;
    
    // NFT objesi oluştur
    const nftObject = {
      id: nftId,
      name: get().getNFTName(nftId),
      image: get().getNFTImage(nftId),
      quality: quality
    }
    
    const newOwnedNFTs = [...ownedNFTs, nftObject];
    
    // SPX bakiyesini güncelle (Navbar'ı da günceller)
    get().updateSpxBalance(newSpx);
    
    // NFT listesini güncelle
    set({ ownedNFTs: newOwnedNFTs });
    
    // localStorage'a kaydet
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const userData = {
        ...currentUser,
        coins: get().coins,
        highScore: get().highScore,
        totalScore: get().totalScore,
        snakeColor: get().snakeColor,
        selectedCharacter: get().selectedCharacter,
        selectedNFTCharacter: get().selectedNFTCharacter,
        campaignProgress: get().campaignProgress,
        spxBalance: newSpx,
        ownedNFTs: newOwnedNFTs,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
    
    return { success: true, message: 'NFT başarıyla satın alındı!' };
  },

  // NFT envanterini güncelle
  updateNFTInventory: (quality, nftList) => {
    const currentInventory = get().nftInventory || {};
    const newInventory = { ...currentInventory, [quality]: nftList };
    set({ nftInventory: newInventory });
  },

  // NFT'ye sahip olup olmadığını kontrol et
  ownsNFT: (nftId) => {
    const ownedNFTs = get().ownedNFTs || [];
    return ownedNFTs.some(nft => nft.id === nftId);
  },

  // NFT adını al
  getNFTName: (nftId) => {
    const nftCategories = [
      {
        key: 'common',
        nfts: [
          { id: 'ashstripe', name: 'Ashstripe' },
          { id: 'blurple_fang', name: 'Blurple Fang' },
          { id: 'bubblecoil', name: 'Bubblecoil' },
          { id: 'citrus_curl', name: 'Citrus Curl' },
          { id: 'copper_slither', name: 'Copper Slither' },
          { id: 'emberloop', name: 'Emberloop' },
          { id: 'frostbite', name: 'Frostbite' },
          { id: 'jade_vibe', name: 'Jade Vibe' },
          { id: 'mintscale', name: 'Mintscale' },
          { id: 'shadowtongue', name: 'Shadowtongue' },
          { id: 'suncoil', name: 'Suncoil' },
          { id: 'vio_venom', name: 'Vio-Venom' }
        ]
      },
      {
        key: 'rare',
        nfts: [
          { id: 'aquariel', name: 'Aquariel' },
          { id: 'cryptalon', name: 'Cryptalon' },
          { id: 'luminara', name: 'Luminara' },
          { id: 'noctivex', name: 'Noctivex' },
          { id: 'pyronox', name: 'Pyronox' },
          { id: 'sandshade', name: 'Sandshade' },
          { id: 'solflare', name: 'Solflare' },
          { id: 'terravyn', name: 'Terravyn' },
          { id: 'thornveil', name: 'Thornveil' },
          { id: 'umbrageist', name: 'Umbrageist' },
          { id: 'virdra', name: 'Virdra' },
          { id: 'zephris', name: 'Zephris' }
        ]
      },
      {
        key: 'legendary',
        nfts: [
          { id: 'aetherion', name: 'Aetherion' },
          { id: 'drakoryn', name: 'Drakoryn' },
          { id: 'ignivore', name: 'Ignivore' },
          { id: 'nyxshade', name: 'Nyxshade' },
          { id: 'seraphyx', name: 'Seraphyx' },
          { id: 'sylvaran', name: 'Sylvaran' },
          { id: 'thalmyra', name: 'Thalmyra' },
          { id: 'umbrelith', name: 'Umbrelith' },
          { id: 'velmora', name: 'Velmora' },
          { id: 'zarynthos', name: 'Zarynthos' }
        ]
      },
      {
        key: 'mythic',
        nfts: [
          { id: 'celestial_star', name: 'Celestial Star' },
          { id: 'crowncoil_marco', name: 'Crowncoil Marco' },
          { id: 'mythic_1', name: 'Mythic Guardian' },
          { id: 'mythic_2', name: 'Eternal Serpent' },
          { id: 'mythic_3', name: 'Cosmic Dragon' },
          { id: 'mythic_4', name: 'Divine Wyrm' },
          { id: 'mythic_5', name: 'Ancient Phoenix' },
          { id: 'mythic_7_1', name: 'Shadow Sovereign' },
          { id: 'mythic_7_2', name: 'Light Emperor' },
          { id: 'mythic_8', name: 'Void Serpent' },
          { id: 'mythic_9', name: 'Ethereal Dragon' }
        ]
      }
    ];

    for (const category of nftCategories) {
      const nft = category.nfts.find(n => n.id === nftId);
      if (nft) return nft.name;
    }
    return nftId;
  },

  // NFT resmini al
  getNFTImage: (nftId) => {
    const nftCategories = [
      {
        key: 'common',
        nfts: [
          { id: 'ashstripe', image: '/Serpyx_NFT/common_quality/Ashstripe.png' },
          { id: 'blurple_fang', image: '/Serpyx_NFT/common_quality/Blurple Fang.png' },
          { id: 'bubblecoil', image: '/Serpyx_NFT/common_quality/Bubblecoil.png' },
          { id: 'citrus_curl', image: '/Serpyx_NFT/common_quality/Citrus Curl.png' },
          { id: 'copper_slither', image: '/Serpyx_NFT/common_quality/Copper Slither.png' },
          { id: 'emberloop', image: '/Serpyx_NFT/common_quality/Emberloop.png' },
          { id: 'frostbite', image: '/Serpyx_NFT/common_quality/Frostbite.png' },
          { id: 'jade_vibe', image: '/Serpyx_NFT/common_quality/Jade Vibe.png' },
          { id: 'mintscale', image: '/Serpyx_NFT/common_quality/Mintscale.png' },
          { id: 'shadowtongue', image: '/Serpyx_NFT/common_quality/Shadowtongue.png' },
          { id: 'suncoil', image: '/Serpyx_NFT/common_quality/Suncoil.png' },
          { id: 'vio_venom', image: '/Serpyx_NFT/common_quality/Vio-Venom.png' }
        ]
      },
      {
        key: 'rare',
        nfts: [
          { id: 'aquariel', image: '/Serpyx_NFT/rare_quality/Aquariel.png' },
          { id: 'cryptalon', image: '/Serpyx_NFT/rare_quality/Cryptalon.png' },
          { id: 'luminara', image: '/Serpyx_NFT/rare_quality/Luminara.png' },
          { id: 'noctivex', image: '/Serpyx_NFT/rare_quality/Noctivex.png' },
          { id: 'pyronox', image: '/Serpyx_NFT/rare_quality/Pyronox.png' },
          { id: 'sandshade', image: '/Serpyx_NFT/rare_quality/Sandshade.png' },
          { id: 'solflare', image: '/Serpyx_NFT/rare_quality/Solflare.png' },
          { id: 'terravyn', image: '/Serpyx_NFT/rare_quality/Terravyn.png' },
          { id: 'thornveil', image: '/Serpyx_NFT/rare_quality/Thornveil.png' },
          { id: 'umbrageist', image: '/Serpyx_NFT/rare_quality/Umbrageist.png' },
          { id: 'virdra', image: '/Serpyx_NFT/rare_quality/Virdra.png' },
          { id: 'zephris', image: '/Serpyx_NFT/rare_quality/Zephris.png' }
        ]
      },
      {
        key: 'legendary',
        nfts: [
          { id: 'aetherion', image: '/Serpyx_NFT/legendary_quality/Aetherion.png' },
          { id: 'drakoryn', image: '/Serpyx_NFT/legendary_quality/Drakoryn.png' },
          { id: 'ignivore', image: '/Serpyx_NFT/legendary_quality/Ignivore.png' },
          { id: 'luminara', image: '/Serpyx_NFT/legendary_quality/Luminara.png' },
          { id: 'nyxshade', image: '/Serpyx_NFT/legendary_quality/Nyxshade.png' },
          { id: 'seraphyx', image: '/Serpyx_NFT/legendary_quality/Seraphyx.png' },
          { id: 'sylvaran', image: '/Serpyx_NFT/legendary_quality/Sylvaran.png' },
          { id: 'thalmyra', image: '/Serpyx_NFT/legendary_quality/Thalmyra.png' },
          { id: 'umbrelith', image: '/Serpyx_NFT/legendary_quality/Umbrelith.png' },
          { id: 'velmora', image: '/Serpyx_NFT/legendary_quality/Velmora.png' },
          { id: 'zarynthos', image: '/Serpyx_NFT/legendary_quality/Zarynthos.png' }
        ]
      },
      {
        key: 'mythic',
        nfts: [
          { id: 'celestial_star', image: '/Serpyx_NFT/mythic_quality/Celestial Star.png' },
          { id: 'crowncoil_marco', image: '/Serpyx_NFT/mythic_quality/Crowncoil Marco.png' },
          { id: 'mythic_1', image: '/Serpyx_NFT/mythic_quality/1.png' },
          { id: 'mythic_2', image: '/Serpyx_NFT/mythic_quality/2.png' },
          { id: 'mythic_3', image: '/Serpyx_NFT/mythic_quality/3.png' },
          { id: 'mythic_4', image: '/Serpyx_NFT/mythic_quality/4.png' },
          { id: 'mythic_5', image: '/Serpyx_NFT/mythic_quality/5.png' },
          { id: 'mythic_7_1', image: '/Serpyx_NFT/mythic_quality/7 (1).png' },
          { id: 'mythic_7_2', image: '/Serpyx_NFT/mythic_quality/7 (2).png' },
          { id: 'mythic_8', image: '/Serpyx_NFT/mythic_quality/8.png' },
          { id: 'mythic_9', image: '/Serpyx_NFT/mythic_quality/9.png' }
        ]
      }
    ];

    for (const category of nftCategories) {
      const nft = category.nfts.find(n => n.id === nftId);
      if (nft) return nft.image;
    }
    return '/Serpyx_NFT/common_quality/Ashstripe.png'; // Default image
  },

  // NFT karakterini seç
  selectNFTCharacter: (nftId) => {
    const ownedNFTs = get().ownedNFTs || [];
    if (ownedNFTs.includes(nftId)) {
      set({ selectedNFTCharacter: nftId });
      
      // localStorage'a kaydet
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
          selectedNFTCharacter: nftId,
          campaignProgress: get().campaignProgress,
          spxBalance: get().spxBalance,
          ownedNFTs: get().ownedNFTs,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(userKey, JSON.stringify(userData));
      }
      
      return { success: true, message: 'NFT karakteri seçildi!' };
    } else {
      return { success: false, message: 'Bu NFT\'ye sahip değilsiniz!' };
    }
  },

  // Seçili NFT karakterini al
  getSelectedNFTCharacter: () => {
    return get().selectedNFTCharacter;
  },

  // Test amaçlı SPX ekleme fonksiyonu
  addTestSpx: (amount = 1000) => {
    const currentSpx = get().spxBalance;
    const newSpx = currentSpx + amount;
    
    // SPX bakiyesini güncelle (Navbar'ı da günceller)
    get().updateSpxBalance(newSpx);
    
    return { success: true, message: `${amount} SPX eklendi!` };
  },

  // Global NFT adetlerini başlat
  initializeGlobalNFTCounts: () => {
    const currentCounts = get().globalNFTCounts;
    if (Object.keys(currentCounts).length === 0) {
      // İlk kez başlatılıyor
      const initialCounts = {
        // Common NFT'ler - 10,000 adet
        'citrus_curl': 10000, 'copper_slither': 10000, 'ashstripe': 10000,
        'jade_vibe': 10000, 'frostbite': 10000, 'vio_venom': 10000,
        'mintscale': 10000, 'bubblecoil': 10000, 'shadowtongue': 10000,
        'suncoil': 10000, 'blurple_fang': 10000, 'emberloop': 10000,
        
        // Rare NFT'ler - 1,000 adet
        'solflare': 1000, 'thornveil': 1000, 'sandshade': 1000,
        'cryptalon': 1000, 'aquariel': 1000, 'noctivex': 1000,
        'virdra': 1000, 'luminara': 1000, 'terravyn': 1000,
        'umbrageist': 1000, 'zephris': 1000, 'pyronox': 1000,
        
        // Legendary NFT'ler - 10 adet
        'thalmyra': 10, 'zarynthos': 10, 'umbrelith': 10,
        'seraphyx': 10, 'ignivore': 10, 'velmora': 10,
        'sylvaran': 10, 'drakoryn': 10, 'nyxshade': 10, 'aetherion': 10,
        
        // Mythic NFT'ler - 1 adet
        'celestial_star': 1, 'crowncoil_marco': 1,
        'mythic_1': 1, 'mythic_2': 1, 'mythic_3': 1, 'mythic_4': 1,
        'mythic_5': 1, 'mythic_7_1': 1, 'mythic_7_2': 1, 'mythic_8': 1, 'mythic_9': 1
      };
      
      set({ globalNFTCounts: initialCounts });
      
      // Global adetleri localStorage'a kaydet
      localStorage.setItem('serpyx-global-nft-counts', JSON.stringify(initialCounts));
    }
  },

  // Global NFT adetlerini sıfırla (yeni NFT'ler eklendiğinde kullanılır)
  resetGlobalNFTCounts: () => {
    const initialCounts = {
      // Common NFT'ler - 10,000 adet
      'citrus_curl': 10000, 'copper_slither': 10000, 'ashstripe': 10000,
      'jade_vibe': 10000, 'frostbite': 10000, 'vio_venom': 10000,
      'mintscale': 10000, 'bubblecoil': 10000, 'shadowtongue': 10000,
      'suncoil': 10000, 'blurple_fang': 10000, 'emberloop': 10000,
      
      // Rare NFT'ler - 1,000 adet
      'solflare': 1000, 'thornveil': 1000, 'sandshade': 1000,
      'cryptalon': 1000, 'aquariel': 1000, 'noctivex': 1000,
      'virdra': 1000, 'luminara': 1000, 'terravyn': 1000,
      'umbrageist': 1000, 'zephris': 1000, 'pyronox': 1000,
      
      // Legendary NFT'ler - 10 adet
      'thalmyra': 10, 'zarynthos': 10, 'umbrelith': 10,
      'seraphyx': 10, 'ignivore': 10, 'velmora': 10,
      'sylvaran': 10, 'drakoryn': 10, 'nyxshade': 10, 'aetherion': 10,
      
      // Mythic NFT'ler - 1 adet
      'celestial_star': 1, 'crowncoil_marco': 1,
      'mythic_1': 1, 'mythic_2': 1, 'mythic_3': 1, 'mythic_4': 1,
      'mythic_5': 1, 'mythic_7_1': 1, 'mythic_7_2': 1, 'mythic_8': 1, 'mythic_9': 1
    };
    
    set({ globalNFTCounts: initialCounts });
    
    // Global adetleri localStorage'a kaydet
    localStorage.setItem('serpyx-global-nft-counts', JSON.stringify(initialCounts));
    
    return { success: true, message: 'NFT adetleri sıfırlandı!' };
  },

  // NFT'nin kalan adetini al
  getNFTRemainingCount: (nftId) => {
    const globalCounts = get().globalNFTCounts;
    return globalCounts[nftId] || 0;
  },

  // NFT satın alındığında global adeti azalt
  decrementNFTCount: (nftId) => {
    const currentCounts = get().globalNFTCounts;
    const currentCount = currentCounts[nftId] || 0;
    
    if (currentCount > 0) {
      const newCounts = { ...currentCounts, [nftId]: currentCount - 1 };
      set({ globalNFTCounts: newCounts });
      
      // Global adetleri localStorage'a kaydet
      localStorage.setItem('serpyx-global-nft-counts', JSON.stringify(newCounts));
      return true;
    }
    return false;
  },

  // Seçili NFT karakterini güncelle
  updateSelectedNFTCharacter: (nft) => {
    set({ selectedNFTCharacter: nft });
    
    // Kullanıcı verisini localStorage'a kaydet
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const existingData = localStorage.getItem(userKey);
      let userData = existingData ? JSON.parse(existingData) : {};
      
      userData.selectedNFTCharacter = nft;
      localStorage.setItem(userKey, JSON.stringify(userData));
    }
  },

  // Sahip olunan NFT'leri güncelle
  updateOwnedNFTs: (nfts) => {
    set({ ownedNFTs: nfts });
    
    // Kullanıcı verisini localStorage'a kaydet
    const currentUser = get().user;
    if (currentUser) {
      const userKey = `serpyx-user-${currentUser.username}`;
      const existingData = localStorage.getItem(userKey);
      let userData = existingData ? JSON.parse(existingData) : {};
      
      userData.ownedNFTs = nfts;
      localStorage.setItem(userKey, JSON.stringify(userData));
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
        selectedNFTCharacter: state.selectedNFTCharacter,
        campaignProgress: state.campaignProgress,
        spxBalance: state.spxBalance,
        achievements: state.achievements,
        ownedNFTs: state.ownedNFTs,
        nftInventory: state.nftInventory
      })
    }
  )
)