import { getContactSubmissions, updateContactStatus } from "@/app/actions/contact"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, Building, MessageSquare } from "lucide-react"

export default async function AdminContactsPage() {
  const submissions = await getContactSubmissions()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-600/20 text-blue-400"
      case "IN_PROGRESS":
        return "bg-yellow-600/20 text-yellow-400"
      case "RESOLVED":
        return "bg-green-600/20 text-green-400"
      default:
        return "bg-gray-600/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Submissions</h1>
        <p className="text-gray-400">Manage customer inquiries and messages.</p>
      </div>

      {submissions.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No contact submissions yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-white">{submission.name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{submission.email}</span>
                        </div>
                        {submission.company && (
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{submission.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(submission.status)}>{submission.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 whitespace-pre-wrap">{submission.message}</p>
                </div>

                <div className="flex gap-2">
                  {submission.status === "NEW" && (
                    <form action={updateContactStatus.bind(null, submission.id, "IN_PROGRESS")}>
                      <Button type="submit" size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Mark In Progress
                      </Button>
                    </form>
                  )}

                  {submission.status !== "RESOLVED" && (
                    <form action={updateContactStatus.bind(null, submission.id, "RESOLVED")}>
                      <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                        Mark Resolved
                      </Button>
                    </form>
                  )}

                  <Button asChild size="sm" variant="outline">
                    <a href={`mailto:${submission.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Reply
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
