"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import { scrollTriggerFadeIn } from "@/lib/animations";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeInUp" | "fadeInLeft" | "stagger";
  id?: string;
}

export function AnimatedSection({
  children,
  id = "#",
  className = "",
  animation = "fadeInUp",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      scrollTriggerFadeIn(ref.current);
    }
  }, []);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
