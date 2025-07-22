"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export const fadeInUp = (element: string | Element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay,
      ease: "power2.out",
    },
  )
}

export const fadeInLeft = (element: string | Element, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: "power2.out",
    },
  )
}

export const staggerFadeIn = (elements: string, delay = 0) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      stagger: 0.1,
      ease: "power2.out",
    },
  )
}

export const scrollTriggerFadeIn = (element: string | Element) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    },
  )
}

export const marqueeAnimation = (element: string | Element) => {
  const tl = gsap.timeline({ repeat: -1 })
  tl.to(element, {
    x: "-50%",
    duration: 20,
    ease: "none",
  })
  return tl
}
