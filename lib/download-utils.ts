import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateDownloadEmailTemplate } from "@/lib/email";
import { ResourceDownload } from "@prisma/client";

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
  if (!isExpired) {
    return tokenData;
  } else {
    // Optionally, you can delete the expired token
    // await prisma.resourceDownload.delete({
    //   where: { token },
    // });
    return false;
  }
}

export function generateDownloadToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createDownloadToken(resourceId: string, email: string) {
  const token = generateDownloadToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // await prisma.resourceDownload.create({
  //   data: {
  //     token,
  //     resourceId,
  //     email,
  //     expiresAt,
  //   } as ResourceDownload, // TypeScript workaround for Prisma
  // });

  return token;
}

export async function sendDownloadEmail(
  resourceTitle: string,
  email: string,
  token: string
) {
  const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/download/${token}`;
  const emailTemplate = generateDownloadEmailTemplate(
    resourceTitle,
    downloadUrl
  );

  await sendEmail({
    to: email,
    subject: `Your ${resourceTitle} download is ready!`,
    html: emailTemplate,
  });
}
