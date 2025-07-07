"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { fadeInUp, staggerFadeIn } from "@/lib/animations"

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fadeInUp(".hero-title", 0.3)
    fadeInUp(".hero-subtitle", 0.5)
    staggerFadeIn(".hero-buttons > *", 0.7)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-[#09111f] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#09111f] via-[#0f1a2e] to-[#09111f]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#3f79ff] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#fcbf5b] rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Ideas Into{" "}
            <span className="bg-gradient-to-r from-[#3f79ff] to-[#fcbf5b] bg-clip-text text-transparent">
              Solutions
            </span>{" "}
            that work for you
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            From AI automations to stunning websites that work for you daily
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#ca6678] to-[#fcbf5b] hover:from-[#b85a6a] hover:to-[#e6ac52] text-white font-medium px-8 py-3 text-lg"
            >
              <Link href="/contact">Book Consultation</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[#3f79ff] text-[#3f79ff] hover:bg-[#3f79ff] hover:text-white px-8 py-3 text-lg bg-transparent"
            >
              <Link href="/watch-us-build">Watch Us Build</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
