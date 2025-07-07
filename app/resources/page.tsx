import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import Link from "next/link"
import { getPublishedResources } from "@/app/actions/resources"

// Mock data as fallback
const mockResources = [
  {
    id: "1",
    slug: "customer-onboarding-flow",
    title: "Customer Onboarding Flow",
    description: "Complete welcome series with progress tracking and automated follow-ups",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "MAKE_TEMPLATES",
    downloadsCount: 156,
    createdAt: new Date("2024-01-15"),
    author: { firstName: "John", lastName: "Doe" },
  },
  {
    id: "2",
    slug: "social-media-scheduler",
    title: "Social Media Scheduler",
    description: "Multi-platform content automation with analytics tracking",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "ZAPIER_TEMPLATES",
    downloadsCount: 89,
    createdAt: new Date("2024-01-10"),
    author: { firstName: "Jane", lastName: "Smith" },
  },
]

export default async function ResourcesPage() {
  // Try to fetch real data, fallback to mock data
  let resources = await getPublishedResources()

  if (resources.length === 0) {
    resources = mockResources as any
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Free Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Download our collection of automation guides, templates, and tools to streamline your business processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <Card key={resource.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                {resource.thumbnail && (
                  <img
                    src={resource.thumbnail || "/placeholder.svg?height=200&width=300"}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {resource.category.replace("_", " ")}
                  </Badge>
                </div>
                <CardTitle className="text-white">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {resource.description && <p className="text-gray-300 mb-4 line-clamp-3">{resource.description}</p>}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloadsCount || 0} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link href={`/resources/${resource.slug}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No resources available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
