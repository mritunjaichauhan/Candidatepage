import { useState, useEffect } from "react";
import { fetchJobs, fetchCandidates, submitCandidate } from "../lib/api-service";

const DatabaseTest = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testSubmissionResult, setTestSubmissionResult] = useState(null);
  
  // Step 1 test form fields
  const [testForm, setTestForm] = useState({
    fullName: "Test User Full Name",
    phoneNumber: "1234567890",
    email: "",
    primaryCity: "Mumbai",
    pincode: "400001",
    workRadius: "10",
    openToRelocate: false
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch jobs from SQLite database (still need this for the test submission)
        const jobsData = await fetchJobs();
        setJobs(jobsData);
        
        // Optionally fetch candidates (requires admin access)
        const candidatesData = await fetchCandidates();
        setCandidates(candidatesData);
      } catch (err) {
        setError(err.message || "Failed to fetch data from database");
        console.error("Database test error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Update test form field
  const updateTestForm = (field, value) => {
    setTestForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestSubmission = async () => {
    // First generate a unique email for this test
    const uniqueEmail = `test${Date.now()}@example.com`;
    updateTestForm('email', uniqueEmail);
    
    setIsLoading(true);
    setError(null);
    setTestSubmissionResult(null);
    
    try {
      // Create a more comprehensive test candidate with fields from all steps
      const testCandidate = {
        // Required fields
        name: testForm.fullName,
        email: uniqueEmail,
        phone: testForm.phoneNumber,
        job_id: jobs.length > 0 ? jobs[0].id : 1,
        resume_path: "test-resume.pdf",
        
        // Step 1 fields
        full_name: testForm.fullName,
        phone_number: testForm.phoneNumber,
        phone_verified: true,
        email_verified: true,
        primary_city: testForm.primaryCity,
        additional_cities: ["Delhi", "Bangalore"],
        work_radius: testForm.workRadius,
        pincode: testForm.pincode,
        open_to_relocate: testForm.openToRelocate,
        
        // Additional fields from other steps
        age: "28",
        work_schedule: "fulltime_weekday,parttime_weekend",
        education: "graduate",
        in_field_experience: "3",
        experience: "5",
        open_to_gig: true,
        open_to_full_time: true,
        aadhar: "123456789012",
        agree_terms: true,
        
        // Additional info as JSON
        additional_info: JSON.stringify({
          roles: ["Shop Assistant", "Security Guard"],
          languages: ["English", "Hindi"],
          jobCategories: ["retail", "security"]
        })
      };
      
      // Use the API service instead of direct fetch
      const response = await submitCandidate(testCandidate);
      
      setTestSubmissionResult({
        success: true,
        message: "Test submission successful!",
        candidateId: response.candidateId
      });
      
      // Refresh candidate list
      const candidatesData = await fetchCandidates();
      setCandidates(candidatesData);
    } catch (err) {
      setTestSubmissionResult({
        success: false,
        message: err.message || "Test submission failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 bg-slate-900 text-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 text-transparent bg-clip-text">
        SQLite Database Integration Test
      </h1>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-6 text-red-400">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {/* Test Form Section */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Test Form</h2>
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              value={testForm.fullName}
              onChange={(e) => updateTestForm('fullName', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
            />
          </div>
          
          {/* Phone Field */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Phone Number</label>
            <input
              type="tel"
              value={testForm.phoneNumber}
              onChange={(e) => updateTestForm('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
            />
          </div>
          
          {/* City Field */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Primary City</label>
            <input
              type="text"
              value={testForm.primaryCity}
              onChange={(e) => updateTestForm('primaryCity', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
            />
          </div>
          
          {/* Pincode Field */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Pincode</label>
            <input
              type="text"
              value={testForm.pincode}
              onChange={(e) => updateTestForm('pincode', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
            />
          </div>
          
          {/* Work Radius Field */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Work Radius (km)</label>
            <select
              value={testForm.workRadius}
              onChange={(e) => updateTestForm('workRadius', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-400 transition-colors text-slate-50"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="15">15 km</option>
              <option value="20">20 km</option>
              <option value="25">25 km</option>
            </select>
          </div>
          
          {/* Open to Relocate */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="openToRelocate"
              checked={testForm.openToRelocate}
              onChange={(e) => updateTestForm('openToRelocate', e.target.checked)}
              className="mr-2 accent-cyan-400"
            />
            <label htmlFor="openToRelocate" className="text-slate-300">
              Open to relocating for work
            </label>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleTestSubmission}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit Test Form"}
          </button>
        </div>
      </div>
      
      {/* Test Submission Result */}
      {testSubmissionResult && (
        <div className={`mb-6 p-4 rounded-lg border ${
          testSubmissionResult.success 
            ? "bg-emerald-900/30 border-emerald-500 text-emerald-400" 
            : "bg-red-900/30 border-red-500 text-red-400"
        }`}>
          <p>{testSubmissionResult.message}</p>
          {testSubmissionResult.candidateId && (
            <p className="mt-1 text-sm">Candidate ID: {testSubmissionResult.candidateId}</p>
          )}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-t-cyan-400 border-r-transparent border-b-violet-500 border-l-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Candidates Section */}
          {candidates.length > 0 && (
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">Recent Candidates</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left p-2">ID</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">Job</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">Experience</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map(candidate => (
                      <tr key={candidate.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                        <td className="p-2">{candidate.id}</td>
                        <td className="p-2">{candidate.name}</td>
                        <td className="p-2">{candidate.email}</td>
                        <td className="p-2">{candidate.phone}</td>
                        <td className="p-2">{candidate.job_title || 'N/A'}</td>
                        <td className="p-2">{candidate.primary_city || 'N/A'}</td>
                        <td className="p-2">{candidate.in_field_experience || 'N/A'} years</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-900/50 text-amber-400 border border-amber-800">
                            {candidate.status || 'new'}
                          </span>
                        </td>
                        <td className="p-2">
                          <button 
                            className="px-2 py-1 rounded text-xs bg-violet-900/50 text-violet-400 border border-violet-800 hover:bg-violet-800/50"
                            onClick={() => alert(JSON.stringify(candidate, null, 2))}
                          >
                            View All
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;