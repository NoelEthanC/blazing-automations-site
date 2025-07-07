"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileIcon, CheckCircle, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadPreviewProps {
  name: string
  label: string
  accept?: string
  maxSize?: number // in MB
  preview?: boolean
  required?: boolean
  className?: string
}

export function FileUploadPreview({
  name,
  label,
  accept,
  maxSize = 10,
  preview = false,
  required = false,
  className,
}: FileUploadPreviewProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      setPreviewUrl(null)
      setError(null)
      setIsUploaded(false)
      return
    }

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type if accept is specified
    if (accept && !accept.split(",").some((type) => selectedFile.type.match(type.trim().replace("*", ".*")))) {
      setError(`Invalid file type. Accepted types: ${accept}`)
      return
    }

    setFile(selectedFile)
    setError(null)
    setIsUploaded(true)

    // Generate preview for images
    if (preview && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    setIsUploaded(false)

    // Clear the input
    const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement
    if (input) {
      input.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-3", className)}>
      <label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {!file ? (
        <div className="relative">
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required={required}
          />
          <Card className="border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center py-8 px-4">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400 text-center">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">
                {accept && `Accepted: ${accept}`}
                {maxSize && ` • Max size: ${maxSize}MB`}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {previewUrl ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                  <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                  <FileIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white truncate">{file.name}</p>
                  {isUploaded && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {formatFileSize(file.size)} • {file.type}
                </p>
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
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
