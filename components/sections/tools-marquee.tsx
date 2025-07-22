"use client";

import { useEffect, useRef } from "react";
import { marqueeAnimation } from "@/lib/animations";
import Image from "next/image";

const tools = [
  { name: "Airtable", logo: "/images/logos/airtable-1.png" },
  { name: "n8n", logo: "/images/logos/n8n-logo.png" },
  { name: "OpenAI", logo: "/images/logos/open-ai.png" },
  { name: "Slack", logo: "/images/logos/slack.png" },
  { name: "Notion", logo: "/images/logos/notion.png" },
  { name: "Calendly", logo: "/images/logos/calendly.png" },
  { name: "Google Apps", logo: "/images/logos/google.png" },
  { name: "NextJS", logo: "/images/logos/nextjs.png" },
];

export function ToolsMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeAnimation(marqueeRef.current);
    }
  }, []);

  return (
    <section
      id="tools"
      className="py-32 bg-[#09111f] border-y border-gray-800 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="gradient-text">Trusted Tools </span>
            We Use
          </h2>
          <p className="text-slate-text">
            Integrating with the best platforms to deliver powerful solutions
          </p>
        </div>

        <div className="relative">
          <div className="flex space-x-8" ref={marqueeRef}>
            {[...tools, ...tools].map((tool, index) => (
              <div
                key={`${tool.name}-${index}`}
                className="flex items-center space-x-3 bg-transparent rounded-lg px-6 py-3 min-w-fit"
              >
                <Image
                  width={50}
                  height={50}
                  src={tool.logo}
                  alt=""
                  className="text-2xl"
                />
                <span className="text-white font-medium whitespace-nowrap">
                  {tool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
