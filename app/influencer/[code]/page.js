'use client'

import InfluencerDetails from "@/components/InfluencerDetails"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function InfluencerDetailsPage({ params }) {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <InfluencerDetails params={params} />
    </FormProvider>
  )
} 