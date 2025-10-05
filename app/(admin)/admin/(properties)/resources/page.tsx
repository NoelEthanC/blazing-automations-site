import {
  getAllResources,
  toggleResourceStatus,
  deleteResource,
} from "@/app/actions/resources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Download,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default async function AdminResourcesPage() {
  const resources = await getAllResources();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
          <p className="text-gray-400">
            Manage your automation templates and guides.
          </p>
        </div>
        <Button asChild className="bg-[#3f79ff] hover:bg-[#2563eb] text-white">
          <Link href="/admin/resources/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Link>
        </Button>
      </div>

      {resources.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-12">
            <p className="text-gray-400 mb-4">No resources found.</p>
            <Button
              asChild
              className="bg-[#3f79ff] hover:bg-[#2563eb] text-white"
            >
              <Link href="/admin/resources/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resource
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                {resource.thumbnail && (
                  <img
                    src={resource.thumbnail || "/placeholder.svg"}
                    alt={resource.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400"
                  >
                    {resource.category.replace("_", " ")}
                  </Badge>
                  {resource.featured && (
                    <Badge
                      variant="outline"
                      className="border-yellow-600 text-yellow-400"
                    >
                      Featured
                    </Badge>
                  )}
                  {!resource.published && (
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-gray-400"
                    >
                      Draft
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-white">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{resource._count.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <Link href={`/admin/resources/${resource.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>

                  <form
                    action={toggleResourceStatus.bind(
                      null,
                      resource.id,
                      "published"
                    )}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className={
                        resource.published ? "text-green-400" : "text-gray-400"
                      }
                    >
                      {resource.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                  </form>

                  <form
                    action={toggleResourceStatus.bind(
                      null,
                      resource.id,
                      "featured"
                    )}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className={
                        resource.featured ? "text-yellow-400" : "text-gray-400"
                      }
                    >
                      {resource.featured ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </form>

                  <form action={deleteResource.bind(null, resource.id)}>
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
