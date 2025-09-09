"use client"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: processContent(content) }} className="blog-content" />
    </div>
  )
}

function processContent(content: string): string {
  // Process code blocks to make them collapsible
  return content.replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
    const id = Math.random().toString(36).substr(2, 9)
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
      `
  })
}

// Add global functions for code block interactions
if (typeof window !== "undefined") {
  ;(window as any).toggleCodeBlock = (id: string) => {
    const codeContent = document.getElementById(`code-${id}`)
    const toggleButton = document.querySelector(`[data-id="${id}"] .toggle-button`)
    const chevron = toggleButton?.querySelector(".chevron")
    const toggleText = toggleButton?.querySelector(".toggle-text")

    if (codeContent && chevron && toggleText) {
      if (codeContent.style.display === "none") {
        codeContent.style.display = "block"
        chevron.textContent = "▼"
        toggleText.textContent = "Collapse"
      } else {
        codeContent.style.display = "none"
        chevron.textContent = "▶"
        toggleText.textContent = "Expand"
      }
    }
  }
  ;(window as any).copyCode = async (id: string) => {
    const codeContent = document.getElementById(`code-${id}`)
    const copyButton = document.querySelector(`[data-id="${id}"] .copy-button`)

    if (codeContent && copyButton) {
      try {
        await navigator.clipboard.writeText(codeContent.textContent || "")
        copyButton.innerHTML = '<span class="copy-icon">✓</span> Copied!'
        setTimeout(() => {
          copyButton.innerHTML = '<span class="copy-icon">📋</span> Copy'
        }, 2000)
      } catch (err) {
        console.error("Failed to copy code:", err)
      }
    }
  }
}
