import { NextRequest, NextResponse } from "next/server";
import { confirmLead, verifyDownloadToken } from "@/lib/download-utils";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const tokenData = await verifyDownloadToken(token);
    if (tokenData === false) {
      return new NextResponse("Invalid or expired download link", {
        status: 401,
      });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: tokenData.resourceId },
    });

    await Promise.allSettled([
      confirmLead(token),
      prisma.resource.update({
        where: { id: resource?.id },
        data: {
          downloadsCount: {
            increment: 1,
          },
        },
      }),
    ]);
    console.log("done");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm download error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm download" },
      { status: 500 }
    );
  }
}
