import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ApplicationsPage() {
  // This would come from your database in a real application
  const applications = [
    {
      id: 1,
      position: "Frontend Developer",
      company: "Tech Solutions Inc.",
      appliedDate: "2023-10-15",
      status: "In Review",
    },
    {
      id: 2,
      position: "UX Designer",
      company: "Creative Designs Co.",
      appliedDate: "2023-10-10",
      status: "Interview Scheduled",
    },
    {
      id: 3,
      position: "Full Stack Developer",
      company: "Web Innovations",
      appliedDate: "2023-10-05",
      status: "Applied",
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground">Track the status of your job applications.</p>
        </div>
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{application.position}</CardTitle>
                    <CardDescription>{application.company}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      application.status === "Applied"
                        ? "outline"
                        : application.status === "In Review"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Applied on {new Date(application.appliedDate).toLocaleDateString()}
                </div>
                <div className="mt-4 flex gap-2">
                  <Badge variant="outline">View Details</Badge>
                  <Badge variant="outline">Update Status</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

