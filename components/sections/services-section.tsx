"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Globe, Workflow, Database, Code, Zap } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"
import { staggerFadeIn } from "@/lib/animations"

const services = [
  {
    icon: Bot,
    title: "Chatbots & AI Agents",
    description:
      "Intelligent conversational AI that handles customer inquiries, lead qualification, and support automation 24/7.",
  },
  {
    icon: Globe,
    title: "Business Websites",
    description:
      "Professional, responsive websites that convert visitors into customers with modern design and seamless user experience.",
  },
  {
    icon: Workflow,
    title: "Automated AI Workflows",
    description:
      "Custom automation solutions that streamline your business processes and eliminate repetitive manual tasks.",
  },
  {
    icon: Database,
    title: "AI-Powered Data Systems",
    description:
      "Smart data management systems that organize, analyze, and provide actionable insights from your business data.",
  },
  {
    icon: Code,
    title: "Custom Web Applications",
    description:
      "Tailored web applications built to solve your specific business challenges with cutting-edge technology.",
  },
  {
    icon: Zap,
    title: "API Integrations",
    description: "Seamless connections between your existing tools and new systems for unified business operations.",
  },
]

export function ServicesSection() {
  useEffect(() => {
    const timer = setTimeout(() => {
      staggerFadeIn(".service-card", 0.2)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatedSection className="py-20 bg-[#09111f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Build</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We're experts with the world's most powerful automation tools. Let us build your custom workflows and
            systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="service-card bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300 hover:transform hover:scale-105"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-[#3f79ff]/20 rounded-lg mr-4">
                    <service.icon className="h-6 w-6 text-[#3f79ff]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
