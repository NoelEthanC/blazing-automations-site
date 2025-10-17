"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUploadPreview } from "./file-upload-preview";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";
import { createResource, updateResource } from "@/app/actions/resources";

interface ResourceFormProps {
  resource?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string | null;
    category: string;
    tool: string | null;
    hasGuide: boolean;
    guideUrl: string | null;
    featured: boolean;
    published: boolean;
    thumbnail: string | null;
    filePath: string | null;
  };
  isEditing?: boolean;
}

export function ResourceForm({
  resource,
  isEditing = false,
}: ResourceFormProps) {
  const [state, formAction, isPending] = useActionState(
    isEditing ? updateResource.bind(null, resource!.id) : createResource,
    null
  );

  const categories = [
    { value: "MAKE_TEMPLATES", label: "Make.com Templates" },
    { value: "ZAPIER_TEMPLATES", label: "Zapier Templates" },
    { value: "N8N_TEMPLATES", label: "n8n Templates" },
    { value: "AUTOMATION_GUIDES", label: "Automation Guides" },
    { value: "TOOLS_RESOURCES", label: "Tools & Resources" },
    { value: "TOOLS", label: "Tools" },
    { value: "GUIDE", label: "Guide" },
    { value: "TEMPLATES", label: "Templates" },
  ];

  return (
    <form action={formAction} className="space-y-8">
      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>
              Resource {isEditing ? "updated" : "created"} successfully!
            </span>
          </div>
        </div>
      )}

      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span>{state.error}</span>
          </div>
        </div>
      )}

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
                  placeholder="Amazing Automation Template"
                  className="bg-gray-900 border-gray-700 text-white"
                  defaultValue={resource?.title}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  Short Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of what this resource does..."
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={3}
                  defaultValue={resource?.description}
                  required
                />
              </div>

              <div>
                <Label htmlFor="longDescription" className="text-gray-300">
                  Detailed Description
                </Label>
                <Textarea
                  id="longDescription"
                  name="longDescription"
                  placeholder="Detailed explanation, features, benefits, and usage instructions..."
                  className="bg-gray-900 border-gray-700 text-white"
                  rows={6}
                  defaultValue={resource?.longDescription || ""}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Files & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadPreview
                name="thumbnail"
                label="Thumbnail Image"
                accept="image/*"
                maxSize={5}
                preview={true}
              />

              <FileUploadPreview
                name="resourceFile"
                label="Resource File"
                accept=".json,.zip,.pdf,.docx"
                maxSize={50}
                required={!isEditing}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">
                  Category *
                </Label>
                <Select
                  name="category"
                  defaultValue={resource?.category}
                  required
                >
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-white">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
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
                  placeholder="Make.com, Zapier, n8n, etc."
                  className="bg-gray-900 border-gray-700 text-white"
                  defaultValue={resource?.tool || ""}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-300">Featured</Label>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
                <Switch name="featured" defaultChecked={resource?.featured} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-300">Published</Label>
                  <p className="text-sm text-gray-500">Make visible to users</p>
                </div>
                <Switch
                  name="published"
                  defaultChecked={resource?.published ?? false}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Guide & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-300">Has Guide</Label>
                  <p className="text-sm text-gray-500">Include setup guide</p>
                </div>
                <Switch name="hasGuide" defaultChecked={resource?.hasGuide} />
              </div>

              <div>
                <Label htmlFor="guideUrl" className="text-gray-300">
                  Guide URL
                </Label>
                <Input
                  id="guideUrl"
                  name="guideUrl"
                  type="url"
                  placeholder="https://docs.example.com/guide"
                  className="bg-gray-900 border-gray-700 text-white"
                  defaultValue={resource?.guideUrl || ""}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#3f79ff] hover:bg-[#2563eb] text-white"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Update Resource" : "Create Resource"}
          </Button>
        </div>
      </div>
    </form>
  );
}
