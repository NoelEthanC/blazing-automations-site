"use client";

import { Clock, Zap, TrendingUp, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Save 20+ Hours Per Week",
      description:
        "Eliminate repetitive tasks and focus on growing your business instead of managing it.",
    },
    {
      icon: Zap,
      title: "AI-Powered Intelligence",
      description:
        "Smart automations that learn and adapt, making decisions just like your best employee.",
    },
    {
      icon: TrendingUp,
      title: "Infinitely Scalable",
      description:
        "Systems that grow with you - from startup to enterprise without breaking a sweat.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Bank-level security and compliance built into every automation we create.",
    },
  ];

  return (
    <section id="benefits" className="py-20 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-white mb-6">
            <span className="gradient-text">Why Choose</span> Blazing
            Automations?
          </h2>
          <p className="font-inter text-xl text-slate-text max-w-3xl mx-auto">
            We don't just build automations - we transform businesses. Here's
            how we make the magic happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="flex items-start space-x-6 p-6 rounded-xl hover:bg-secondary-blue/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-secondary-blue/20 rounded-lg flex items-center justify-center group-hover:bg-secondary-blue/30 transition-colors">
                  <benefit.icon className="w-6 h-6 text-secondary-blue" />
                </div>
              </div>
              <div>
                <h3 className="font-space-grotesk font-bold text-xl text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 p-6 bg-sunray/20 rounded-xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-sunray">50+</div>
              <div className="text-slate-text text-sm">Automations Built</div>
            </div>
            <div className="w-px h-12 bg-gray-text/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sunray">98%</div>
              <div className="text-slate-text text-sm">Client Satisfaction</div>
            </div>
            <div className="w-px h-12 bg-gray-text/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sunray">24/7</div>
              <div className="text-slate-text text-sm">Automation Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
