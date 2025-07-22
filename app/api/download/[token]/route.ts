import { type NextRequest, NextResponse } from "next/server";
import { verifyDownloadToken } from "@/lib/download-utils";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

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

    // Read file from public directory
    const filePath = join(process.cwd(), "public", resource.filePath);
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const contentType = resource.fileType || "application/octet-stream";

    // Extract filename from path
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
