import { type NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-utils";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const tokenData = await verifyDownloadToken(token);

    if (
      !tokenData ||
      typeof tokenData !== "object" ||
      !("resourceId" in tokenData)
    ) {
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

    // Fetch file directly from Supabase URL
    const response = await fetch(resource.filePath);

    if (!response.ok) {
      return new NextResponse("Failed to fetch file from storage", {
        status: 500,
      });
    }

    const fileBuffer = Buffer.from(await response.arrayBuffer());

    // Use saved fileType, fallback to generic
    const contentType = resource.fileType || "application/octet-stream";
    const filename = resource.filePath.split("/").pop() || "download";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return new NextResponse("Download failed", { status: 500 });
  }
}
