"use client"

import { useEffect, useRef } from "react"
import { marqueeAnimation } from "@/lib/animations"

const tools = [
  { name: "Make.com", logo: "🔧" },
  { name: "Zapier", logo: "⚡" },
  { name: "OpenAI", logo: "🤖" },
  { name: "Airtable", logo: "📊" },
  { name: "Notion", logo: "📝" },
  { name: "Slack", logo: "💬" },
  { name: "Google Sheets", logo: "📈" },
  { name: "Calendly", logo: "📅" },
]

export function ToolsMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeAnimation(marqueeRef.current)
    }
  }, [])

  return (
    <section className="py-16 bg-[#09111f] border-y border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Trusted Tools We Use</h2>
          <p className="text-gray-400">Integrating with the best platforms to deliver powerful solutions</p>
        </div>

        <div className="relative">
          <div className="flex space-x-8" ref={marqueeRef}>
            {[...tools, ...tools].map((tool, index) => (
              <div
                key={`${tool.name}-${index}`}
                className="flex items-center space-x-3 bg-gray-800/50 rounded-lg px-6 py-3 min-w-fit"
              >
                <span className="text-2xl">{tool.logo}</span>
                <span className="text-white font-medium whitespace-nowrap">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
