import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  MessageSquare,
  TrendingUp,
  Eye,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

async function getDashboardStats() {
  try {
    const [
      totalResources,
      publishedResources,
      totalDownloads,
      totalContacts,
      recentDownloads,
    ] = await Promise.all([
      prisma.resource.count(),
      prisma.resource.count({ where: { published: true } }),
      prisma.resourceDownload.count(),
      prisma.contactSubmission.count(),
      prisma.resourceDownload.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          resource: {
            select: { title: true, slug: true },
          },
        },
      }),
    ]);

    return {
      totalResources,
      publishedResources,
      totalDownloads,
      totalContacts,
      recentDownloads,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalResources: 0,
      publishedResources: 0,
      totalDownloads: 0,
      totalContacts: 0,
      recentDownloads: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const user = getCurrentUser();

  if (!user) {
    return null;
  }
  const statCards = [
    {
      title: "Total Resources",
      value: stats.totalResources,
      icon: FileText,
      description: `${stats.publishedResources} published`,
      color: "text-blue-400",
    },
    {
      title: "Total Downloads",
      value: stats.totalDownloads,
      icon: Download,
      description: "All time downloads",
      color: "text-green-400",
    },
    {
      title: "Contact Submissions",
      value: stats.totalContacts,
      icon: MessageSquare,
      description: "Total inquiries",
      color: "text-purple-400",
    },
    {
      title: "Growth Rate",
      value: "+12%",
      icon: TrendingUp,
      description: "This month",
      color: "text-orange-400",
    },
  ];

  //create or update user here and assign him admin role on sign in
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your automation resources.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentDownloads.length > 0 ? (
                stats.recentDownloads.map((download) => (
                  <div
                    key={download.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {download.resource.title}
                      </p>
                      <p className="text-sm text-gray-400">{download.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(download.createdAt).toLocaleDateString()}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-gray-600 text-gray-300"
                      >
                        {download.action}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">
                  No downloads yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/admin/resources/new"
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 transition-colors"
              >
                <FileText className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">Add New Resource</p>
                  <p className="text-sm text-gray-400">
                    Create a new automation template
                  </p>
                </div>
              </a>

              <a
                href="/admin/content"
                className="flex items-center gap-3 p-3 rounded-lg bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 transition-colors"
              >
                <Eye className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Update Content</p>
                  <p className="text-sm text-gray-400">
                    Manage homepage content
                  </p>
                </div>
              </a>

              <a
                href="/admin/contacts"
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/10 border border-purple-600/20 hover:bg-purple-600/20 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">View Messages</p>
                  <p className="text-sm text-gray-400">
                    Check contact submissions
                  </p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
