"use client"

import { sendGAEvent } from "@next/third-parties/google"

/**
 * Track a Google Analytics event
 * @param category - Event category (e.g., 'hero', 'contact', 'resources')
 * @param action - Event action (e.g., 'book_consult', 'download', 'view')
 * @param label - Optional event label for additional context
 * @param value - Optional numeric value associated with the event
 */
export function trackEvent(category: string, action: string, label?: string, value?: number) {
  try {
    sendGAEvent("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  } catch (error) {
    // Silently fail in development or if GA is not configured
    if (process.env.NODE_ENV === "development") {
      console.log("GA Event:", { category, action, label, value })
    }
  }
}
