"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { submitContactForm } from "@/app/actions/contact"

export function ContactSection() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)

  return (
    <AnimatedSection className="py-20 bg-[#09111f]" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ready to automate your business? Let's discuss how we can help you save time and increase efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800/50 border-gray-700">
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

              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="bg-gray-900 border-gray-700 text-white"
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
                      className="bg-gray-900 border-gray-700 text-white"
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
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your automation needs..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#3f79ff] hover:bg-[#2563eb] text-white"
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

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Let's start a conversation</h3>
              <p className="text-gray-400 mb-8">
                We're here to help you transform your business with powerful automation solutions. Reach out to us
                through any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#3f79ff]/20 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-[#3f79ff]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email</h4>
                  <p className="text-gray-400">hello@blazingautomations.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#3f79ff]/20 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-[#3f79ff]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-[#3f79ff]/20 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-[#3f79ff]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Office</h4>
                  <p className="text-gray-400">
                    123 Automation Street
                    <br />
                    Tech City, TC 12345
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#3f79ff]/10 to-[#ca6678]/10 p-6 rounded-lg border border-[#3f79ff]/20">
              <h4 className="text-white font-semibold mb-2">Free Consultation</h4>
              <p className="text-gray-400 text-sm">
                Book a 30-minute free consultation to discuss your automation needs and get personalized
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
