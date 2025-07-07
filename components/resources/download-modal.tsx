"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { downloadResourceAction } from "@/app/actions/download"
import { validateEmail } from "@/lib/download-utils"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  resourceTitle: string
  resourceSlug: string
}

export function DownloadModal({ isOpen, onClose, resourceTitle, resourceSlug }: DownloadModalProps) {
  const [email, setEmail] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [state, formAction, isPending] = useActionState(downloadResourceAction, null)

  // Validate email on change
  useEffect(() => {
    setIsEmailValid(validateEmail(email))
  }, [email])

  // Handle success state
  useEffect(() => {
    if (state?.success) {
      if (state.downloadUrl) {
        // Auto-trigger download
        const link = document.createElement("a")
        link.href = state.downloadUrl
        link.download = ""
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      setSuccessMessage(state.message || "Success!")
      setShowSuccess(true)

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        setEmail("")
      }, 3000)
    }
  }, [state, onClose])

  const handleClose = () => {
    if (!isPending && !showSuccess) {
      onClose()
      setEmail("")
      setShowSuccess(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Download {resourceTitle}</DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="text-green-400 text-center font-medium">{successMessage}</p>
            <p className="text-gray-400 text-sm text-center">This modal will close automatically...</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="resourceSlug" value={resourceSlug} />

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isPending}
                required
              />
              {email && !isEmailValid && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Please enter a valid email address
                </p>
              )}
            </div>

            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {state.error}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                name="action"
                value="download_now"
                disabled={!isEmailValid || isPending}
                className="flex-1 bg-[#3f79ff] hover:bg-[#2563eb] text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Download Now
              </Button>

              <Button
                type="submit"
                name="action"
                value="send_email"
                disabled={!isEmailValid || isPending}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                Send to Email
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By downloading, you agree to receive occasional updates about our automation resources.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
