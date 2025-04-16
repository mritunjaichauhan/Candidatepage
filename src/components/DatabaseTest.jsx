import { useState, useEffect } from "react";
import { fetchJobs, fetchCandidates } from "../lib/api-service";

const DatabaseTest = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testSubmissionResult, setTestSubmissionResult] = useState(null);

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

  const handleTestSubmission = async () => {
    setIsLoading(true);
    setError(null);
    setTestSubmissionResult(null);
    
    try {
      // Create a test candidate
      const testCandidate = {
        name: "Test User",
        email: `test${Date.now()}@example.com`, // Unique email each time
        phone: "1234567890",
        job_id: jobs.length > 0 ? jobs[0].id : null,
        resume_path: "test-resume.pdf"
      };
      
      const response = await fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCandidate),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit test candidate");
      }
      
      const result = await response.json();
      setTestSubmissionResult({
        success: true,
        message: "Test submission successful!",
        candidateId: result.candidateId
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-4 border-t-cyan-400 border-r-transparent border-b-violet-500 border-l-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Test Submission Section */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Test Candidate Submission</h2>
            <button
              onClick={handleTestSubmission}
              disabled={isLoading || jobs.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Submitting..." : "Submit Test Candidate"}
            </button>
            
            {testSubmissionResult && (
              <div className={`mt-4 p-4 rounded-lg border ${
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
          </div>
          
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
                      <th className="text-left p-2">Job</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map(candidate => (
                      <tr key={candidate.id} className="border-b border-slate-800 hover:bg-slate-700/30">
                        <td className="p-2">{candidate.id}</td>
                        <td className="p-2">{candidate.name}</td>
                        <td className="p-2">{candidate.email}</td>
                        <td className="p-2">{candidate.job_title || 'N/A'}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-amber-900/50 text-amber-400 border border-amber-800">
                            {candidate.status || 'new'}
                          </span>
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