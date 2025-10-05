"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface LeadsParams {
  page?: number;
  perPage?: number;
  search?: string;
}

interface Lead {
  email: string;
  downloadCount: number;
  firstDownload: Date;
  lastDownload: Date;
  resources: string[];
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export async function getLeads({
  page = 1,
  perPage = 10,
  search = "",
}: LeadsParams = {}): Promise<LeadsResponse> {
  try {
    // TODO: Enable admin check
    // await requireAdmin()

    // Build where clause for search
    const whereClause = search
      ? {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    // Get unique emails with their download data
    const downloads = await prisma.resourceDownload.findMany({
      where: whereClause,
      include: {
        resource: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group by email and aggregate data
    const emailMap = new Map<
      string,
      {
        downloadCount: number;
        firstDownload: Date;
        lastDownload: Date;
        resources: Set<string>;
        status?: string;
      }
    >();

    downloads.forEach((download) => {
      const email = download.email;
      const status = download.status;
      if (status !== "CONFIRMED") {
        return; // Skip non-confirmed downloads
      }
      const existing = emailMap.get(email);

      if (existing) {
        existing.downloadCount += 1;
        existing.firstDownload = new Date(
          Math.min(
            existing.firstDownload.getTime(),
            download.createdAt.getTime()
          )
        );
        existing.lastDownload = new Date(
          Math.max(
            existing.lastDownload.getTime(),
            download.createdAt.getTime()
          )
        );
        if (download.resource?.title) {
          existing.resources.add(download.resource.title);
        }
      } else {
        emailMap.set(email, {
          downloadCount: 1,
          firstDownload: download.createdAt,
          lastDownload: download.createdAt,
          resources: new Set(
            download.resource?.title ? [download.resource.title] : []
          ),
        });
      }
    });

    // Convert to array and sort by last download (most recent first)
    const allLeads: Lead[] = Array.from(emailMap.entries())
      .map(([email, data]) => ({
        email,
        downloadCount: data.downloadCount,
        firstDownload: data.firstDownload,
        lastDownload: data.lastDownload,
        resources: Array.from(data.resources),
      }))
      .sort((a, b) => b.lastDownload.getTime() - a.lastDownload.getTime());

    // Apply pagination
    const total = allLeads.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const leads = allLeads.slice(startIndex, endIndex);

    return {
      leads,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return {
      leads: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

export async function exportLeadsToCSV(): Promise<{
  success: boolean;
  csvData?: string;
  error?: string;
}> {
  try {
    await requireAdmin();

    // Get all leads without pagination
    const { leads } = await getLeads({ page: 1, perPage: 10000 });

    if (leads.length === 0) {
      return {
        success: false,
        error: "No leads to export",
      };
    }

    // Create CSV headers
    const headers = [
      "Email",
      "Download Count",
      "First Download",
      "Last Download",
      "Resources Downloaded",
    ];

    // Create CSV rows
    const rows = leads.map((lead) => [
      lead.email,
      lead.downloadCount.toString(),
      lead.firstDownload.toISOString(),
      lead.lastDownload.toISOString(),
      lead.resources.join("; "),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    return {
      success: true,
      csvData: csvContent,
    };
  } catch (error) {
    console.error("Failed to export leads:", error);
    return {
      success: false,
      error: "Failed to export leads",
    };
  }
}

// Get leads statistics for dashboard
export async function getLeadsStats() {
  try {
    await requireAdmin();

    const totalDownloads = await prisma.resourceDownload.count();

    const uniqueEmails = await prisma.resourceDownload.groupBy({
      by: ["email"],
      _count: {
        email: true,
      },
    });

    const totalLeads = uniqueEmails.length;
    const avgDownloadsPerLead =
      totalLeads > 0 ? totalDownloads / totalLeads : 0;

    // Get recent leads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDownloads = await prisma.resourceDownload.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        email: true,
      },
    });

    const recentUniqueEmails = new Set(recentDownloads.map((d) => d.email));
    const newLeadsThisWeek = recentUniqueEmails.size;

    return {
      totalLeads,
      totalDownloads,
      avgDownloadsPerLead: Math.round(avgDownloadsPerLead * 10) / 10,
      newLeadsThisWeek,
    };
  } catch (error) {
    console.error("Failed to fetch leads stats:", error);
    return {
      totalLeads: 0,
      totalDownloads: 0,
      avgDownloadsPerLead: 0,
      newLeadsThisWeek: 0,
    };
  }
}
