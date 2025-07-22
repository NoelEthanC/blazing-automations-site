"use client";

import { useState, useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateSiteContent } from "@/app/actions/content";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState("hero");
  const [state, formAction, isPending] = useActionState(
    updateSiteContent,
    null
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Content Management
        </h1>
        <p className="text-gray-400">
          Update your website content and settings.
        </p>
      </div>

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Content updated successfully!</span>
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger
            value="hero"
            className="data-[state=active]:bg-[#3f79ff]"
          >
            Hero Section
          </TabsTrigger>
          <TabsTrigger
            value="services"
            className="data-[state=active]:bg-[#3f79ff]"
          >
            Services
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="data-[state=active]:bg-[#3f79ff]"
          >
            About
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-[#3f79ff]"
          >
            Contact
          </TabsTrigger>
        </TabsList>

        <form action={formAction}>
          <input type="hidden" name="section" value={activeTab} />

          <TabsContent value="hero" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  Hero Section Content
                  <Badge
                    variant="secondary"
                    className="bg-[#3f79ff]/20 text-[#3f79ff]"
                  >
                    Landing Page
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title" className="text-gray-300">
                    Main Title
                  </Label>
                  <Input
                    id="hero-title"
                    name="title"
                    placeholder="Automate Your Business with Blazing Speed"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="Automate Your Business with Blazing Speed"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle" className="text-gray-300">
                    Subtitle
                  </Label>
                  <Textarea
                    id="hero-subtitle"
                    name="subtitle"
                    placeholder="Transform your workflows with our premium automation templates..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={3}
                    defaultValue="Transform your workflows with our premium automation templates for Make.com, Zapier, and n8n. Save hours of setup time with our battle-tested solutions."
                  />
                </div>
                <div>
                  <Label htmlFor="hero-cta" className="text-gray-300">
                    Call-to-Action Text
                  </Label>
                  <Input
                    id="hero-cta"
                    name="ctaText"
                    placeholder="Get Started Today"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="Get Started Today"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Services Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="services-title" className="text-gray-300">
                    Section Title
                  </Label>
                  <Input
                    id="services-title"
                    name="title"
                    placeholder="Our Services"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="Our Automation Services"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="services-description"
                    className="text-gray-300"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="services-description"
                    name="description"
                    placeholder="We provide comprehensive automation solutions..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={4}
                    defaultValue="We provide comprehensive automation solutions to streamline your business processes and boost productivity."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">About Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-title" className="text-gray-300">
                    Section Title
                  </Label>
                  <Input
                    id="about-title"
                    name="title"
                    placeholder="Why Choose Blazing Automations?"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="Why Choose Blazing Automations?"
                  />
                </div>
                <div>
                  <Label htmlFor="about-content" className="text-gray-300">
                    Content
                  </Label>
                  <Textarea
                    id="about-content"
                    name="content"
                    placeholder="Our story and mission..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={6}
                    defaultValue="We're passionate about helping businesses unlock their potential through intelligent automation. Our team of experts creates premium templates and guides that save you time and eliminate the guesswork."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-email" className="text-gray-300">
                    Contact Email
                  </Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="hello@blazingautomations.com"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="hello@blazingautomations.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone" className="text-gray-300">
                    Phone Number
                  </Label>
                  <Input
                    id="contact-phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-address" className="text-gray-300">
                    Address
                  </Label>
                  <Textarea
                    id="contact-address"
                    name="address"
                    placeholder="123 Automation Street..."
                    className="bg-gray-900 border-gray-700 text-white"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#3f79ff] hover:bg-[#2563eb] text-white"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}
