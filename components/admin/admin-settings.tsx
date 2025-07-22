"use client"

import { useState, useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, CheckCircle, AlertCircle, Key, Mail, Globe } from "lucide-react"
import { updateSettingsAction } from "@/app/actions/settings"

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [state, formAction, isPending] = useActionState(updateSettingsAction, null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your site configuration and preferences.</p>
      </div>

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span>Settings updated successfully!</span>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-[#3f79ff]">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="email" className="data-[state=active]:bg-[#3f79ff]">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-[#3f79ff]">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <form action={formAction}>
          <input type="hidden" name="category" value={activeTab} />

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Site Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name" className="text-gray-300">
                    Site Name
                  </Label>
                  <Input
                    id="site-name"
                    name="siteName"
                    placeholder="Blazing Automations"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="Blazing Automations"
                  />
                </div>
                <div>
                  <Label htmlFor="site-url" className="text-gray-300">
                    Site URL
                  </Label>
                  <Input
                    id="site-url"
                    name="siteUrl"
                    placeholder="https://blazingautomations.com"
                    className="bg-gray-900 border-gray-700 text-white"
                    defaultValue="https://blazingautomations.com"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Enable to show maintenance page to visitors</p>
                  </div>
                  <Switch name="maintenanceMode" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Analytics Tracking</Label>
                    <p className="text-sm text-gray-500">Enable Google Analytics tracking</p>
                  </div>
                  <Switch name="analyticsEnabled" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-host" className="text-gray-300">
                    SMTP Host
                  </Label>
                  <Input
                    id="smtp-host"
                    name="smtpHost"
                    placeholder="smtp.gmail.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port" className="text-gray-300">
                    SMTP Port
                  </Label>
                  <Input
                    id="smtp-port"
                    name="smtpPort"
                    placeholder="587"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="from-email" className="text-gray-300">
                    From Email
                  </Label>
                  <Input
                    id="from-email"
                    name="fromEmail"
                    type="email"
                    placeholder="noreply@blazingautomations.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="reply-to" className="text-gray-300">
                    Reply-To Email
                  </Label>
                  <Input
                    id="reply-to"
                    name="replyTo"
                    type="email"
                    placeholder="hello@blazingautomations.com"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">API Keys & Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="resend-key" className="text-gray-300">
                    Resend API Key
                  </Label>
                  <Input
                    id="resend-key"
                    name="resendApiKey"
                    type="password"
                    placeholder="re_••••••••••••••••••••••••••••••••"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="analytics-id" className="text-gray-300">
                    Google Analytics ID
                  </Label>
                  <Input
                    id="analytics-id"
                    name="analyticsId"
                    placeholder="G-XXXXXXXXXX"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="clerk-key" className="text-gray-300">
                    Clerk Publishable Key
                  </Label>
                  <Input
                    id="clerk-key"
                    name="clerkKey"
                    type="password"
                    placeholder="pk_••••••••••••••••••••••••••••••••"
                    className="bg-gray-900 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="bg-[#3f79ff] hover:bg-[#2563eb] text-white">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
