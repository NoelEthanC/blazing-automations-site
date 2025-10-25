"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { highlightCode, processMarkdown, getVideoId } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Or any other style
import type { PreviewProps } from "@/lib/types";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CodeBlock from "./Codeblock";

function YouTubeEmbed({ url }: { url: string }) {
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

export default function Preview({ markdown, title, isEditor }: PreviewProps) {
  return (
    <div className="flex flex-col">
      {isEditor && (
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-white">Preview</h2>
        </div>
      )}
      <div
        className={`w-full min-h-[600px] p-4 rounded-lg prose prose-invert max-w-none ${isEditor && `bg-[#0d1520] border border-[#1a2332]`} `}
      >
        {title && isEditor && (
          <h1 className="text-4xl font-bold text-white mb-8">{title}</h1>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => (
              <h1 className="text-3xl font-bold text-white mb-4" {...props} />
            ),
            h2: ({ node, ...props }) => {
              const id = props.children
                ?.toString()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, ""); // convert heading text to slug
              return <h2 id={id} {...props} />;
            },
            h3: ({ node, ...props }) => {
              const id = props.children
                ?.toString()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]+/g, "");
              return <h3 id={id} {...props} />;
            },
            h4: ({ node, ...props }) => (
              <h4 className="text-lg font-bold text-white mb-2" {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 className="text-base font-bold text-white mb-2" {...props} />
            ),
            h6: ({ node, ...props }) => (
              <h6 className="text-sm font-bold text-white mb-2" {...props} />
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
                  className="text-gray-200 mb-4 leading-relaxed text-lg"
                  {...props}
                >
                  {children}
                </p>
              );
            },
            a: ({ node, ...props }) => (
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3f79ff] underline"
                {...props}
              />
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
            code: ({ node, inline, className, children, ...props }: any) => {
              const content = String(children).replace(/\n$/, "");
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              const hasLang = Boolean(match);
              // Determine block vs inline:
              const isBlock = !inline && hasLang;

              if (isBlock) {
                return <CodeBlock language={match![1]} value={content} />;
              }
              if (!inline && content.includes("<iframe")) {
                return (
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              }

              if (!inline && content.includes("<div")) {
                return (
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              }

              // inline or fallback
              return (
                <code
                  className={`${className ?? ""} px-0.5 py-0.5 rounded text-sm font-mono bg-[#1e2937] text-[#ce9178] border border-[#374151]`}
                  {...props}
                >
                  {children}
                </code>
              );
            },

            pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
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
  );
}
