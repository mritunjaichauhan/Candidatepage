import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { MapPin, Plus, Edit, Star, Trash2 } from "lucide-react"

export default function LocationPage() {
  // This would come from your database in a real application
  const locations = [
    {
      id: 1,
      city: "Mumbai",
      workRadius: "Within 5 KM",
      isPrimary: true,
    },
    {
      id: 2,
      city: "Pune",
      workRadius: "Within 10 KM",
      isPrimary: false,
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="gradient-heading text-3xl font-bold tracking-tight mb-2">Location Preferences</h1>
            <p className="text-slate-400">Manage your work location preferences.</p>
          </div>
          <Button className="gradient-btn">
            <div className="gradient-btn-bg"></div>
            <span className="gradient-btn-content">
              <Plus className="h-4 w-4 text-cyan-400" />
              <span className="gradient-btn-text">Add Location</span>
            </span>
          </Button>
        </div>
        <div className="grid gap-6">
          {locations.map((location) => (
            <div key={location.id} className="max-w-3xl relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 rounded-2xl blur opacity-25"></div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center border border-slate-700/50">
                      <MapPin className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{location.city}</h3>
                      <p className="text-slate-400">{location.workRadius}</p>
                    </div>
                  </div>
                  {location.isPrimary && (
                    <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-violet-500/20 px-3 py-1 text-xs font-medium text-cyan-400 border border-cyan-400/30">
                      <Star className="h-3 w-3" />
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  {!location.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-black/60 hover:bg-slate-800/50 text-slate-300"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Set as Primary
                    </Button>
                  )}
                  {!location.isPrimary && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-900/30 bg-black/60 hover:bg-red-950/30 text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

