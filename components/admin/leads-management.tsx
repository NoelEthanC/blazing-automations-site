"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Download, Search, Users, FileDown } from "lucide-react";
import { getLeads, exportLeadsToCSV } from "@/app/actions/leads";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Lead {
  email: string;
  downloadCount: number;
  firstDownload: Date;
  lastDownload: Date;
  name?: string;
  status?: string;
  resources: string[];
}

interface LeadsData {
  leads: Lead[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export function LeadsManagement() {
  const [leadsData, setLeadsData] = useState<LeadsData>({
    leads: [],
    total: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchLeads = async (page: number, search = "") => {
    setLoading(true);
    try {
      const data = await getLeads({
        page,
        perPage,
        search: search.trim(),
      });
      setLeadsData(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportLeadsToCSV();
      if (result.success && result.csvData) {
        // Create and download CSV file
        const blob = new Blob([result.csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("Leads exported successfully!");
      } else {
        toast.error(result.error || "Failed to export leads");
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export leads");
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 text-white">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white font-medium">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-secondary-blue/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {leadsData.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique email addresses
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-secondary-blue/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {leadsData.leads.reduce(
                (sum, lead) => sum + lead.downloadCount,
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all resources
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Avg Downloads
            </CardTitle>
            <FileDown className="h-4 w-4 text-secondary-blue/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {leadsData.total > 0
                ? (
                    leadsData.leads.reduce(
                      (sum, lead) => sum + lead.downloadCount,
                      0
                    ) / leadsData.total
                  ).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Per lead</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Leads List</CardTitle>
            <Button
              onClick={handleExport}
              disabled={exporting || leadsData.total === 0}
              className="flex items-center gap-2 bg-secondary-blue"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2 max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 focus:ring-0 focus:border-gray-500"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 border rounded"
                >
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
              ))}
            </div>
          ) : leadsData.leads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No leads match your search criteria."
                  : "No users have downloaded resources yet."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>First Download</TableHead>
                    <TableHead>Last Download</TableHead>
                    <TableHead>Resources</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-white">
                  {leadsData.leads.map((lead) => (
                    <TableRow
                      className="hover:bg-secondary-blue/20"
                      key={lead.email}
                    >
                      <TableCell className="font-medium uppercase w-fit">
                        {lead?.name ? lead?.name : "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {lead.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{lead.downloadCount}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <Badge
                          className={cn(
                            "text-white border-0 outline-none",
                            lead.status === "CONFIRMED"
                              ? "  bg-green-600"
                              : "text-red-500 outline-none"
                          )}
                          variant={
                            lead.status === "CONFIRMED"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {lead.status ? lead.status : "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(lead.firstDownload)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(lead.lastDownload)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {lead.resources.slice(0, 2).map((resource, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs text-gray-300"
                            >
                              {resource}
                            </Badge>
                          ))}
                          {lead.resources.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-200"
                            >
                              +{lead.resources.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {leadsData.totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            handlePageChange(Math.max(1, currentPage - 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: Math.min(5, leadsData.totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(
                                leadsData.totalPages - 4,
                                currentPage - 2
                              )
                            ) + i;

                          if (pageNum > leadsData.totalPages) return null;

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            handlePageChange(
                              Math.min(leadsData.totalPages, currentPage + 1)
                            )
                          }
                          className={
                            currentPage === leadsData.totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
