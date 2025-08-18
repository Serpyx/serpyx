import React, { useEffect } from 'react'

const AdBanner = ({ 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  className = '',
  style = {}
}) => {
  useEffect(() => {
    try {
      // AdSense reklamını yükle
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.log('AdSense yüklenemedi:', error)
    }
  }, [])

  return (
    <div className={`ad-banner ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9578407821690734"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  )
}

export default AdBanner
