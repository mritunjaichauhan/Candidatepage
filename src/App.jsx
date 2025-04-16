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
