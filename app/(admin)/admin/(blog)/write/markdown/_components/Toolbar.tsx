"use client";

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
  Underline,
  Strikethrough,
  Undo,
  Redo,
  Megaphone,
} from "lucide-react";
import type { ToolbarProps } from "@/lib/types";

export default function Toolbar({
  onInsertMarkdown,
  onImageClick,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const insertCTA = () => {
    const ctaTemplate = `
    <div style="background: linear-gradient(135deg, #3f79ff 0%, #ca6678 100%); padding: 2rem; border-radius: 0.5rem; text-align: center; margin: 2rem 0;">
      <h3 style="color: white; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Your CTA Title Here</h3>
      <p style="color: white; margin-bottom: 1.5rem;">Add your compelling message here to encourage action.</p>
      <a href="https://your-link.com" style="display: inline-block; background: white; color: #3f79ff; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: bold; text-decoration: none;">Click Here</a>
    </div>
    `;

    onInsertMarkdown(ctaTemplate);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold (Ctrl+B)",
      action: () => onInsertMarkdown("**", "**"),
      shortcut: "Ctrl+B",
    },
    {
      icon: Italic,
      label: "Italic (Ctrl+I)",
      action: () => onInsertMarkdown("*", "*"),
      shortcut: "Ctrl+I",
    },
    {
      icon: Underline,
      label: "Underline (Ctrl+U)",
      action: () => onInsertMarkdown("<u>", "</u>"),
      shortcut: "Ctrl+U",
    },
    {
      icon: Strikethrough,
      label: "Strikethrough (Ctrl+Shift+X)",
      action: () => onInsertMarkdown("~~", "~~"),
      shortcut: "Ctrl+Shift+X",
    },
    {
      icon: Link,
      label: "Link (Ctrl+K)",
      action: () => onInsertMarkdown("[", "](url)"),
      shortcut: "Ctrl+K",
    },
    {
      icon: Heading,
      label: "Heading (Ctrl+H)",
      action: () => onInsertMarkdown("## "),
      shortcut: "Ctrl+H",
    },
    {
      icon: Quote,
      label: "Quote (Ctrl+Shift+Q)",
      action: () => onInsertMarkdown("> "),
      shortcut: "Ctrl+Shift+Q",
    },
    {
      icon: Code,
      label: "Code Block (Ctrl+Shift+C)",
      action: () => onInsertMarkdown("```\n", "\n```"),
      shortcut: "Ctrl+Shift+C",
    },
    { icon: ImageIcon, label: "Image", action: onImageClick },
    {
      icon: Table,
      label: "Table",
      action: () =>
        onInsertMarkdown(
          "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n"
        ),
    },
    {
      icon: Youtube,
      label: "YouTube",
      action: () => onInsertMarkdown("@[youtube](", ")"),
    },
    {
      icon: Minus,
      label: "Divider",
      action: () => onInsertMarkdown("\n---\n"),
    },
    {
      icon: CheckSquare,
      label: "Checklist",
      action: () => onInsertMarkdown("- [ ] "),
    },
    { icon: Megaphone, label: "CTA Block", action: insertCTA },
    {
      icon: Undo,
      label: "Undo (Ctrl+Z)",
      action: onUndo,
      disabled: !canUndo,
      shortcut: "Ctrl+Z",
    },
    {
      icon: Redo,
      label: "Redo (Ctrl+Shift+Z)",
      action: onRedo,
      disabled: !canRedo,
      shortcut: "Ctrl+Shift+Z",
    },
  ];

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg w-full shadow-lg  "
        style={{
          background: "linear-gradient(135deg, #ca6678 0%, #fcbf5b 100%)",
        }}
      >
        {toolbarButtons.map((button, index) => (
          <button
            type="button"
            key={index}
            onClick={button.action}
            disabled={button.disabled}
            className="p-2 rounded hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={button.label}
            aria-label={button.label}
          >
            <button.icon className="w-5 h-5 text-white" />
          </button>
        ))}
      </div>
    </div>
  );
}
