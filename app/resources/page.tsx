import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import Link from "next/link"

async function getResources() {
  const resources = await prisma.resource.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return resources
}

export default async function ResourcesPage() {
  const resources = await getResources()

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
                {resource.thumbnailPath && (
                  <img
                    src={resource.thumbnailPath || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {resource.category.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {resource.type}
                  </Badge>
                </div>
                <CardTitle className="text-white">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {resource.description && <p className="text-gray-300 mb-4 line-clamp-3">{resource.description}</p>}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloadCount} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{resource.updatedAt.toLocaleDateString()}</span>
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
