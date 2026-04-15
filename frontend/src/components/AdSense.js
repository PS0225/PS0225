import { useEffect } from 'react';

/**
 * Google AdSense Component
 * 
 * Props:
 * - adSlot: Your ad slot ID (get from AdSense dashboard)
 * - adFormat: 'auto', 'rectangle', 'horizontal', 'vertical'
 * - adStyle: Custom inline styles
 * - className: Additional CSS classes
 */

function AdSense({ 
  adSlot = 'XXXXXXXXXX', // Replace with your actual ad slot
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = ''
}) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`bg-gray-800 border border-gray-700 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-400">📢 Ad Space (Development Mode)</p>
        <p className="text-xs text-gray-500 mt-2">AdSense ads will show in production</p>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}

export default AdSense;
