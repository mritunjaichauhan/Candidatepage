'use client'

import DatabaseTest from "@/components/DatabaseTest"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function DatabaseTestPage() {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <DatabaseTest />
    </FormProvider>
  )
} 