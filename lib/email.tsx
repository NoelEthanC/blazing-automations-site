import { Resend } from "resend";
import { pretty, render } from "@react-email/render";
import DownloadEmail from "@/emails/download-template";

const resend = new Resend(`${process.env.RESEND_API_KEY!}`);

interface EmailOptions {
  to: string;
  subject: string;
  html?: string | React.ReactNode;
  props?: {
    resourceTitle: string | null;
    downloadUrl: string;
    email: string;
  } | null;
  from?: string;
}

export async function sendEmail({ to, subject, from, props }: EmailOptions) {
  const { resourceTitle, downloadUrl, email }: any = props;
  try {
    const { data, error } = await resend.emails.send({
      // from: from || process.env.FROM_EMAIL || "delivered@gmail.com",
      from: "Blazing Automations <contact@blazingautomations.com>",
      to: [to],
      subject: subject,
      react: (
        <DownloadEmail
          resourceTitle={resourceTitle}
          downloadUrl={downloadUrl}
        />
      ),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}

export async function generateDownloadEmailTemplate(
  resourceTitle: string,
  downloadUrl: string
) {
  // const html = await pretty(await render(<DownloadEmail />));
  // const html = await (pretty)  render(DownloadEmail({ resourceTitle, downloadUrl }));
  // return html;
}

export async function sendDownloadLinkEmail(
  resourceTitle: string,
  email: string,
  downloadUrl: string
) {
  // const emailHtml = generateDownloadEmailTemplate(resourceTitle, downloadUrl);
  await sendEmail({
    to: email,
    subject: "Your Blazing Automations download link",
    props: { resourceTitle, downloadUrl, email },
  });
}
