import React from "react";
export const metadata = {
  title: "About Noel Ethan Chiwamba | Blazing Automations",
  description:
    "Meet Noel Ethan Chiwamba, founder of Blazing Automations. Discover how Alex helps businesses save time and scale faster using intelligent automation and AI-driven systems.",
  keywords: [
    "Noel Ethan Chiwamba",
    "Blazing Automations",
    "business automation",
    "workflow automation",
    "AI agent creator",
    "n8n expert",
    "automation consultant",
    "no-code expert",
    "automation agency",
    "intelligent systems",
  ],
  openGraph: {
    title: "About Noel Ethan | Blazing Automations",
    description:
      "Discover the journey, mission, and values behind Blazing Automations. Learn how Noel Ethan Chiwamba helps businesses work smarter using automation and AI.",
    url: "https://blazingautomations.com/about",
    images: [
      {
        url: "https://blazingautomations.com/images/about-og.png", // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: "About Noel Ethan Chiwamba - Blazing Automations",
      },
    ],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Blazing Automations",
    description:
      "Meet Noel Ethan, automation expert and founder of Blazing Automations. Learn how he helps businesses thrive with AI and workflow tools.",
    images: ["https://blazingautomations.com/images/about-og.png"],
  },
};
const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default AboutLayout;
