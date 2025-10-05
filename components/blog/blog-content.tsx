"use client";

import sanitizeHtml from "sanitize-html";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  // Step 1: Clean the content
  const cleanContent = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "strong",
      "em",
      "code",
      "pre",
      "span",
      "a",
      "img",
      "br",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
      code: ["class"],
      span: ["class"],
    },
    disallowedTagsMode: "discard", // strip iframe/script completely
  });

  // Add IDs to headings so TOC can link
  let headingCount = 0;

  const withIds = cleanContent.replace(
    /<h([1-6])([^>]*)>(.*?)<\/h\1>/g,
    (match, level, attrs, inner) => {
      headingCount++;
      const id = `heading-${headingCount}`;
      return `<h${level} id="${id}"${attrs} class="group scroll-mt-24">${inner}</h${level}>`;
    }
  );

  // const withIds = cleanContent.replace(
  //   /<h([1-6])([^>]*)>(.*?)<\/h\1>/g,
  //   (match, level, attrs, inner) => {
  //     headingCount++;
  //     const id = `heading-${headingCount}`;
  //     return `
  //     <h${level} id="${id}"${attrs} class="group scroll-mt-24">
  //       ${inner}
  //       <a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-100 transition text-[#3f79ff]">#</a>
  //     </h${level}>
  //   `;
  //   }
  // );

  // Step 2: Process code blocks
  const processedContent = processContent(withIds);

  return (
    <div className="prose prose-invert prose prose-lg max-w-none list-disc list-outside marker:text-gray-400 blog-content">
      <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      {/* {processedContent} */}
      {/* jdkjshdkjh */}
    </div>
  );
}

function processContent(content: string): string {
  return content.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (match, language, code) => {
      const id = Math.random().toString(36).substr(2, 9);
      return `
        <div class="collapsible-code-block" data-language="${language}" data-id="${id}">
          <div class="code-header">
            <span class="language-label">${language}</span>
            <button class="toggle-button" onclick="toggleCodeBlock('${id}')">
              <span class="chevron">▼</span>
              <span class="toggle-text">Collapse</span>
            </button>
            <button class="copy-button" onclick="copyCode('${id}')">
              <span class="copy-icon">📋</span>
              Copy
            </button>
          </div>
          <pre class="code-content" id="code-${id}"><code class="language-${language}">${code}</code></pre>
        </div>
      `;
    }
  );
}

// Add global functions for code block interactions
if (typeof window !== "undefined") {
  (window as any).toggleCodeBlock = (id: string) => {
    const codeContent = document.getElementById(`code-${id}`);
    const toggleButton = document.querySelector(
      `[data-id="${id}"] .toggle-button`
    );
    const chevron = toggleButton?.querySelector(".chevron");
    const toggleText = toggleButton?.querySelector(".toggle-text");

    if (codeContent && chevron && toggleText) {
      if (codeContent.style.display === "none") {
        codeContent.style.display = "block";
        chevron.textContent = "▼";
        toggleText.textContent = "Collapse";
      } else {
        codeContent.style.display = "none";
        chevron.textContent = "▶";
        toggleText.textContent = "Expand";
      }
    }
  };

  (window as any).copyCode = async (id: string) => {
    const codeContent = document.getElementById(`code-${id}`);
    const copyButton = document.querySelector(`[data-id="${id}"] .copy-button`);

    if (codeContent && copyButton) {
      try {
        await navigator.clipboard.writeText(codeContent.textContent || "");
        copyButton.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        setTimeout(() => {
          copyButton.innerHTML = '<span class="copy-icon">📋</span> Copy';
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  };
}
