"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Cog, TrendingUp } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell Us Your Vision",
    description:
      "Share your business challenges and goals. We'll analyze your current processes and identify automation opportunities.",
  },
  {
    number: "02",
    icon: Cog,
    title: "We Build Your System",
    description:
      "Our team creates custom automations tailored to your needs using the latest AI and automation technologies.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "You Scale Effortlessly",
    description:
      "Watch your business grow while our automations handle the heavy lifting, giving you time to focus on strategy.",
  },
]

export function HowItWorksSection() {
  return (
    <AnimatedSection className="py-20 bg-[#09111f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How <span className="text-[#fcbf5b]">It</span> Works
          </h2>
          <p className="text-xl text-gray-400">
            From discovery to deployment - we make automations simple and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 relative"
            >
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-[#fcbf5b] rounded-full flex items-center justify-center text-[#09111f] font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                <div className="mt-4 mb-6">
                  <div className="p-4 bg-[#3f79ff]/20 rounded-lg inline-block">
                    <step.icon className="h-8 w-8 text-[#3f79ff]" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>

                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-400 mb-2">
            Book a free consultation and discover how automation can fit your productivity.
          </p>
          <p className="text-sm text-gray-500">No commitments, no sales pitch - just honest advice.</p>
        </div>
      </div>
    </AnimatedSection>
  )
}
