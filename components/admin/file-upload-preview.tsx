"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, FileIcon, X, CheckCircle } from "lucide-react"

interface FileUploadPreviewProps {
  name: string
  label: string
  accept?: string
  maxSize?: number // in MB
  required?: boolean
  preview?: boolean
}

export function FileUploadPreview({
  name,
  label,
  accept,
  maxSize = 10,
  required = false,
  preview = false,
}: FileUploadPreviewProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setError(null)

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type if accept is specified
    if (accept && !accept.split(",").some((type) => selectedFile.type.match(type.trim()))) {
      setError("Invalid file type")
      return
    }

    setFile(selectedFile)
    setUploaded(true)

    // Create preview for images
    if (preview && selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    setUploaded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          error
            ? "border-red-500 bg-red-500/5"
            : uploaded
              ? "border-green-500 bg-green-500/5"
              : "border-gray-600 hover:border-gray-500 bg-gray-900/50"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />

        {!file ? (
          <div className="text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 mb-2">
              Drop your file here or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#3f79ff] hover:underline"
              >
                browse
              </button>
            </p>
            <p className="text-sm text-gray-500">
              {accept && `Accepted formats: ${accept}`}
              {maxSize && ` • Max size: ${maxSize}MB`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                  <FileIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div className="flex items-center gap-2">
                {uploaded && (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Uploaded</span>
                  </div>
                )}
                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
