import { useState } from 'react';
import { LogOut,AlertCircle, X } from 'lucide-react';
import { ParticleCanvas } from '../components/Intro/IntroAnimation';
import { useFormContext } from '../ContextProvider/FormProvider';

const ProfileDashboard = () => {
  const [showStopModal, setShowStopModal] = useState(false);
  const [isJobSearchActive, setIsJobSearchActive] = useState(true);
  
  const {contextFormData, setContextFormData} = useFormContext();


  // Work types and job categories - matching registration form
  const workTypes = [
    { id: 'full', label: 'Full Time' },
    { id: 'part', label: 'Part Time (6 days)' },
    { id: 'weekend', label: 'Weekends Only' }
  ];

  const jobTypes = [
    { id: 'delivery', label: 'Delivery Partner', icon: '🛵' },
    { id: 'driver', label: 'Driver', icon: '🚗' },
    { id: 'retail', label: 'Retail Staff', icon: '🏪' },
    { id: 'warehouse', label: 'Warehouse', icon: '📦' },
    { id: 'security', label: 'Security', icon: '💂' },
    { id: 'housekeeping', label: 'Housekeeping', icon: '🧹' }
  ];

  // Status Toggle UI
  const StatusToggle = () => (
    <div className="relative mb-8">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25"></div>
      <div className="relative p-6 bg-black/40 backdrop-blur-xl rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Job Search Status</h2>
            <p className="text-slate-400">
              {isJobSearchActive ? 'Actively looking for jobs' : 'Not looking for jobs'}
            </p>
          </div>
          <button
            onClick={() => isJobSearchActive ? setShowStopModal(true) : setIsJobSearchActive(true)}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              isJobSearchActive 
                ? 'bg-cyan-400 text-black hover:bg-cyan-500' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {isJobSearchActive ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Form UI
  const EditableForm = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={contextFormData.fullName}
          onChange={(e) => 
          setContextFormData((prev) => ({ ...prev, fullName: e.target.value }))
        }
          className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:border-cyan-400 transition-colors text-slate-50"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="tel"
            placeholder="Phone Number"
            value={contextFormData.phoneNumber}
            onChange={(e) => 
            setContextFormData((prev) => ({ ...prev, phoneNumber: e.target.value })) 
          }
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:border-cyan-400 transition-colors text-slate-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={contextFormData.email}
            onChange={(e) => 
            setContextFormData((prev) => ({ ...prev, email: e.target.value })) 
          }
            className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:border-cyan-400 transition-colors text-slate-50"
          />
        </div>
      </div>

      {/* Work Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Work Preferences</h3>
        <div className="grid grid-cols-3 gap-4">
          {workTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setContextFormData((prev) => ({...prev, workType: type.id}))}
              className={`p-4 rounded-xl border ${
                contextFormData.workType === type.id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-slate-800 text-slate-400'
              } hover:border-cyan-400 transition-all`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Job Types</h3>
        <div className="grid grid-cols-2 gap-4">
          {jobTypes.map(job => (
            <button
              key={job.id}
              onClick={() =>
              setContextFormData((prev) => {
                const updatedJobs = prev.jobTypes.includes(job.id)
                  ? prev.jobTypes.filter((j) => j !== job.id)
                  : [...prev.jobTypes, job.id];
                return { ...prev, jobTypes: updatedJobs };
              })
            }
              // className={`p-4 rounded-xl border ${
              //   contextFormData.jobTypes.includes(job.id)
              //     ? 'border-cyan-400 text-cyan-400'
              //     : 'border-slate-800 text-slate-400'
              // } hover:border-cyan-400 transition-all flex items-center gap-2`}
            >
              <span>{job.icon}</span>
              {job.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-slate-50">

        <ParticleCanvas />
        
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 text-transparent bg-clip-text">
            My Profile
          </h1>
          <LogOut className="w-5 h-5 text-slate-400 hover:text-slate-200 cursor-pointer" />
        </div>

        {/* Status Toggle */}
        <StatusToggle />

        {/* Profile Form */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-xl blur opacity-25"></div>
          <div className="relative p-6 bg-black/40 backdrop-blur-xl rounded-xl border border-slate-800">
            <EditableForm />
          </div>
        </div>
      </div>

      {/* Stop Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative bg-black/90 p-8 rounded-xl border border-slate-800 max-w-md w-full mx-4">
            <button 
              onClick={() => setShowStopModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-center">Stop Job Search?</h3>
            <p className="text-slate-400 text-center mb-6">
              Please let us know why you're stopping your job search
            </p>

            <select
              value={contextFormData.stopReason}
              onChange={(e) => setContextFormData({...contextFormData, stopReason: e.target.value})}
              className="w-full p-4 bg-black/50 border border-slate-800 rounded-xl mb-6 focus:border-cyan-400"
            >
              <option value="">Select Reason</option>
              <option value="found_job">Found a Job</option>
              <option value="break">Taking a Break</option>
              <option value="location">Changed Location</option>
              <option value="other">Other Reason</option>
            </select>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowStopModal(false)}
                className="flex-1 p-4 rounded-xl border border-slate-800 text-slate-400 hover:border-slate-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setIsJobSearchActive(false);
                  setShowStopModal(false);
                }}
                className="flex-1 p-4 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                disabled={!contextFormData.stopReason}
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDashboard;
