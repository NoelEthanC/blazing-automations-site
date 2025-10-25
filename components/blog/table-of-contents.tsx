"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for ##, 3 for ###
}

interface TableOfContentsProps {
  content: string; // markdown text
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // 1. Match markdown headings (## and ###)
    const headingRegex = /^(#{2,3})\s+(.*)$/gm;
    const headings: TocItem[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length; // number of #
      const text = match[2].trim();

      // 2. Generate the same slug ID as BlogContent
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      headings.push({ id, text, level });
    }

    setToc(headings);
  }, [content]);

  // 3. Observe active heading in viewport
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  // 4. Smooth scroll to section
  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = 100; // adjust for sticky navbar height
      const y = el.getBoundingClientRect().top + window.scrollY - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      router.replace(`#${id}`, { scroll: false });
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
              item.level === 2 ? "ml-2 font-medium" : "ml-4"
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
