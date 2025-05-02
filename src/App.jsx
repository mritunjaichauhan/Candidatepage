import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import GoogleTranslate from "./components/GoogleTranslate/GoogleTranslate";
import Home from "./pages/home.jsx";
import { FormProvider } from "./ContextProvider/FormProvider.jsx";
import ProfileDashboard from "./pages/ProfileDashboard.jsx";
import './i18n.js';
import JobSelectionForm from "./components/3StepForm/JobSelection";
import CandidateForm from "./components/3StepForm/CandidateForm";
import DatabaseTest from "./components/DatabaseTest"; // Import the database test component
import CreateInfluencer from "./components/CreateInfluencer";
import InfluencerList from "./components/InfluencerList"; // Import the InfluencerList component
import InfluencerDetails from "./components/InfluencerDetails"; // Import the InfluencerDetails component

// Function to clear all browser storage
const clearBrowserCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
  
  // If available, clear cache API
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Reload the page to ensure everything is fresh
  window.location.reload();
};

function App() {

  return (
    <FormProvider>
      <BrowserRouter>
        <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
          <GoogleTranslate />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiledashboard" element={<ProfileDashboard />} />
          <Route path="/create-influencer" element={<CreateInfluencer />} />
          <Route path="/influencers" element={<InfluencerList />} />
          <Route path="/influencer/:code" element={<InfluencerDetails />} />
          <Route path="/:influencerCode" element={<CandidateForm />} />
          {/* Just some for testing */}
          <Route path="/cand" element={<CandidateForm />} />
          {/* Route for database testing */}
          <Route path="/db-test" element={<DatabaseTest />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;
