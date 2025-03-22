import React, { useEffect, useState } from 'react';
import './style.css';

const INDIAN_LANGUAGES = {
  hi: "Hindi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  mr: "Marathi",
  gu: "Gujarati",
  pa: "Punjabi",
  ur: "Urdu"
};

const GoogleTranslate = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const cookieName = 'googtrans';
    const initTranslate = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,bn,ta,te,ml,kn,mr,gu,pa,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL
          },
          'google_translate_element'
        );
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing translate element:', err);
        setTimeout(initTranslate, 200); // Retry if fails
      }
    };

    // Load Google Translate Script
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-script';
      
      window.googleTranslateElementInit = initTranslate;
      document.head.appendChild(script);
    } else {
      initTranslate();
    }

    return () => {
      const script = document.getElementById('google-translate-script');
      if (script) script.remove();
      delete window.googleTranslateElementInit;
      delete window._googleTranslateElement;
    };
  }, []);

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    setSelectedLanguage(langCode);

    // Set the Google Translate cookie
    const cookieValue = langCode === 'en' ? null : `/en/${langCode}`;
    if (cookieValue) {
      document.cookie = `googtrans=${cookieValue}; path=/`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname}`;
    } else {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = `googtrans=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }

    // Trigger the translation
    const doTranslate = () => {
      const select = document.querySelector('.goog-te-combo');
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change', { bubbles: true }));

        // Reload the translation
        if (window.location.hash === '#googtrans(en|' + langCode + ')') {
          window.location.hash = 'googtrans(en|' + langCode + ')?reload';
        } else {
          window.location.hash = 'googtrans(en|' + langCode + ')';
        }

        return true;
      }
      return false;
    };

    // Try to translate with retries
    if (!doTranslate()) {
      let attempts = 0;
      const interval = setInterval(() => {
        if (doTranslate() || attempts >= 10) {
          clearInterval(interval);
        }
        attempts++;
      }, 200);
    }
  };

  return (
    <div className="google-translate-wrapper">
      {isLoading && <div className="translate-loader">Loading...</div>}
      <div id="google_translate_element" className="hidden-translate-element"></div>
      <select 
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="custom-language-select"
      >
        <option value="en">English</option>
        {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GoogleTranslate;
