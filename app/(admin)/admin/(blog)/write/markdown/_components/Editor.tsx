"use client";

import { useEffect } from "react";
import type { EditorProps, ViewMode } from "@/lib/types";
import TextareaAutosize from "react-textarea-autosize";

export default function Editor({
  markdown,
  setMarkdown,
  textareaRef,
  onInsertMarkdown,
  placeholder,
  name,
  onUndo,
  onRedo,
  setViewMode,
  handleEditorialChange,
}: any) {
  // handle keyshortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            onInsertMarkdown("**", "**");
            break;
          case "i":
            e.preventDefault();
            onInsertMarkdown("*", "*");
            break;
          case "u":
            e.preventDefault();
            onInsertMarkdown("<u>", "</u>");
            break;
          case "k":
            e.preventDefault();
            onInsertMarkdown("[", "](url)");
            break;
          case "h":
            e.preventDefault();
            onInsertMarkdown("## ");
            break;
          case "z":
            e.preventDefault();
            onUndo();
            break;
          case "y":
            e.preventDefault();
            onRedo();
            break;
        }
      }

      if (ctrlKey && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case "x":
            e.preventDefault();
            onInsertMarkdown("~~", "~~");
            break;
          case "q":
            e.preventDefault();
            onInsertMarkdown("> ");
            break;
          case "c":
            e.preventDefault();
            onInsertMarkdown("```\n", "\n```");
            break;
          // case "p":
          //   e.preventDefault();
          //   console.log("Toggling preview mode");
          //   setViewMode((prev) => (prev === "edit" ? "preview" : "edit"));
          //   // setViewMode((prev: ViewMode) => (prev === "edit" ? "preview" : "edit"));
          //   break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInsertMarkdown]);

  return (
    <div className="flex flex-col">
      <TextareaAutosize
        ref={textareaRef}
        value={markdown}
        minRows={50}
        name={name}
        placeholder={placeholder}
        onChange={(e) => {
          setMarkdown(e.target.value);
          handleEditorialChange(e);
        }}
        // ={handleEditorialChange}

        className="w-full h-[600px] p-4 rounded-lg font-mono text-lg resize-none bg-[#0d1520] text-white border border-[#1a2332] focus:outline-none focus:ring-2 "
        // value={value}
        // onChange={ev => setValue(ev.target.value)}
      />
      {/* <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full h-[600px] p-4 rounded-lg font-mono text-sm resize-none bg-[#0d1520] text-white border border-[#1a2332] focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
        placeholder="Write your markdown here..."
      /> */}
    </div>
  );
}
