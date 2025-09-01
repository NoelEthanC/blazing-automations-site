/**
 * Centralized event registry for Google Analytics tracking
 * This provides a structured way to define and maintain all GA events
 */

export const events = {
  // Hero section events
  hero: {
    bookConsult: () => ({
      category: "hero",
      action: "book_consult",
      label: "consultation_booking",
    }),
    subscribe: () => ({
      category: "hero",
      action: "subscribe",
      label: "newsletter_signup",
    }),
    youtubePlay: () => ({
      category: "hero",
      action: "youtube_play",
      label: "watch_us_build",
    }),
    scrollToResources: () => ({
      category: "hero",
      action: "scroll_to_resources",
      label: "get_templates_click",
    }),
    watchUsBuild: () => ({
      category: "hero",
      action: "watch_us_build",
      label: "external_youtube_link",
    }),
  },

  // Contact section events
  contact: {
    sendMessage: (hasCompany = false) => ({
      category: "contact",
      action: "send_message",
      label: hasCompany ? "with_company" : "without_company",
    }),
    bookCalendar: () => ({
      category: "contact",
      action: "book_calendar",
      label: "calendly_booking",
    }),
    formSubmit: () => ({
      category: "contact",
      action: "form_submit",
      label: "contact_form",
    }),
  },

  // Resources events
  resources: {
    view: (slug: string) => ({
      category: "resources",
      action: "view",
      label: slug,
    }),
    download: (resourceId: string, actionType: "download_now" | "send_email" = "download_now") => ({
      category: "resources",
      action: "download",
      label: `${resourceId}_${actionType}`,
    }),
    relatedClick: (fromSlug: string, toSlug: string) => ({
      category: "resources",
      action: "related_click",
      label: `${fromSlug}_to_${toSlug}`,
    }),
    filterApply: (filterType: string, filterValue: string) => ({
      category: "resources",
      action: "filter_apply",
      label: `${filterType}_${filterValue}`,
    }),
  },

  // Navigation events
  navigation: {
    menuClick: (menuItem: string) => ({
      category: "navigation",
      action: "menu_click",
      label: menuItem,
    }),
    logoClick: () => ({
      category: "navigation",
      action: "logo_click",
      label: "home_navigation",
    }),
    mobileMenuToggle: (isOpen: boolean) => ({
      category: "navigation",
      action: "mobile_menu_toggle",
      label: isOpen ? "open" : "close",
    }),
  },

  // Admin events (for internal tracking)
  admin: {
    login: () => ({
      category: "admin",
      action: "login",
      label: "admin_access",
    }),
    resourceCreate: () => ({
      category: "admin",
      action: "resource_create",
      label: "new_resource",
    }),
    resourceEdit: (resourceId: string) => ({
      category: "admin",
      action: "resource_edit",
      label: resourceId,
    }),
    exportLeads: () => ({
      category: "admin",
      action: "export_leads",
      label: "csv_download",
    }),
  },
} as const

/**
 * Helper function to get event parameters
 * Usage: trackEvent(...Object.values(events.hero.bookConsult()))
 */
export type EventParams = {
  category: string
  action: string
  label?: string
  value?: number
}

/**
 * Type-safe event tracking helper
 * Usage: trackEventSafe(events.hero.bookConsult())
 */
export function getEventParams(eventFn: () => EventParams): [string, string, string?, number?] {
  const { category, action, label, value } = eventFn()
  return [category, action, label, value]
}

/**
 * How to add new events:
 *
 * 1. Add a new section or extend existing sections in the events object
 * 2. Follow the pattern: action: (params?) => ({ category, action, label })
 * 3. Use the event in components: trackEvent(...Object.values(events.section.action(...)))
 *
 * Example:
 * // Add to registry
 * blog: {
 *   read: (postSlug: string) => ({
 *     category: 'blog',
 *     action: 'read',
 *     label: postSlug
 *   })
 * }
 *
 * // Use in component
 * trackEvent(...Object.values(events.blog.read('my-post-slug')))
 */
