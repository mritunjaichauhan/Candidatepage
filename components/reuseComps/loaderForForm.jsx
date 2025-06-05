import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Loader } from 'lucide-react';

const WithLoadersForm = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phoneVerify: '',
    email: '',
    city: '',
    workArea: '5',
    workType: '',
    jobTypes: [],
    languages: [],
    education: '',
    pan: '',
    aadhar: '',
    hasVehicle: false,
    licenseTypes: []
  });

  // Loading Spinner
  const Spinner = () => (
    <div className="animate-spin">
      <Loader className="w-5 h-5 text-cyan-400" />
    </div>
  );

  // Status Message Component
  const StatusMessage = ({ type, message }) => (
    <div className={`flex items-center gap-2 p-4 rounded-xl ${
      type === 'success' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <span>{message}</span>
    </div>
  );

  // Handle step transitions
  const handleStepChange = async (nextStep) => {
    setIsLoading(true);
    setIsTransitioning(true);
    setStatus(null);

    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep(nextStep);
      setStatus({
        type: 'success',
        message: `Step ${currentStep} completed`
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Please try again'
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    setStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({
        type: 'success',
        message: 'Application submitted successfully!'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to submit. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Action Button Component
  const ActionButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`w-full group relative px-8 py-4 rounded-xl text-xl font-bold transition-all duration-300 ${
        isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400"></div>
      <div className="absolute inset-0.5 bg-black rounded-xl"></div>
      <span className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
        {isLoading ? <Spinner /> : children}
      </span>
    </button>
  );

  // Progress Steps
  const renderSteps = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex-1">
          <div className={`h-1 transition-colors duration-300 ${
            currentStep >= step 
              ? 'bg-gradient-to-r from-cyan-400 to-violet-500' 
              : 'bg-slate-700'
          }`} />
          <div className="mt-2 text-center text-sm">
            <span className={`transition-colors duration-300 ${
              currentStep >= step ? 'text-cyan-400' : 'text-slate-500'
            }`}>
              Step {step}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25"></div>
          <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-slate-800">
            {renderSteps()}
            
            <div className={`transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
              {/* Status Messages */}
              {status && (
                <div className="mb-6">
                  <StatusMessage type={status.type} message={status.message} />
                </div>
              )}

              {/* Form Steps */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50 placeholder-slate-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <ActionButton onClick={() => handleStepChange(2)}>
                    Continue <ChevronRight className="w-5 h-5 text-cyan-400" />
                  </ActionButton>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStepChange(1)}
                      disabled={isLoading}
                      className="flex-1 p-4 rounded-xl border border-slate-800 text-slate-400 hover:border-cyan-400 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <ActionButton onClick={() => handleStepChange(3)}>
                      Continue <ChevronRight className="w-5 h-5 text-cyan-400" />
                    </ActionButton>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleStepChange(2)}
                      disabled={isLoading}
                      className="flex-1 p-4 rounded-xl border border-slate-800 text-slate-400 hover:border-cyan-400 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <ActionButton onClick={handleSubmit}>
                      Submit Application <CheckCircle className="w-5 h-5 text-cyan-400" />
                    </ActionButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithLoadersForm;