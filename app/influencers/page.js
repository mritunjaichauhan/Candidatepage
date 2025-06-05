'use client'

import InfluencerList from "@/components/InfluencerList"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function InfluencersPage() {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <InfluencerList />
    </FormProvider>
  )
} 