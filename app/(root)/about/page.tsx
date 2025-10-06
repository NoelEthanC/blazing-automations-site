"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Users, Zap } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { fadeInUp, staggerFadeIn } from "@/lib/animations";

const timeline = [
  {
    year: "2020",
    title: "Started Freelancing",
    description:
      "Began helping small businesses with basic automation and web development projects.",
  },
  {
    year: "2021",
    title: "AI Integration Focus",
    description:
      "Specialized in integrating AI tools and automation platforms for business efficiency.",
  },
  {
    year: "2022",
    title: "Blazing Automations Founded",
    description:
      "Officially launched the company to serve growing demand for automation solutions.",
  },
  {
    year: "2023",
    title: "50+ Projects Completed",
    description:
      "Reached milestone of transforming over 50 businesses with custom automation solutions.",
  },
  {
    year: "2024",
    title: "Enterprise Solutions",
    description:
      "Expanded to serve enterprise clients with complex automation and AI integration needs.",
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Every automation we build is designed to deliver measurable business impact and ROI.",
  },
  {
    icon: Users,
    title: "Client-Centric",
    description:
      "We prioritize understanding your unique needs and building solutions that fit perfectly.",
  },
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We stay ahead of the curve, using the latest AI and automation technologies available.",
  },
  {
    icon: CheckCircle,
    title: "Quality Assured",
    description:
      "Rigorous testing and optimization ensure your automations work flawlessly, 24/7.",
  },
];

export default function AboutPage() {
  useEffect(() => {
    fadeInUp(".about-hero", 0.2);
    staggerFadeIn(".timeline-item", 0.5);
    staggerFadeIn(".value-card", 0.7);
  }, []);

  return (
    <main className="min-h-screen bg-[#09111f] pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="about-hero">
              <Badge className="bg-[#3f79ff]/20 text-[#3f79ff] border-[#3f79ff]/30 mb-6">
                About Blazing Automations
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                I'm <span className="text-[#fcbf5b]">Noel Ethan</span>, and I
                help businesses work smarter, not harder
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                After seeing countless businesses struggle with repetitive tasks
                and inefficient processes, I founded Blazing Automations to
                bridge the gap between cutting-edge AI technology and practical
                business solutions.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                My mission is simple: transform how businesses operate by
                implementing intelligent automation that saves time, reduces
                errors, and scales effortlessly. Every solution I build is
                designed with your success in mind.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#3f79ff]/20 to-[#fcbf5b]/20 rounded-2xl p-8 flex items-center justify-center">
                <div className="w-full h-full bg-gray-700 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400 text-lg">
                    Professional Photo (Coming soon)
                  </span>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#fcbf5b]/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#3f79ff]/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <AnimatedSection className="py-20 bg-[#09111f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Our Mission
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            To democratize business automation by making advanced AI and
            workflow solutions accessible to companies of all sizes. We believe
            every business deserves to operate at peak efficiency, and we're
            here to make that happen through intelligent automation that
            actually works.
          </p>
        </div>
      </AnimatedSection>

      {/* Timeline Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-[#09111f] to-[#0f1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-400">
              From freelance projects to enterprise solutions
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#3f79ff] to-[#fcbf5b]" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`timeline-item flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className="flex-1 px-8">
                    <Card
                      className={`bg-gray-800/50 border-gray-700 ${index % 2 === 0 ? "ml-auto" : "mr-auto"} max-w-md`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center mb-3">
                          <Badge className="bg-[#fcbf5b] text-[#09111f] font-bold mr-3">
                            {item.year}
                          </Badge>
                          <h3 className="text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-gray-400">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-[#fcbf5b] rounded-full border-4 border-[#09111f]" />
                  </div>

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Values Section */}
      <AnimatedSection className="py-20 bg-[#09111f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-400">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="value-card bg-gray-800/50 border-gray-700 hover:border-[#3f79ff] transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#3f79ff]/20 rounded-lg">
                      <value.icon className="h-6 w-6 text-[#3f79ff]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
