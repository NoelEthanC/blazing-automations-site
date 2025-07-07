"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { submitContactForm } from "@/app/actions/leads"
import type { ContactFormData } from "@/lib/types"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    const contactData: ContactFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      message: formData.get("message") as string,
    }

    try {
      await submitContactForm(contactData)
      setSubmitted(true)
    } catch (error) {
      console.error("Failed to submit form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatedSection className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-400">Let's discuss how automation can revolutionize your operations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="Tell us about your automation needs..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info & Calendly */}
          <div className="space-y-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Get in touch</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-[#3f79ff]" />
                    <span className="text-gray-300">contact@blazingautomations.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-[#3f79ff]" />
                    <span className="text-gray-300">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-[#3f79ff]" />
                    <span className="text-gray-300">Remote • Worldwide</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-5 w-5 text-[#3f79ff]" />
                  <h3 className="text-xl font-semibold text-white">Book a Free Consultation</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Schedule a 30-minute call to discuss your automation needs and get expert advice.
                </p>
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-300 mb-4">Calendly widget would be embedded here</p>
                  <Button asChild className="bg-[#3f79ff] hover:bg-[#3f79ff]/80 text-white">
                    <a href="https://calendly.com/blazingautomations" target="_blank" rel="noopener noreferrer">
                      Schedule Call
                    </a>
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
