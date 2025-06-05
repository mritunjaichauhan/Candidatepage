'use client'

import CreateInfluencer from "@/components/CreateInfluencer"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function CreateInfluencerPage() {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <CreateInfluencer />
    </FormProvider>
  )
} 