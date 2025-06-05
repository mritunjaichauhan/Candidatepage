import React, { useState } from "react";
import { MapPin, Clock, Languages, Building2, ChevronDown } from "lucide-react";

const LocalStatsSection = () => {
  const [currentLanguage, setCurrentLanguage] = useState("english");


  const languageContent = {
    english: {
      name: "English",
      title: "Language Is No Barrier to Success",
      description:
        "With support available in 10+ regional languages, we make it easy for you to guide your followers and help them secure opportunities, regardless of language preferences.",
    },
    hindi: {
      name: "हिंदी",
      title: "भाषा सफलता में बाधा नहीं है",
      description:
        "10+ क्षेत्रीय भाषाओं में उपलब्ध समर्थन के साथ, हम आपके फॉलोअर्स को मार्गदर्शन करने और भाषा प्राथमिकताओं की परवाह किए बिना अवसरों को सुरक्षित करने में मदद करना आसान बनाते हैं।",
    },
    tamil: {
      name: "தமிழ்",
      title: "வெற்றிக்கு மொழி தடையல்ல",
      description:
        "10+ பிராந்திய மொழிகளில் ஆதரவு கிடைக்கும் நிலையில், உங்கள் பின்தொடர்பவர்களுக்கு வழிகாட்டவும், மொழி விருப்பங்களைப் பொருட்படுத்தாமல் வாய்ப்புகளைப் பெறவும் உதவுகிறோம்.",
    },
    telugu: {
      name: "తెలుగు",
      title: "భాష విజయానికి అడ్డంకి కాదు",
      description:
        "10+ ప్రాంతీయ భాషలలో మద్దతు అందుబాటులో ఉంది, మీ అనుచరులకు మార్గనిర్దేశం చేయడానికి మరియు భాష ప్రాధాన్యతలతో సంబంధం లేకుండా అవకాశాలను పొందడంలో సహాయపడటం సులభతరం చేస్తుంది.",
    },
    bengali: {
      name: "বাংলা",
      title: "ভাষা সাফল্যের অন্তরায় নয়",
      description:
        "১০+ আঞ্চলিক ভাষায় সহায়তা উপলব্ধ থাকায়, আমরা আপনার অনুসারীদের নির্দেশনা দিতে এবং ভাষার পছন্দ নির্বিশেষে সুযোগগুলি সুরক্ষিত করতে সহজ করে তুলেছি।",
    },
    marathi: {
      name: "मराठी",
      title: "यशासाठी भाषा अडथळा नाही",
      description:
        "१०+ प्रादेशिक भाषांमध्ये समर्थन उपलब्ध असल्याने, आम्ही आपल्या अनुयायांना मार्गदर्शन करणे आणि भाषा पसंतीच्या पर्वा न करता संधी सुरक्षित करण्यात मदत करतो.",
    },
    gujarati: {
      name: "ગુજરાતી",
      title: "ભાષા સફળતામાં અવરોધ નથી",
      description:
        "૧૦+ પ્રાદેશિક ભાષાઓમાં સપોર્ટ ઉપલબ્ધ હોવાને કારણે, અમે તમારા અનુયાયીઓને માર્ગદર્શન આપવાનું અને ભાષા પસંદગીઓની પરવા કર્યા વિના તક પ્રદાન કરવાનું સરળ બનાવ્યું છે.",
    },
    kannada: {
      name: "ಕನ್ನಡ",
      title: "ಭಾಷೆ ಯಶಸ್ಸಿಗೆ ಅಡ್ಡಿಯಾಗದು",
      description:
        "10+ ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳ ಬೆಂಬಲ ಲಭ್ಯವಿರುವುದರಿಂದ, ನಿಮ್ಮ ಅನುಯಾಯಿಗಳನ್ನು ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ಮತ್ತು ಭಾಷಾ ಪ್ರಾಧಾನ್ಯತೆಗಳಿಗಿಂತಲೂ ಅನುಕೂಲಕರವಾಗಿ ಅವಕಾಶಗಳನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲು ನಾವು ಸುಲಭ ಮಾಡಿದ್ದೇವೆ.",
    },
    malayalam: {
      name: "മലയാളം",
      title: "ഭാഷ വിജയം തടസ്സപ്പെടുത്തുന്നില്ല",
      description:
        "10+ പ്രാദേശിക ഭാഷകളിൽ പിന്തുണ ലഭ്യമാകുന്നതിനാൽ, നിങ്ങളുടെ അനുയായികൾക്ക് മാർഗനിർദേശം നൽകാനും ഭാഷാ മുൻഗണനകളെ പരിഗണിക്കാതെ അവസരങ്ങൾ ഉറപ്പാക്കാനുമുള്ള വഴി ഞങ്ങൾ എളുപ്പമാക്കിയിരിക്കുന്നു.",
    },
    punjabi: {
      name: "ਪੰਜਾਬੀ",
      title: "ਭਾਸ਼ਾ ਕਾਮਯਾਬੀ ਵਿੱਚ ਰੁਕਾਵਟ ਨਹੀਂ",
      description:
        "10+ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਸਹਾਇਤਾ ਉਪਲਬਧ ਹੋਣ ਕਾਰਨ, ਅਸੀਂ ਤੁਹਾਡੇ ਅਨੁਯਾਇਆਂ ਲਈ ਮਾਰਗਦਰਸ਼ਨ ਦੇਣਾ ਅਤੇ ਭਾਸ਼ਾ ਦੀ ਪਸੰਦ ਬਿਨਾ ਮੌਕੇ ਪ੍ਰਾਪਤ ਕਰਨਾ ਆਸਾਨ ਬਣਾਇਆ ਹੈ।",
    },
    urdu: {
      name: "اردو",
      title: "زبان کامیابی میں رکاوٹ نہیں ہے",
      description:
        "10+ علاقائی زبانوں میں معاونت دستیاب ہونے کے ساتھ، ہم آپ کے پیروکاروں کی رہنمائی کرنا اور زبان کی ترجیحات سے قطع نظر مواقع کو محفوظ بنانا آسان بناتے ہیں۔",
    },
  };

  // Function to handle language selection
  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language);
  };

  // Object to map language names to their keys
  const languageMap = {
    English: "english",
    हिंदी: "hindi",
    தமிழ்: "tamil",
    తెలుగు: "telugu",
    বাংলা: "bengali",
    मराठी: "marathi",
    ગુજરાતી: "gujarati",
    ಕನ್ನಡ: "kannada",
    മലയാളം: "malayalam",
    ਪੰਜਾਬੀ: "punjabi",
    اردو: "urdu",
  };
  const handleAutoSelectLanguage = () => {
    const languageKeys = Object.keys(languageMap);
    const currentIndex = languageKeys.findIndex(
      (key) => languageMap[key] === currentLanguage
    );
    const nextIndex = (currentIndex + 1) % languageKeys.length;
    setCurrentLanguage(languageMap[languageKeys[nextIndex]]);
  };
  return (
    <section
      className="py-16 md:py-24 px-4 md:px-16 lg:px-24 relative"
    >
        {/* Language Support Banner */}
        <div className="mt-12 relative px-4 md:px-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-lg blur opacity-25"></div>
          <div className="relative bg-black/50 backdrop-blur-lg p-6 md:p-8 rounded-lg border border-slate-800 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
                  {languageContent[currentLanguage].title}
                </h3>
                <p className="text-slate-300 mb-4 md:mb-6">
                  {languageContent[currentLanguage].description}
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {[
                    "English",
                    "हिंदी",
                    "தமிழ்",
                    "తెలుగు",
                    "বাংলা",
                    "मराठी",
                    "ગુજરાતી",
                    "ಕನ್ನಡ",
                    "മലയാളം",
                    "ਪੰਜਾਬੀ",
                    "اردو",
                  ].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageSelect(languageMap[lang])}
                      className={`px-3 py-1 rounded-full text-xs md:text-sm transition-all duration-300 ${
                        currentLanguage === languageMap[lang]
                          ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white font-bold"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  <button
                    onClick={handleAutoSelectLanguage}
                    className="relative px-5 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-lg font-bold transition-all duration-300 ease-out transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-lg"></div>
                    <div className="absolute inset-0.5 bg-black rounded-lg"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
                    Multilingual Support
                      <Languages className="w-5 h-5 text-cyan-400" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default LocalStatsSection;