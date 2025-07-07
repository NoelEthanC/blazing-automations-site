"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X, File } from "lucide-react"

interface FileUploadPreviewProps {
  name: string
  label: string
  accept?: string
  maxSize?: number // in MB
  preview?: boolean
  required?: boolean
}

export function FileUploadPreview({
  name,
  label,
  accept,
  maxSize = 10,
  preview = false,
  required = false,
}: FileUploadPreviewProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    setError(null)

    if (!selectedFile) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    setFile(selectedFile)

    // Generate preview for images
    if (preview && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreviewUrl(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    // Reset the input
    const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
    if (input) input.value = ""
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-gray-300">
        {label} {required && "*"}
      </Label>

      <div className="space-y-4">
        <Input
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="bg-gray-900 border-gray-700 text-white file:bg-gray-800 file:text-gray-300 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded"
          required={required}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {file && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-500 text-xs">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full h-32 object-cover rounded border border-gray-600"
                />
              </div>
            )}
          </div>
        )}

        {!file && (
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-xs mt-1">Max size: {maxSize}MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
