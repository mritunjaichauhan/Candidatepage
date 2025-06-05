'use client'

import ProfileDashboard from "@/src/pages/ProfileDashboard"
import { FormProvider } from "@/components/ContextProvider/FormProvider"
import GoogleTranslate from "@/components/GoogleTranslate/GoogleTranslate"

export default function ProfileDashboardPage() {
  return (
    <FormProvider>
      <div style={{ position: 'absolute', top: '12px', right: '16px', zIndex: 1000 }}>
        <GoogleTranslate />
      </div>
      <ProfileDashboard />
    </FormProvider>
  )
} 