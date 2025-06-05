import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Trash2 } from "lucide-react"

export default function DocumentsPage() {
  // This would come from your database in a real application
  const documents = [
    {
      id: 1,
      name: "Resume.pdf",
      type: "PDF",
      size: "1.2 MB",
      uploadedDate: "2023-10-15",
    },
    {
      id: 2,
      name: "Cover Letter.docx",
      type: "DOCX",
      size: "0.8 MB",
      uploadedDate: "2023-10-10",
    },
    {
      id: 3,
      name: "Portfolio.pdf",
      type: "PDF",
      size: "3.5 MB",
      uploadedDate: "2023-10-05",
    },
  ]

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">Manage your resumes, cover letters, and other documents.</p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{document.name}</CardTitle>
                    <CardDescription>
                      {document.type} • {document.size}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Uploaded on {new Date(document.uploadedDate).toLocaleDateString()}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}

