"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g
    const headings: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        id: match[2],
        text: match[3].replace(/<[^>]*>/g, ""), // Strip HTML tags
        level: Number.parseInt(match[1]),
      })
    }

    setToc(headings)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0% -35% 0%" },
    )

    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Table of Contents</h3>
      <nav className="space-y-1">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={cn(
              "block w-full text-left text-sm py-1 px-2 rounded transition-colors",
              "hover:bg-gray-700 hover:text-white",
              activeId === item.id ? "text-[#3f79ff] bg-[#3f79ff]/10" : "text-gray-400",
              item.level === 1 && "font-medium",
              item.level === 2 && "ml-2",
              item.level === 3 && "ml-4",
              item.level === 4 && "ml-6",
              item.level === 5 && "ml-8",
              item.level === 6 && "ml-10",
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  )
}
