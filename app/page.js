'use client'

import { useState } from "react";
import CandidateForm from "@/components/3StepForm/CandidateForm";
import IntroAnimation from "@/components/Intro/IntroAnimation";
import SuccessScreen from "@/components/SuccessScreen/SuccessScreen";
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate";
import { FormProvider } from "@/components/ContextProvider/FormProvider";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      {!showForm && !formSubmitted ? (
        <IntroAnimation onComplete={() => setShowForm(true)} />
      ) : !formSubmitted ? (
        <CandidateForm onFormSubmit={() => setFormSubmitted(true)} />
      ) : (
        <SuccessScreen />
      )}
    </FormProvider>
  );
} 