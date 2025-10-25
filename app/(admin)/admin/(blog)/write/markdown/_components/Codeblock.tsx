import React, { useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css"; // Or your preferred theme
// import "prismjs/themes/prism-coy.css"; // Or your preferred theme
import "prismjs/components/prism-jsx.js"; // Import language components as needed
import { Check, Copy } from "lucide-react";
// If using plugins like line-numbers:
// import "prismjs/plugins/line-numbers/prism-line-numbers.js";
// import "prismjs/plugins/line-numbers/prism-line-numbers.css";

const highlightCodePrism = (code: string, language: string) => {
  if (Prism.languages[language]) {
    return Prism.highlight(code, Prism.languages[language], language);
  }
};

export default function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCodePrism(value, language);
  const lines = value.split("\n");

  return (
    <div className="relative group mb-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between bg-[#1e2937] px-4 py-2 rounded-t-lg border-b border-[#374151]">
        <span className="text-xs text-gray-400 font-mono uppercase">
          {language || "text"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-2 px-3 py-1 rounded bg-[#374151] hover:bg-[#4b5563] text-white text-xs transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex bg-[#1e2937] rounded-b-lg overflow-hidden">
        {/* Line numbers */}
        <div className="flex flex-col py-4 px-3 bg-[#161e2b] text-gray-500 text-sm font-mono select-none border-r border-[#374151]">
          {lines.map((_, index) => (
            <div key={index} className="leading-6 text-right">
              {index + 1}
            </div>
          ))}
        </div>
        {/* Code content */}
        <pre className="flex-1 p-4 overflow-x-auto">
          <code
            className={`text-sm font-mono leading-6 ${language ? `language-${language}` : ""}`}
            dangerouslySetInnerHTML={{
              __html: highlightedCode,
            }}
          />
        </pre>
      </div>
    </div>
  );
}

// export default Codeblock
