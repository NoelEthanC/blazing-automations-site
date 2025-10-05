"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    let headingCount = 0;

    // ✅ Step 1: Add IDs dynamically if not present
    const updatedHtml = content.replace(
      /<h([1-6])([^>]*)>(.*?)<\/h\1>/g,
      (match, level, attrs, inner) => {
        headingCount++;
        const id = `heading-${headingCount}`;
        return `<h${level} id="${id}"${attrs}>${inner}</h${level}>`;
      }
    );

    // ✅ Step 2: Extract headings with IDs
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g;
    const headings: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(updatedHtml)) !== null) {
      headings.push({
        id: match[2],
        text: match[3].replace(/<[^>]*>/g, ""), // Strip inline tags
        level: Number.parseInt(match[1]),
      });
    }

    setToc(headings);
  }, [content]);

  // ✅ Step 3: Highlight active heading on scroll
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const [activeId, setActiveId] = useState<string>("");

  // ✅ Step 4: Smooth scroll with navbar offset
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 100; // adjust to your navbar height
      const y =
        element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-3">
        Table of Contents
      </h3>
      <nav className="space-y-1">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={cn(
              "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
              "hover:bg-gray-700 hover:text-white",
              activeId === item.id
                ? "text-[#3f79ff] bg-[#3f79ff]/10"
                : "text-gray-400",
              item.level === 1 && "font-medium",
              item.level === 2 && "ml-2",
              item.level === 3 && "ml-4",
              item.level === 4 && "ml-6",
              item.level === 5 && "ml-8",
              item.level === 6 && "ml-10"
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
