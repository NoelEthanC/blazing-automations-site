import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleLinkClick = (href: string) => {
  if (href.startsWith("#") || href.includes("/#")) {
    // Scroll to anchor ID
    const id = href.includes("#") ? href.split("#")[1] : href;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If the element is not found, navigate to page with anchor (browser default)
      window.location.href = href;
    }
  } else {
    // Navigate to a new page
    window.location.href = href;
  }
};
