'use client'

import CandidateForm from "@/components/3StepForm/CandidateForm"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function CandidateFormPage({ params }) {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <CandidateForm influencerCode={params.influencerCode} />
    </FormProvider>
  )
} 