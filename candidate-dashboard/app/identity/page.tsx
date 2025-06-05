import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Check, AlertCircle } from "lucide-react"

export default function IdentityPage() {
  // This would come from your database in a real application
  const documents = [
    {
      id: 1,
      name: "PAN Card",
      number: "ABCDE1234F",
      status: "verified",
      uploadedDate: "2023-10-15",
    },
    {
      id: 2,
      name: "Aadhar Card",
      number: "1234 5678 9012",
      status: "pending",
      uploadedDate: "2023-10-10",
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h1 className="gradient-heading text-3xl font-bold tracking-tight mb-2">Identity Documents</h1>
          <p className="text-slate-400">Manage your identity verification documents.</p>
        </div>
        <div className="grid gap-6">
          {documents.map((document) => (
            <div key={document.id} className="max-w-3xl relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-2xl blur opacity-25"></div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center border border-slate-700/50">
                      <FileText className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{document.name}</h3>
                      <p className="text-slate-400">{document.number}</p>
                    </div>
                  </div>
                  <div>
                    {document.status === "verified" ? (
                      <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-400/30">
                        <Check className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 px-3 py-1 text-xs font-medium text-amber-400 border border-amber-400/30">
                        <AlertCircle className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  Uploaded on {new Date(document.uploadedDate).toLocaleDateString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Update Document
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

