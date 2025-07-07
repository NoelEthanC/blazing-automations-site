"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, Brain, Shield, TrendingUp } from "lucide-react"
import { AnimatedSection } from "@/components/ui/animated-section"

const benefits = [
  {
    icon: Clock,
    title: "Save 30+ Hours Per Week",
    description: "Automate repetitive tasks and focus on growing your business instead of managing it.",
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Leverage cutting-edge AI to make smarter decisions and provide better customer experiences.",
  },
  {
    icon: Shield,
    title: "Identify Scalable Solutions",
    description: "Build systems that grow with your business and adapt to changing needs automatically.",
  },
  {
    icon: TrendingUp,
    title: "Enterprise-Grade Security",
    description: "Your data and automations are protected with bank-level security and compliance standards.",
  },
]

const stats = [
  { number: "50+", label: "Projects Completed" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "24/7", label: "Automation Uptime" },
]

export function WhyChooseSection() {
  return (
    <AnimatedSection className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-[#fcbf5b]">Blazing Automations</span>?
          </h2>
          <p className="text-xl text-gray-400">
            We don't just build automations, we transform how your business operates. Here's what makes us different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-[#3f79ff]/20 rounded-lg">
                    <benefit.icon className="h-6 w-6 text-[#3f79ff]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#fcbf5b] mb-2">{stat.number}</div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}
