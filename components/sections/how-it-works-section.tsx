"use client";

import { MessageSquare, Wrench, Rocket } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Tell Us Your Vision",
      description:
        "Share your biggest time-wasters and business goals. We'll identify the perfect automation opportunities.",
    },
    {
      icon: Wrench,
      number: "02",
      title: "We Build Your System",
      description:
        "Our experts craft custom automations tailored to your exact needs. No templates, no shortcuts - just results.",
    },
    {
      icon: Rocket,
      number: "03",
      title: "You Scale Effortlessly",
      description:
        "Watch your business run itself while you focus on strategy, growth, and the work only you can do.",
    },
  ];

  return (
    <section id="process" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-white mb-6">
            <span className="gradient-text">How It</span> Works
          </h2>
          <p className="font-inter text-xl text-slate-text max-w-3xl mx-auto">
            From discovery to deployment - we make automation simple and
            stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="text-center relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-secondary-blue/50 to-transparent transform -translate-x-1/2 z-0"></div>
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-secondary-blue/20 rounded-full flex items-center justify-center relative animate-pulse-glow">
                  <step.icon className="w-8 h-8 text-secondary-blue" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-sunray rounded-full flex items-center justify-center text-midnight-blue font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                <h3 className="font-space-grotesk font-bold text-2xl text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-slate-text leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
