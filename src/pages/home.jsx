import { useState } from "react";
import CandidateForm from "../components/3StepForm/CandidateForm";
import IntroAnimation from "../components/Intro/IntroAnimation";
import SuccessScreen from "../components/SuccessScreen/SuccessScreen";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <>
      {!showForm && !formSubmitted ? (
        <IntroAnimation onComplete={() => setShowForm(true)} />
      ) : !formSubmitted ? (
        <CandidateForm onFormSubmit={() => setFormSubmitted(true)} />
      ) : (
        <SuccessScreen />
      )}
    </>
  );
};

export default Home;
