import { type NextRequest, NextResponse } from "next/server";
import { confirmLead, verifyDownloadToken } from "@/lib/download-utils";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const tokenData = await verifyDownloadToken(token);
    if (!tokenData) {
      return new NextResponse("Invalid or expired download link", {
        status: 401,
      });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: tokenData.resourceId },
    });

    if (!resource || !resource.filePath) {
      return new NextResponse("Resource not found", { status: 404 });
    }

    // ✅ Instead of fetching blob, just return the Supabase URL
    const downloadUrl = resource.filePath;

    // Background updates
    Promise.allSettled([
      prisma.resource.update({
        where: { id: resource.id },
        data: { downloadsCount: { increment: 1 } },
      }),
    ]).catch((err) => console.error("Background task failed:", err));

    return NextResponse.json(
      {
        success: true,
        downloadUrl,
        filename: resource.slug
          ? `${resource.slug}.${resource.fileType?.split("/")[1] || "file"}`
          : "download",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Download failed", { status: 500 });
  }
}
