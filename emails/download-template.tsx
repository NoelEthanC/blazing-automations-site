import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface DownloadEmailProps {
  resourceTitle: string;
  downloadUrl: string;
}

export const DownloadEmail = ({
  resourceTitle,
  downloadUrl,
}: DownloadEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Your Blazing Automations download link</Preview>
      <Body className="bg-white font-sans">
        <Container className="mx-auto max-w-[600px] py-5 px-0">
          {/* Logo Section */}
          <Section className="text-center mb-8">
            <Heading className=" text-[#09111f] text-2xl font-bold m-0">
              Blazing Automations
            </Heading>
          </Section>

          {/* Content Section */}
          <Section className="px-5">
            <Heading className="text-gray-900 text-xl font-bold mb-5">
              Your download is ready!
            </Heading>

            <Text className="text-gray-700 text-base leading-[26px] mb-5">
              Thank you for downloading <strong>{resourceTitle}</strong>.
            </Text>

            {/* Button Section */}
            <Section className="text-center my-8">
              <Button
                href={downloadUrl}
                className="bg-[#3f79ff] rounded-lg text-white text-base font-bold no-underline text-center inline-block px-8 py-4"
              >
                Download Template
              </Button>
            </Section>

            <Text className="text-red-600 text-sm leading-6 my-5">
              <strong>Note:</strong> This download link will expire in 24 hours
              for security reasons.
            </Text>
          </Section>

          {/* Footer Section */}
          <Section className="border-t border-[#333333] mt-8 pt-5 px-5">
            <Text className="text-[#888888] text-sm leading-6 mb-2">
              Need help? Reply to this email or visit our website.
            </Text>
            <Text className="text-[#888888] text-sm leading-6 m-0">
              Best regards,
              <br />
              The Blazing Automations Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default DownloadEmail;
