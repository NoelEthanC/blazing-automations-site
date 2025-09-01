"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { downloadResourceAction } from "@/app/actions/download"
import { validateEmail } from "@/lib/download-utils"
import { trackEvent } from "@/lib/analytics"
import { events } from "@/lib/eventRegistry"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  resourceTitle: string
  resourceSlug: string
}

export function DownloadModal({ isOpen, onClose, resourceTitle, resourceSlug }: DownloadModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const downloadTriggeredRef = useRef(false)

  const resetModal = () => {
    setEmail("")
    setShowSuccess(false)
    setError("")
    setSuccessMessage("")
    setIsSubmitting(false)
    downloadTriggeredRef.current = false
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetModal()
      onClose()
    }
  }

  const handleDownload = async (action: "download_now" | "send_email") => {
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address")
      return
    }

    // Track the download event
    trackEvent(...Object.values(events.resources.download(resourceSlug, action)))

    setIsSubmitting(true)
    setError("")
    downloadTriggeredRef.current = false

    try {
      const formData = new FormData()
      formData.append("email", email.trim())
      formData.append("resourceSlug", resourceSlug)
      formData.append("action", action)

      const result = await downloadResourceAction(formData)

      if (result?.success) {
        if (action === "download_now" && result.downloadUrl && !downloadTriggeredRef.current) {
          // Trigger download only once
          downloadTriggeredRef.current = true
          const link = document.createElement("a")
          link.href = result.downloadUrl
          link.download = ""
          link.style.display = "none"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        setSuccessMessage(action === "download_now" ? "Download started! " : "Download link sent to your email!")
        setShowSuccess(true)

        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setError(result?.error || "Failed to process download request")
      }
    } catch (error) {
      console.error("Download failed:", error)
      setError("Failed to process download request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset modal state when it opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetModal()
    } else if (!isSubmitting) {
      handleClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold gradient-text">Get Your Free Template</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Success!</h3>
            <p className="text-green-400 text-center font-medium">{successMessage}</p>
            <p className="text-gray-400 text-sm text-center">This modal will close automatically...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{resourceTitle}</h3>
              <p className="text-sunray font-light">Enter your email address to download this template.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="your@email.com"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isSubmitting}
                required
              />
              {error && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleDownload("download_now")}
                disabled={!email.trim() || !validateEmail(email.trim()) || isSubmitting}
                className="flex-1 bg-[#3f79ff] hover:bg-[#2563eb] text-white disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleDownload("send_email")}
                disabled={!email.trim() || !validateEmail(email.trim()) || isSubmitting}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send to Email
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By downloading, you agree to receive occasional updates about our automation resources.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
