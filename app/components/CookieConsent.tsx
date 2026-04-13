'use client';

import { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentValue = localStorage.getItem('cookieConsent');

    // Show banner only if no valid value is set
    if (consentValue !== 'accepted' && consentValue !== 'rejected') {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    localStorage.setItem('cookieConsent', 'accepted');

    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true }),
      });
    } catch (error) {
      console.error('Failed to send consent data:', error);
    }

    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = async () => {
    localStorage.setItem('cookieConsent', 'rejected');

    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: false }),
      });
    } catch (error) {
      console.error('Failed to send consent data:', error);
    }

    setIsVisible(false);
    onReject?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-6 md:p-8 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="text-[15px] text-gray-700 text-center sm:text-left">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <a href="/privacy" className="text-blue-600 hover:text-blue-800 underline ml-2 font-medium" tabIndex={0}>
            Learn more
          </a>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            className="px-5 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
