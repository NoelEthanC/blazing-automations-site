"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Download, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Leads",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Resources Downloaded",
    value: "5,678",
    change: "+8%",
    changeType: "positive" as const,
    icon: Download,
  },
  {
    title: "Active Resources",
    value: "24",
    change: "+2",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

const recentLeads = [
  { email: "john@example.com", source: "Contact Form", date: "2024-01-15" },
  { email: "sarah@company.com", source: "Resource Download", date: "2024-01-15" },
  { email: "mike@startup.io", source: "Newsletter", date: "2024-01-14" },
  { email: "lisa@business.com", source: "Contact Form", date: "2024-01-14" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-[#3f79ff]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-1">
                <Badge
                  variant="secondary"
                  className={
                    stat.changeType === "positive" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{lead.email}</p>
                    <p className="text-sm text-gray-400">{lead.source}</p>
                  </div>
                  <span className="text-sm text-gray-500">{lead.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                Add New Resource
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                Update Hero Content
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                Export Leads
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors text-white">
                View Analytics
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
