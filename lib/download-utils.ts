import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateDownloadEmailTemplate } from "@/lib/email.tsx";

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function verifyDownloadToken(token: string) {
  const tokenData = await prisma.resourceDownload.findUnique({
    where: { token },
  });
  if (!tokenData) {
    return false;
  }
  const isExpired = new Date() > tokenData?.expiresAt!;
  if (!isExpired && tokenData.status === "PENDING") {
    return tokenData;
  } else {
    return false;
  }
}

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createDownloadToken(resourceId: string, email: string) {
  const token = generateDownloadToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
}

export async function confirmLead(token: string) {
  const res = await prisma.resourceDownload.update({
    where: { token },
    data: {
      status: "CONFIRMED",
      expiresAt: new Date(Date.now() + 1 * 60 * 1000),
    },
  });
  return res;
}
