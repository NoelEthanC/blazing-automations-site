"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, MoreHorizontal, Mail, User } from "lucide-react"
import { getLeads, updateLeadStatus, exportLeads } from "@/app/actions/leads"
import type { LeadWithAssignee } from "@/lib/types"

const leadSources = ["ALL", "CONTACT_FORM", "RESOURCE_DOWNLOAD", "NEWSLETTER", "CALENDLY", "OTHER"]
const leadStatuses = ["ALL", "NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"]

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadWithAssignee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSource, setSelectedSource] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadLeads()
  }, [searchTerm, selectedSource, selectedStatus, currentPage])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const result = await getLeads({
        search: searchTerm || undefined,
        source: selectedSource !== "ALL" ? selectedSource : undefined,
        status: selectedStatus !== "ALL" ? selectedStatus : undefined,
        page: currentPage,
        limit: 20,
      })
      setLeads(result.leads)
      setTotal(result.total)
    } catch (error) {
      console.error("Failed to load leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateLeadStatus(id, status)
      loadLeads()
    } catch (error) {
      console.error("Failed to update lead status:", error)
    }
  }

  const handleExport = async () => {
    try {
      const csvContent = await exportLeads({
        search: searchTerm || undefined,
        source: selectedSource !== "ALL" ? selectedSource : undefined,
        status: selectedStatus !== "ALL" ? selectedStatus : undefined,
      })

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export leads:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-500/20 text-blue-400"
      case "CONTACTED":
        return "bg-yellow-500/20 text-yellow-400"
      case "QUALIFIED":
        return "bg-purple-500/20 text-purple-400"
      case "CONVERTED":
        return "bg-green-500/20 text-green-400"
      case "CLOSED":
        return "bg-gray-500/20 text-gray-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case "CONTACT_FORM":
        return "bg-[#3f79ff]/20 text-[#3f79ff]"
      case "RESOURCE_DOWNLOAD":
        return "bg-[#fcbf5b]/20 text-[#fcbf5b]"
      case "NEWSLETTER":
        return "bg-[#ca6678]/20 text-[#ca6678]"
      case "CALENDLY":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Leads</h1>
          <p className="text-gray-400">Manage and track your business leads</p>
        </div>
        <Button onClick={handleExport} className="bg-[#3f79ff] hover:bg-[#3f79ff]/80">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-white">All Leads ({total})</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white w-64"
                />
              </div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {leadSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {leadStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Contact</TableHead>
                  <TableHead className="text-gray-300">Source</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Message</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300 w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className="border-gray-700">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{lead.name || lead.email}</div>
                        {lead.name && <div className="text-sm text-gray-400">{lead.email}</div>}
                        {lead.company && <div className="text-sm text-gray-500">{lead.company}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSourceColor(lead.source)}>{lead.source.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-gray-300">{lead.message || "No message"}</div>
                    </TableCell>
                    <TableCell className="text-gray-300">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem
                            onClick={() => window.open(`mailto:${lead.email}`, "_blank")}
                            className="text-gray-300 hover:text-white"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </DropdownMenuItem>
                          {leadStatuses.slice(1).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusUpdate(lead.id, status)}
                              className="text-gray-300 hover:text-white"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Mark as {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {leads.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No leads found</p>
              <p className="text-sm text-gray-500">
                Leads will appear here when visitors submit contact forms or download resources.
              </p>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Previous
              </Button>
              <span className="text-gray-400">
                Page {currentPage} of {Math.ceil(total / 20)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === Math.ceil(total / 20)}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
