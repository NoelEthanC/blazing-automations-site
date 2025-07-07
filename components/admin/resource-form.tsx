"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { createResource, updateResource } from "@/app/actions/resources"
import type { ResourceWithAuthor } from "@/lib/types"

interface ResourceFormProps {
  resource?: ResourceWithAuthor
  isEditing?: boolean
}

export function ResourceForm({ resource, isEditing = false }: ResourceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(resource?.thumbnail || null)

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      if (isEditing && resource) {
        await updateResource(resource.id, formData)
      } else {
        await createResource(formData)
      }
    } catch (error) {
      console.error("Failed to save resource:", error)
      alert("Failed to save resource. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={resource?.title}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter resource title"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Short Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={resource?.description}
                  required
                  rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Brief description for resource cards"
                />
              </div>

              <div>
                <Label htmlFor="longDescription" className="text-gray-300">
                  Long Description
                </Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  defaultValue={resource?.longDescription || ""}
                  rows={6}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Detailed description for resource detail page"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  <Select name="category" defaultValue={resource?.category || "TEMPLATE"}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="TEMPLATE">Template</SelectItem>
                      <SelectItem value="GUIDE">Guide</SelectItem>
                      <SelectItem value="TOOL">Tool</SelectItem>
                      <SelectItem value="EBOOK">eBook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tool" className="text-gray-300">
                    Tool/Platform
                  </Label>
                  <Input
                    id="tool"
                    name="tool"
                    defaultValue={resource?.tool || ""}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="e.g., Make.com, Zapier"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guideUrl" className="text-gray-300">
                  Setup Guide URL
                </Label>
                <Input
                  id="guideUrl"
                  name="guideUrl"
                  type="url"
                  defaultValue={resource?.guideUrl || ""}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">File Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="thumbnail" className="text-gray-300">
                  Thumbnail Image
                </Label>
                <div className="mt-2">
                  {thumbnailPreview && (
                    <div className="relative mb-4">
                      <img
                        src={thumbnailPreview || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        className="w-full max-w-sm h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => setThumbnailPreview(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="thumbnail"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> thumbnail
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or WebP (MAX. 5MB)</p>
                      </div>
                      <input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="resourceFile" className="text-gray-300">
                  Resource File
                </Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="resourceFile"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> resource file
                        </p>
                        <p className="text-xs text-gray-500">JSON, ZIP or PDF (MAX. 50MB)</p>
                      </div>
                      <input
                        id="resourceFile"
                        name="resourceFile"
                        type="file"
                        accept=".json,.zip,.pdf,application/json,application/zip,application/pdf"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="text-gray-300">
                  Published
                </Label>
                <Switch id="published" name="published" defaultChecked={resource?.published ?? true} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="text-gray-300">
                  Featured
                </Label>
                <Switch id="featured" name="featured" defaultChecked={resource?.featured ?? false} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hasGuide" className="text-gray-300">
                  Has Setup Guide
                </Label>
                <Switch id="hasGuide" name="hasGuide" defaultChecked={resource?.hasGuide ?? false} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3f79ff] hover:bg-[#3f79ff]/80">
                {isSubmitting ? "Saving..." : isEditing ? "Update Resource" : "Create Resource"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
