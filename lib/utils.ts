import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// export function highlightCode(code: string, language: string): string {
//   const keywords: Record<string, string[]> = {
//     javascript: [
//       "const",
//       "let",
//       "var",
//       "function",
//       "return",
//       "if",
//       "else",
//       "for",
//       "while",
//       "class",
//       "import",
//       "export",
//       "from",
//       "async",
//       "await",
//       "try",
//       "catch",
//       "new",
//       "this",
//       "typeof",
//       "instanceof",
//     ],
//     typescript: [
//       "const",
//       "let",
//       "var",
//       "function",
//       "return",
//       "if",
//       "else",
//       "for",
//       "while",
//       "class",
//       "import",
//       "export",
//       "from",
//       "async",
//       "await",
//       "try",
//       "catch",
//       "new",
//       "this",
//       "typeof",
//       "instanceof",
//       "interface",
//       "type",
//       "enum",
//       "public",
//       "private",
//       "protected",
//     ],
//     python: [
//       "def",
//       "class",
//       "if",
//       "elif",
//       "else",
//       "for",
//       "while",
//       "return",
//       "import",
//       "from",
//       "as",
//       "try",
//       "except",
//       "finally",
//       "with",
//       "lambda",
//       "yield",
//       "async",
//       "await",
//     ],
//     java: [
//       "public",
//       "private",
//       "protected",
//       "class",
//       "interface",
//       "extends",
//       "implements",
//       "new",
//       "return",
//       "if",
//       "else",
//       "for",
//       "while",
//       "try",
//       "catch",
//       "finally",
//       "throw",
//       "throws",
//     ],
//     css: [
//       "color",
//       "background",
//       "border",
//       "margin",
//       "padding",
//       "display",
//       "flex",
//       "grid",
//       "position",
//       "width",
//       "height",
//     ],
//     html: [],
//   };

//   const lang = language.toLowerCase();
//   const langKeywords = keywords[lang] || keywords.javascript;

//   let highlighted = code
//     // Strings
//     .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="hljs-string">$1</span>')
//     // Comments
//     .replace(
//       /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
//       '<span class="hljs-comment">$1</span>'
//     )
//     // Numbers
//     .replace(/\b(\d+)\b/g, '<span class="hljs-number">$1</span>')
//     // Functions
//     .replace(
//       /\b([a-zA-Z_]\w*)\s*(?=\()/g,
//       '<span class="hljs-function">$1</span>'
//     );

//   // Keywords
//   langKeywords.forEach((keyword) => {
//     const regex = new RegExp(`\\b(${keyword})\\b`, "g");
//     highlighted = highlighted.replace(
//       regex,
//       '<span class="hljs-keyword">$1</span>'
//     );
//   });

//   return highlighted;
// }

export function highlightCode(code: string, language: string): string {
  const colors = {
    keyword: "#569cd6",
    string: "#ce9178",
    comment: "#6a9955",
    number: "#b5cea8",
    function: "#dcdcaa",
    class: "#4ec9b0",
    operator: "#d4d4d4",
    variable: "#9cdcfe",
    constant: "#4fc1ff",
    property: "#9cdcfe",
  };

  // Escape HTML first
  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let highlighted = escapeHtml(code);

  // Define patterns in the correct order
  const patterns = [
    // Comments first
    {
      regex: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|<!--[\s\S]*?-->)/gm,
      color: colors.comment,
    },
    // Strings
    {
      regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,
      color: colors.string,
    },
    // Numbers
    { regex: /\b(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\b/g, color: colors.number },
    // Keywords
    {
      regex:
        /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly|def|lambda|yield|with|as|pass|break|continue|switch|case|default|do|goto|package|void|int|float|double|boolean|char|string|true|false|null|undefined|None|True|False|self)\b/g,
      color: colors.keyword,
    },
    // Function calls
    { regex: /\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, color: colors.function },
    // Class names (PascalCase)
    { regex: /\b([A-Z][a-zA-Z0-9]*)\b/g, color: colors.class },
    // Constants (UPPER_CASE)
    { regex: /\b([A-Z_][A-Z0-9_]*)\b/g, color: colors.constant },
    // Operators
    { regex: /([+\-*/%=<>!&|^~?:]+)/g, color: colors.operator },
  ];

  // Wrap matches with spans
  patterns.forEach(({ regex, color }) => {
    highlighted = highlighted.replace(
      regex,
      (match) => `<span style="color: ${color}">${match}</span>`
    );
  });

  return highlighted;
}

export function processMarkdown(text: string): string {
  return text.replace(/@\[youtube\]$$(.*?)$$/g, (_, url) => {
    return `<youtube-embed url="${url}"></youtube-embed>`;
  });
}

export function getVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

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
