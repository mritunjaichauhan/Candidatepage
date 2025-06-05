import { DashboardShell } from "@/components/dashboard-shell"
import { CandidateForm } from "@/components/candidate-form"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="gradient-heading text-3xl font-bold tracking-tight mb-2">Personal Information</h1>
          <p className="text-slate-400">View and update your candidate information.</p>
        </div>
        <CandidateForm />
      </div>
    </DashboardShell>
  )
}

