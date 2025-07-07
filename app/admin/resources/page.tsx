"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { getResources, deleteResource } from "@/app/actions/resources"
import type { ResourceWithAuthor } from "@/lib/types"

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<ResourceWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadResources()
  }, [searchTerm, currentPage])

  const loadResources = async () => {
    setLoading(true)
    try {
      const result = await getResources({
        search: searchTerm || undefined,
        published: undefined, // Show all resources in admin
        page: currentPage,
        limit: 20,
      })
      setResources(result.resources)
      setTotal(result.total)
    } catch (error) {
      console.error("Failed to load resources:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id)
        loadResources()
      } catch (error) {
        console.error("Failed to delete resource:", error)
      }
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resources</h1>
          <p className="text-gray-400">Manage your downloadable resources and templates</p>
        </div>
        <Button asChild className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
          <Link href="/admin/resources/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Link>
        </Button>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">All Resources</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Title</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Downloads</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-gray-300 w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={resource.thumbnail || "/placeholder.svg?height=40&width=40"}
                          alt={resource.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium text-white">{resource.title}</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">{resource.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {resource.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={resource.published ? "default" : "secondary"}
                          className={
                            resource.published ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                          }
                        >
                          {resource.published ? "Published" : "Draft"}
                        </Badge>
                        {resource.featured && <Badge className="bg-[#fcbf5b]/20 text-[#fcbf5b]">Featured</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{resource.downloadsCount}</TableCell>
                    <TableCell className="text-gray-300">{new Date(resource.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem asChild className="text-gray-300 hover:text-white">
                            <Link href={`/resources/${resource.slug}`} target="_blank">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="text-gray-300 hover:text-white">
                            <Link href={`/admin/resources/${resource.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(resource.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {resources.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No resources found</p>
              <Button asChild className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
                <Link href="/admin/resources/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first resource
                </Link>
              </Button>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Previous
              </Button>
              <span className="text-gray-400">
                Page {currentPage} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === Math.ceil(total / 20)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
