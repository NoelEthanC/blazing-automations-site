"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Globe,
  Workflow,
  ScanSearch,
  LayoutDashboard,
  Plug,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const tools = [
    {
      name: "Chatbots & AI Agents",
      description:
        "We develop task-specific AI agents and conversational chatbots that integrate seamlessly with your tools, APIs, and workflows.",
      icon: Brain,
    },
    {
      name: "Business Websites",
      description:
        "We design and build responsive, fast, and SEO-ready websites that communicate your brand and convert visitors to clients.",
      icon: Globe,
    },
    {
      name: "Automated AI Workflows",
      description:
        "We design end-to-end automations using tools like n8n to streamline repetitive tasks, connect apps, and scale operations efficiently.",
      icon: Workflow,
    },
    {
      name: "AI-Powered Data Systems",
      description:
        "We create intelligent systems that use AI for document processing, contextual search (RAG), classification, and decision support.",
      icon: ScanSearch,
    },
    {
      name: "Custom Web Applications",
      description:
        "We build scalable web apps using Laravel, React, and Supabase — tailored for dashboards, portals, or SaaS platforms.",
      icon: LayoutDashboard,
    },
    {
      name: "API Integrations",
      description:
        "We connect third-party services and internal APIs to your app with secure, well-documented, and scalable integration logic.",
      icon: Plug,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".tool-card");
      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card as Element,
            start: "top 90%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="py-28 px-4" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-white mb-6">
            <span className="gradient-text">What We</span> Build
          </h2>
          <p className="font-inter text-xl text-slate-text max-w-3xl mx-auto">
            We're experts with the world's most powerful automation tools. Let
            us build your custom workflow ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.name}
              className="tool-card relative bg-midnight-blue/50 border border-secondary-blue/20 p-6 hover:border-secondary-blue/60 transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              {/* Blue Glow */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-secondary-blue/20 rounded-full blur-xl opacity-60 transition-opacity duration-500" />
              <div className="text-center relative z-10">
                <div className="text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-8 h-8 mx-auto text-secondary-blue/70 group-hover:text-secondary-blue" />
                </div>
                <h3 className="font-space-grotesk font-bold text-xl text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-slate-text">{tool.description}</p>
                <div className="mt-4 w-full h-1 bg-gray-text/20 rounded">
                  <div className="h-full bg-light-blue/70 rounded w-full transition-all duration-1000 group-hover:w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
