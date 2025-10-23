"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Link,
  Heading,
  Quote,
  Code,
  ImageIcon,
  Table,
  Youtube,
  Minus,
  CheckSquare,
  X,
  Upload,
  Underline,
  Strikethrough,
  Undo,
  Redo,
  Copy,
  Check,
} from "lucide-react";

const AUTOSAVE_DELAY = 2000;
const STORAGE_KEY = "markdown-editor-content";
const TITLE_STORAGE_KEY = "markdown-editor-title";

function highlightCode(code: string, language: string): string {
  const keywords: Record<string, string[]> = {
    javascript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "from",
      "async",
      "await",
      "try",
      "catch",
      "new",
      "this",
      "typeof",
      "instanceof",
    ],
    typescript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "import",
      "export",
      "from",
      "async",
      "await",
      "try",
      "catch",
      "new",
      "this",
      "typeof",
      "instanceof",
      "interface",
      "type",
      "enum",
      "public",
      "private",
      "protected",
    ],
    python: [
      "def",
      "class",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "return",
      "import",
      "from",
      "as",
      "try",
      "except",
      "finally",
      "with",
      "lambda",
      "yield",
      "async",
      "await",
    ],
    java: [
      "public",
      "private",
      "protected",
      "class",
      "interface",
      "extends",
      "implements",
      "new",
      "return",
      "if",
      "else",
      "for",
      "while",
      "try",
      "catch",
      "finally",
      "throw",
      "throws",
    ],
    css: [
      "color",
      "background",
      "border",
      "margin",
      "padding",
      "display",
      "flex",
      "grid",
      "position",
      "width",
      "height",
    ],
    html: [],
  };

  const lang = language.toLowerCase();
  const langKeywords = keywords[lang] || keywords.javascript;

  let highlighted = code
    // Strings
    .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="hljs-string">$1</span>')
    // Comments
    .replace(
      /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
      '<span class="hljs-comment">$1</span>'
    )
    // Numbers
    .replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>')
    // Functions
    .replace(
      /\b([a-zA-Z_]\w*)\s*(?=\()/g,
      '<span class="hljs-function">$1</span>'
    );

  // Keywords
  langKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b(${keyword})\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      '<span class="hljs-keyword">$1</span>'
    );
  });

  return highlighted;
}

