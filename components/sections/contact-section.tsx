"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Loader2, Calendar } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { submitContactForm } from "@/app/actions/contact"
import { trackEvent } from "@/lib/analytics"
import { events } from "@/lib/eventRegistry"
import Link from "next/link"

export function ContactSection() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)

  const handleFormSubmit = async (formData: FormData) => {
    const company = formData.get("company") as string
    trackEvent(...Object.values(events.contact.sendMessage(!!company)))
    return formAction(formData)
  }

  const handleScheduleCallClick = () => {
    trackEvent(...Object.values(events.contact.scheduleCall()))
  }

  return (
    <AnimatedSection id="contact" className="py-36 bg-[#09111f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In
            <span className="gradient-text"> Touch </span>
          </h2>
          <p className="text-xl text-slate-text max-w-2xl mx-auto">
            Ready to automate your business? Let's discuss how we can help you save time and increase efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-secondary-blue/15 border-secondary-blue/30">
            <CardHeader>
              <CardTitle className="text-white">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>{state.message}</span>
                  </div>
                </div>
              )}

              {state?.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{state.error}</span>
                  </div>
                </div>
              )}

              <form action={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="bg-secondary-blue/30 border-secondary-blue text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-secondary-blue/30 border-secondary-blue text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-300">
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your company name"
                    className="bg-secondary-blue/30 border-secondary-blue text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Talk to us OR just say Hi🤣..."
                    className="bg-secondary-blue/30 border-secondary-blue text-white"
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full gradient-upstream hover:bg-[#2563eb] text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-transparent border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Get in touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#3f79ff]" />
                    <span className="text-gray-300">contact@blazingautomations.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[#3f79ff]" />
                    <span className="text-gray-300">Remote • Worldwide</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#3f79ff]/10 to-[#ca6678]/10 p-6 rounded-lg border border-[#3f79ff]/20 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-5 w-5 text-[#3f79ff]" />
                  <h3 className="text-xl font-semibold text-white">Book a Free Consultation</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Schedule a 30-minute call to discuss your automation needs and get expert advice.
                </p>
                <div className="bg-transparent rounded-lg p-8 text-center">
                  <Button
                    asChild
                    className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white"
                    onClick={handleScheduleCallClick}
                  >
                    <Link href="https://calendly.com/noelethan-ch/30min" target="_blank" rel="noopener noreferrer">
                      Schedule Call
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
