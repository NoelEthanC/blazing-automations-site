"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { scrollTriggerFadeIn } from "@/lib/animations"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fadeInUp" | "fadeInLeft" | "stagger"
}

export function AnimatedSection({ children, className = "", animation = "fadeInUp" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      scrollTriggerFadeIn(ref.current)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