function ImageUploadModal({
  isOpen,
  onClose,
  onInsert,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a simulated Dev.to-style URL
    const randomId = Math.random().toString(36).substring(2, 15);
    const simulatedUrl = `https://dev-to-uploads.s3.amazonaws.com/uploads/articles/${randomId}.png`;

    setImageUrl(simulatedUrl);
    setAltText(file.name.replace(/\.[^/.]+$/, ""));
    setIsUploading(false);
  };

  const handleInsert = () => {
    if (imageUrl) {
      onInsert(imageUrl, altText || "Image description");
      setImageUrl("");
      setAltText("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1520] border border-[#1a2332] rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Insert Image</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full px-3 py-2 bg-[#09111f] border border-[#1a2332] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image description"
              className="w-full px-3 py-2 bg-[#09111f] border border-[#1a2332] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">OR</span>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#243044] text-white rounded transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Select from Computer"}
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleInsert}
              disabled={!imageUrl}
              className="flex-1 px-4 py-2 bg-[#3f79ff] hover:bg-[#3366cc] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#1a2332] hover:bg-[#243044] text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function YouTubeEmbed({ url }: { url: string }) {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getVideoId(url);

  if (!videoId) {
    return <p className="text-gray-400 italic">Invalid YouTube URL</p>;
  }

  return (
    <div className="relative w-full mb-4" style={{ paddingBottom: "56.25%" }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCode(value, language);

  return (
    <div className="relative group mb-4">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 p-2 rounded bg-[#1a2332] hover:bg-[#243044] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Copy code"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="!bg-[#1a2332] rounded-lg p-4 overflow-x-auto">
        <code
          className={language ? `language-${language}` : ""}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  );
}

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    console.log("[v0] MarkdownEditor mounted");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedTitle = localStorage.getItem(TITLE_STORAGE_KEY);
    if (saved) {
      setMarkdown(saved);
      setHistory([saved]);
      setHistoryIndex(0);
    }
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, markdown);
      localStorage.setItem(TITLE_STORAGE_KEY, title);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timer);
  }, [markdown, title]);

  useEffect(() => {
    if (markdown !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(markdown);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [markdown]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMarkdown(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMarkdown(history[historyIndex + 1]);
    }
  };

  const insertMarkdown = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    setMarkdown(newText);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // This is the toolbar button configuration
  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertMarkdown("<u>", "</u>"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertMarkdown("~~", "~~"),
    },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: Heading, label: "Heading", action: () => insertMarkdown("## ") },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("> ") },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("```\n", "\n```"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => setIsImageModalOpen(true),
    },
    {
      icon: Table,
      label: "Table",
      action: () =>
        insertMarkdown(
          "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n"
        ),
    },
    {
      icon: Youtube,
      label: "YouTube",
      action: () => insertMarkdown("@[youtube](", ")"),
    },
    { icon: Minus, label: "Divider", action: () => insertMarkdown("\n---\n") },
    {
      icon: CheckSquare,
      label: "Checklist",
      action: () => insertMarkdown("- [ ] "),
    },
    { icon: Undo, label: "Undo", action: handleUndo },
    { icon: Redo, label: "Redo", action: handleRedo },
  ];

  const handleImageInsert = (url: string, alt: string) => {
    insertMarkdown(`![${alt}](${url})`);
  };

  const processMarkdown = (text: string) => {
    return text.replace(/@\[youtube\]$$(.*?)$$/g, (_, url) => {
      return `<youtube-embed url="${url}"></youtube-embed>`;
    });
  };

  return (
    <div className="min-h-screen bg-[#09111f]">
      <header className="border-b border-[#1a2332]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Post Title Here..."
            className="w-full text-4xl font-bold text-white bg-transparent border-none outline-none mb-4 placeholder:text-gray-600"
          />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-400">Create Post</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("edit")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "edit"
                    ? "bg-[#3f79ff] text-white"
                    : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "preview"
                    ? "bg-[#3f79ff] text-white"
                    : "bg-[#1a2332] text-gray-400 hover:text-white"
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div
          className="flex flex-wrap gap-2 p-3 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #ca6678 0%, #fcbf5b 100%)",
          }}
        >
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className="p-2 rounded hover:bg-white/20 transition-colors"
              title={button.label}
              aria-label={button.label}
            >
              <button.icon className="w-5 h-5 text-white" />
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {viewMode === "edit" ? (
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Edit</h2>
              <span className="text-sm text-gray-400">Auto-saving...</span>
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[600px] p-4 rounded-lg font-mono text-sm resize-none bg-[#0d1520] text-white border border-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
              placeholder="Write your markdown here..."
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-white">Preview</h2>
            </div>
            <div className="w-full min-h-[600px] p-4 rounded-lg prose prose-invert max-w-none bg-[#0d1520] border border-[#1a2332]">
              {title && (
                <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
              )}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-white mb-4"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-white mb-3"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-bold text-white mb-2"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-lg font-bold text-white mb-2"
                      {...props}
                    />
                  ),
                  h5: ({ node, ...props }) => (
                    <h5
                      className="text-base font-bold text-white mb-2"
                      {...props}
                    />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6
                      className="text-sm font-bold text-white mb-2"
                      {...props}
                    />
                  ),
                  p: ({ node, children, ...props }) => {
                    const content = String(children);

                    const youtubeMatch = content.match(
                      /<youtube-embed url="(.*?)"><\/youtube-embed>/
                    );
                    if (youtubeMatch) {
                      return <YouTubeEmbed url={youtubeMatch[1]} />;
                    }

                    return (
                      <p
                        className="text-gray-200 mb-4 leading-relaxed"
                        {...props}
                      >
                        {children}
                      </p>
                    );
                  },
                  a: ({ node, ...props }) => (
                    <a className="text-[#3f79ff] hover:underline" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside text-gray-200 mb-4 space-y-1"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside text-gray-200 mb-4 space-y-1"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-[#3f79ff] pl-4 italic text-gray-300 mb-4"
                      {...props}
                    />
                  ),
                  code: ({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }: any) => {
                    const content = String(children).replace(/\n$/, "");
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";

                    if (!inline && content.includes("<iframe")) {
                      return (
                        <div
                          className="mb-4"
                          dangerouslySetInnerHTML={{ __html: content }}
                        />
                      );
                    }

                    return inline ? (
                      <code
                        className="px-1.5 py-0.5 rounded text-sm font-mono bg-[#1a2332] text-[#fcbf5b]"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <CodeBlock language={language} value={content} />
                    );
                  },
                  pre: ({ node, ...props }) => (
                    <pre className="mb-4" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table
                        className="min-w-full border border-[#1a2332]"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-[#1a2332]" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-[#1a2332] px-4 py-2 text-left text-white font-semibold"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-[#1a2332] px-4 py-2 text-gray-200"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-6 border-[#1a2332]" {...props} />
                  ),
                  img: ({ node, alt, ...props }) => (
                    <figure className="my-6 flex flex-col items-center">
                      <img
                        className="rounded-lg max-w-full h-auto"
                        alt={alt}
                        {...props}
                      />
                      {alt && (
                        <figcaption className="mt-2 text-sm text-gray-400 italic text-center">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  ),
                }}
              >
                {processMarkdown(markdown) ||
                  "*Nothing to preview yet. Start typing in the editor!*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleImageInsert}
      />
    </div>
  );
}
