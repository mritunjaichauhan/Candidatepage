import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader, ChevronLeft, X } from "lucide-react";
import InfiniteMarquee from "../InfiniteMarquee/InfiniteMarquee.jsx";
import { ParticleCanvas } from "../Intro/IntroAnimation.jsx";
import { useFormContext } from "../../ContextProvider/FormProvider.jsx";
// import { useTranslation } from "react-i18next";
import hireLogo from "../../assets/hire.png";
import i18n from "i18next";
import RegistrationStep2 from "./step2.jsx";
import RegistrationStep1 from "./step1.jsx";
import { Card, CardContent } from "@/components/ui/card";

const CandidateForm = ({ onFormSubmit }) => {
  // Form state management
  const [currentStep, setCurrentStep] = useState(1);
  const [formLanguage, setFormLanguage] = useState(
    localStorage.getItem("language") || "english"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [status, setStatus] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // const { t, i18n } = useTranslation();
  const { contextFormData, setContextFormData } = useFormContext();
  const [formData, setFormData] = useState({
    languages: [], // Array of languages known
    pan: "", // PAN card number
    pancard: "",
    aadhar: "", // Aadhar number
    aadharcard: "",
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", formLanguage); // 🚀

    // changeLanguage();
  }, [formLanguage]);

  // Confetti effect when showing success modal
  useEffect(() => {
    if (!showSuccessModal) return;

    let container = document.getElementById("confetti-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "confetti-container";
      container.className =
        "fixed inset-0 pointer-events-none z-[1000] overflow-hidden";
      document.body.appendChild(container);
    }

    const createConfetti = () => {
      const shapes = ["circle"];
      const colors = [
        "from-cyan-400 to-violet-500",
        "from-violet-500 to-amber-400",
        "from-amber-400 to-cyan-400",
        "from-pink-400 to-purple-500",
        "from-yellow-400 to-orange-500",
      ];

      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        confetti.className = `absolute w-3 h-3 bg-gradient-to-r ${
          colors[Math.floor(Math.random() * colors.length)]
        } ${shape === "circle" ? "rounded-full" : "rounded-sm"}`;

        // More natural starting position
        const startX = Math.random() * window.innerWidth;
        confetti.style.left = `${startX}px`;
        confetti.style.top = "-20px"; // Start slightly above the viewport

        const scale = 0.3 + Math.random() * 0.3; // Slightly larger for visibility
        const horizontalDrift = -20 + Math.random() * 40; // More drift
        const duration = 4 + Math.random() * 4; // Longer duration
        const delay = Math.random() * 0.5; // More varied delays
        const rotationSpeed = 1 + Math.random() * 3;

        confetti.style.transform = `scale(${scale})`;
        confetti.style.opacity = "1";
        confetti.style.willChange = "transform, opacity, top";
        
        // Apply animations as inline styles for better compatibility
        confetti.animate(
          [
            { transform: `scale(${scale}) rotate(0deg)`, top: "-20px", opacity: 1 },
            { 
              transform: `scale(${scale}) rotate(${360 * rotationSpeed}deg) translateX(${horizontalDrift}px)`, 
              top: `${window.innerHeight + 20}px`, 
              opacity: 0 
            }
          ],
          {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.21, 0.53, 0.29, 0.8)',
            fill: 'forwards'
          }
        );

        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
      }
    };

    createConfetti();
    let burstCount = 0;
    const maxBursts = 3;
    const interval = setInterval(() => {
      burstCount++;
      createConfetti();
      if (burstCount >= maxBursts) {
        clearInterval(interval);
      }
    }, 800);

    return () => {
      clearInterval(interval);
      // Keep container for transition out
      setTimeout(() => {
        if (container) {
          container.remove();
        }
      }, 8000); // Longer timeout to ensure all confetti finishes
    };
  }, [showSuccessModal]);

  // Success modal component
  const SuccessModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowSuccessModal(false)}
      />

      <div className="relative bg-black/80 border border-slate-800 rounded-xl p-6 md:p-8 w-full max-w-md mx-auto shadow-2xl animate-bounce-in">
        <button
          onClick={() => setShowSuccessModal(false)}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <h3 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
          Application Submitted!
        </h3>

        <p className="text-slate-300 text-sm md:text-base mb-6">
          Your application has been successfully submitted. We'll review your details and get back to you soon!
        </p>

        <button
          onClick={() => {
            setShowSuccessModal(false);
            onFormSubmit();
          }}
          className="w-full py-2 md:py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-white font-semibold hover:opacity-90 transition-opacity text-sm md:text-base"
        >
          Great, thanks!
        </button>
      </div>
    </div>
  );

  // Loading Spinner
  const Spinner = () => (
    <div className="animate-spin">
      <Loader className="w-5 h-5 text-cyan-400" />
    </div>
  );

  // Status Message Component
  const StatusMessage = ({ type, message }) => (
    <div
      className={`flex items-center gap-2 p-4 rounded-xl ${
        type === "success"
          ? "bg-emerald-400/10 text-emerald-400"
          : "bg-rose-400/10 text-rose-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
    </div>
  );

  // List of companies to show on sides - creates trust
  const trustedCompanies = [
    "Swiggy",
    "Zomato",
    "BigBasket",
    "Dunzo",
    "Amazon",
    "Uber",
    "Ola",
    "Delhivery",
    "Urban Company",
    "Reliance Retail",
    "DMart",
  ];

  // Handle step transitions
  const handleStepChange = async (nextStep) => {
    setIsLoading(true);
    setIsTransitioning(true);
    setStatus(null);

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCurrentStep(nextStep);
      setStatus({
        type: "success",
        message: `Step ${currentStep} completed`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Please try again",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const isStep3Complete = () =>
    formData.pan && formData.aadhar && formData.education; // 🚀

  // Handle form submission
  const handleSubmit = async () => {
    if (!isStep3Complete()) return;
    setIsLoading(true);
    setStatus(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus({
        type: "success",
        message: "Application submitted successfully!",
      });

      setContextFormData((prev) => ({
        ...prev,
        languages: [...formData.languages],
        pan: formData.pan,
        aadhar: formData.aadhar,
        aadharcard: formData.aadharcard,
        pancard: formData.pancard,
      }));

      // Show the success modal with confetti instead of immediately calling onFormSubmit
      setShowSuccessModal(true);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to submit. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    console.log( "contextFormData",contextFormData);
    
  }, [contextFormData])
  

  // Action Button Component
  const ActionButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex-1 w-full group relative px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 ${
        isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400"></div>
      <div className="absolute inset-0.5 bg-black rounded-xl"></div>
      <span className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
        {isLoading ? <Spinner /> : children}
      </span>
    </button>
  );

  // Multi-language support - Add more languages as needed
  const translations = {
    english: {
      title: "Find Local Job Opportunities",
      subtitle:
        "Connect with businesses in your area - from full-time roles to flexible gig work",
      description:
        "Join thousands of people who found jobs near their homes. No complex requirements, start working within 48 hours.",
    },
    hindi: {
      title: "स्थानीय नौकरी के अवसर खोजें",
      subtitle:
        "अपने क्षेत्र के व्यवसायों से जुड़ें - पूर्णकालिक से लचीले काम तक",
      description:
        "हजारों लोगों से जुड़ें जिन्होंने अपने घर के पास नौकरी पाई। कोई जटिल आवश्यकताएं नहीं, 48 घंटों के भीतर काम शुरू करें।",
    },
  };

  //   // Work Types and Job Categories Data
  const jobTypes = [
    { id: "delivery", label: "Delivery Partner", icon: "🛵" },
    { id: "driver", label: "Driver", icon: "🚗" },
    { id: "retail", label: "Retail Staff", icon: "🏪" },
    { id: "warehouse", label: "Warehouse", icon: "📦" },
    { id: "security", label: "Security", icon: "💂" },
    { id: "housekeeping", label: "Housekeeping", icon: "🧹" },
  ];

  const workTypes = [
    { id: "full", label: "Full Time" },
    { id: "part", label: "Part Time (6 days)" },
    { id: "weekend", label: "Weekends Only" },
  ];

  const changeLanguage = (lang) => {
    if (i18n && typeof i18n.changeLanguage === "function") {
      i18n
        .changeLanguage(lang)
        .then(() => {
          console.log("Language changed to:", lang);
        })
        .catch((err) => {
          console.error("Error changing language:", err);
        });
    } else {
      console.error("i18n.changeLanguage is not available.");
    }
  };

  // Progress Steps
  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex-1">
          <div
            className={`h-1 ${
              currentStep >= step ? "bg-cyan-400" : "bg-slate-700"
            }`}
          />
          <div className="mt-2 text-center text-sm">
            <span
              className={
                currentStep >= step ? "text-cyan-400" : "text-slate-500"
              }
            >
              Step {step}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  //   // Step 1: Basic Information
  const renderBasicInfo = () => (
    <RegistrationStep1 onNextStep={handleStepChange} />
  );

  // Step 2: Work Preferences
  const renderWorkPreferences = () => (
    <RegistrationStep2
      onNextStep={handleStepChange}
      onPreviousStep={handleStepChange}
    />
  );

  // Step 3: Document Verification
  const renderDocumentVerification = () => (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur">
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-slate-400 mb-2">
              PAN Card <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter PAN Number"
              value={formData.pan}
              maxLength={10}
              onChange={(e) => {
                const panValue = e.target.value.toUpperCase();
                if (/^[A-Z0-9]{0,10}$/.test(panValue)) {
                  setFormData({ ...formData, pan: panValue });
                }
              }}
              className="w-full p-4 bg-black/50 border border-slate-800 rounded-xl focus:border-cyan-400 transition-all"
            />
            {formData.pan.length > 0 && formData.pan.length !== 10 && (
              <p className="text-red-500 mt-1 text-sm">
                PAN must be exactly 10 characters
              </p>
            )}
          </div>

          {/* upload pancard */}
          <div className="flex flex-col gap-3">
            <p className=" text-slate-400">{"Attach your pancard here"}</p>

            <input
              type="file"
              id="pancardUpload"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, pancard: file });
              }}
              className="hidden"
            />
            {/* Styled Label as Button */}
            <label
              htmlFor="pancardUpload"
              className="px-4 py-2 w-fit rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer inline-block"
            >
              {"Upload PAN"}
            </label>

            {/* Show File Name if Selected */}
            {formData.pancard && (
              <p className="text-slate-400 text-sm">
                Selected File:{" "}
                <span className="text-cyan-400">{formData.pancard.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 mb-2">
              Aadhar Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Aadhar Number"
              value={formData.aadhar}
              maxLength={12}
              onChange={(e) => {
                const aadharValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                if (/^\d{0,12}$/.test(aadharValue)) {
                  setFormData({ ...formData, aadhar: aadharValue });
                }
              }}
              className="w-full p-4 bg-black/50 border border-slate-800 rounded-xl focus:border-cyan-400 transition-all"
            />
            {formData.aadhar.length > 0 && formData.aadhar.length !== 12 && (
              <p className="text-red-500 mt-1 text-sm">
                Aadhar must be exactly 12 digits
              </p>
            )}
          </div>

          {/* upload aadhar */}
          <div className="flex flex-col gap-2">
            <p className=" text-slate-400">
              {"Attach your resume here"}
              <span className=" text-cyan-400">*</span>
            </p>

            <input
              type="file"
              id="aadharUpload"
              accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, aadharcard: file });
              }}
              className="hidden"
            />
            {/* Styled Label as Button */}
            <label
              htmlFor="aadharUpload"
              className="px-4 py-2 w-fit rounded-lg border border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors cursor-pointer inline-block"
            >
              {"Upload Aadhar"}
            </label>

            {/* Show File Name if Selected */}
            {formData.aadharcard && (
              <p className="text-slate-400 text-sm">
                Selected File:{" "}
                <span className="text-cyan-400">{formData.aadharcard.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 mb-2">
              Education <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
              className="w-full p-4 bg-black/50 border border-slate-800 rounded-xl focus:border-cyan-400 transition-all"
            >
              <option value="">Select Education Level</option>
              <option value="10th">10th Pass</option>
              <option value="12th">12th Pass</option>
              <option value="graduate">Graduate</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeTerms: e.target.checked })
              }
              className="mr-2 accent-cyan-400"
              required
            />
            <label htmlFor="agreeTerms" className="text-sm text-slate-300">
              I have read and understood the{" "}
              <a
                href="https://drive.google.com/file/d/1hGVi94dwjJ9C7mFgvBHk5b2IlYVT4NW7/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://drive.google.com/file/d/1hGVi94dwjJ9C7mFgvBHk5b2IlYVT4NW7/view?usp=drive_link",
                    "_blank"
                  );
                }}
              >
                Terms & Conditions
              </a>{" "}
              and the{" "}
              <a
                href="https://drive.google.com/file/d/18kcW2hdO-gd8KZ2HXnD3KBIFrCiWh9Z_/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "https://drive.google.com/file/d/18kcW2hdO-gd8KZ2HXnD3KBIFrCiWh9Z_/view?usp=drive_link",
                    "_blank"
                  );
                }}
              >
                Privacy Policy
              </a>
            </label>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={() => handleStepChange(2)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-slate-800 text-slate-400 hover:border-cyan-400 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <ActionButton onClick={handleSubmit}>
            Submit Application <CheckCircle className="w-5 h-5 text-cyan-400" />
          </ActionButton>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="min-w-full bg-black">
        <ParticleCanvas />
        {/* Left Side Marquee - Ensures even spacing */}
        <div className="max-sm:hidden">
          <InfiniteMarquee />
        </div>

        {/* Right Side Marquee */}
        <div className="max-sm:hidden">
          <InfiniteMarquee right={true} />
        </div>

        <div className="min-h-screen  text-slate-50 w-full lg:w-[70%] m-auto">
          {/* Floating company lists on sides - Only visible on large screens */}

          {/* Main Content Container */}
          <div className="w-fit mx-auto relative px-6 lg:px-24 py-12 ">
            {/* Hirecentive Logo */}
            <div className="absolute top-10 left-8 z-50 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-black rounded-full border border-slate-800 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <img
                    alt="Hirecentive Logo"
                    className="w-full h-full object-cover"
                    src={hireLogo}
                  />
                </div>
              </div>
            </div>

            {/* Language Selector - Glassmorphic dropdown */}
            <div className="flex justify-end mb-8">
              <select
                value={formLanguage}
                // onChange={(e) => setFormLanguage(e.target.value)}
                onChange={(e) => setFormLanguage(e.target.value)}
                className="bg-black/50 border border-slate-800 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="de">DE</option>
              </select>
            </div>
            {/* Header Section with Gradient Text */}
            <div className="text-center mb-12 mt-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 p-2 text-transparent bg-clip-text">
                {translations[formLanguage].title}
              </h1>
              <p className="text-xl text-slate-300 mb-4">
                {translations[formLanguage].subtitle}
              </p>
              <p className="text-slate-400">
                {translations[formLanguage].description}
              </p>
            </div>

            {/* Main Form Container - Glassmorphic card with gradient border */}
            <div className="group relative">
              {/* Gradient border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25"></div>
              {/* Form content */}
              <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-slate-800">
                {renderStepIndicator()}
                {currentStep === 1 && renderBasicInfo()}
                {currentStep === 2 && renderWorkPreferences()}
                {currentStep === 3 && renderDocumentVerification()}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Show success modal if active */}
      {showSuccessModal && <SuccessModal />}
      
      {/* Add the required animations - simplified as we're using Web Animations API instead */}
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          70% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.38, 0.1, 0.36, 1.47) forwards;
        }
      `}</style>
    </>
  );
};

export default CandidateForm;
