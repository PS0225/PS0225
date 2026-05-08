import { useEffect } from 'react';

/**
 * Google AdSense Component
 * 
 * Setup:
 * 1. Get your Publisher ID from AdSense dashboard (looks like ca-pub-1234567890123456)
 * 2. Replace the placeholder in /app/frontend/public/index.html (script tag)
 * 3. Replace `ADSENSE_CLIENT` below with the same ID
 * 4. Each ad-slot prop should match a slot ID created in AdSense dashboard
 * 
 * Props:
 * - adSlot: Your ad slot ID (get from AdSense dashboard)
 * - adFormat: 'auto', 'rectangle', 'horizontal', 'vertical'
 * - adStyle: Custom inline styles
 * - className: Additional CSS classes
 * - label: Optional small label shown above the ad ("Advertisement")
 */

// CHANGE THIS to your real AdSense publisher ID after approval
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

function AdSense({
  adSlot = 'XXXXXXXXXX',
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  label = 'Advertisement'
}) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && process.env.NODE_ENV === 'production' &&
          ADSENSE_CLIENT !== 'ca-pub-XXXXXXXXXXXXXXXX') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Show placeholder if AdSense not configured yet (dev or pre-approval)
  const isUnconfigured = ADSENSE_CLIENT === 'ca-pub-XXXXXXXXXXXXXXXX';
  if (process.env.NODE_ENV !== 'production' || isUnconfigured) {
    return (
      <div
        data-testid={`adslot-${adSlot}`}
        className={`bg-gray-800/40 border border-dashed border-gray-700 rounded-lg p-6 text-center ${className}`}
      >
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <p className="text-sm text-gray-400">📢 Ad Slot ({adSlot})</p>
        <p className="text-[10px] text-gray-600 mt-2">
          {isUnconfigured ? 'Replace ADSENSE_CLIENT in AdSense.js + public/index.html with your real Publisher ID' : 'Ads show in production'}
        </p>
      </div>
    );
  }

  return (
    <div className={className} data-testid={`adslot-${adSlot}`}>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1 text-center">{label}</p>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdSense;
