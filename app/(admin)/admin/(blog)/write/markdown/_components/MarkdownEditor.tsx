"use client";

import { useState, useEffect, useRef } from "react";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import Preview from "./Preview";
import ToggleButtons from "./ToggleButtons";
import ImageUploadModal from "./ImageUploadModal";
import type { ViewMode } from "@/lib/types";

export default function MarkdownEditor({
  viewMode,
  setViewMode,
  markdown,
  name,
  setMarkdown,
  placeholder,
  handleEditorialChange,
}: {
  viewMode: ViewMode;
  setViewMode: (view: ViewMode) => void;
  markdown: string;
  name: string;
  setMarkdown: (value: string) => void;
  placeholder: "Start writing here...";
  handleEditorialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isToolbarFixed, setIsToolbarFixed] = useState(false);

  // handle fixed scrolling toolbar
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When toolbar goes out of view, make it fixed
        setIsToolbarFixed(!entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );

    observer.observe(toolbar);

    return () => observer.disconnect();
  }, []);

  // Reset toolbar and scroll position when switching back to edit mode
  useEffect(() => {
    if (viewMode === "edit") {
      // Ensure toolbar starts un-fixed
      setIsToolbarFixed(false);

      // Smoothly scroll to top so IntersectionObserver resets
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [viewMode]);

  // Load saved content
  // useEffect(() => {
  //   const saved = localStorage.getItem(STORAGE_KEY);
  //   const savedTitle = localStorage.getItem(TITLE_STORAGE_KEY);
  //   if (saved) {
  //     setMarkdown(saved);
  //     setHistory([saved]);
  //     setHistoryIndex(0);
  //   }
  //   if (savedTitle) {
  //     setTitle(savedTitle);
  //   }
  // }, []);

  // History tracking
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

  const handleImageInsert = (url: string, alt: string) => {
    insertMarkdown(`![${alt}](${url})`);
  };

  return (
    <div className="min-h-screen bg-[#09111f]">
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {viewMode === "edit" ? (
          <>
            <div className="max-w-7xl mx-auto pb-4 relative">
              {/* Invisible sentinel to detect toolbar position */}
              <div ref={toolbarRef}></div>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  isToolbarFixed
                    ? "fixed top-0 left-0 w-full bg-[#09111f]/95 backdrop-blur-md z-50 border-b border-[#1a2332] translate-y-0 opacity-100"
                    : "translate-y-[-20px] "
                }`}
              >
                <div className="max-w-7xl mx-auto ">
                  <Toolbar
                    onInsertMarkdown={insertMarkdown}
                    onImageClick={() => setIsImageModalOpen(true)}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                  />
                </div>
              </div>

              <Editor
                markdown={markdown}
                setMarkdown={setMarkdown}
                textareaRef={textareaRef}
                onInsertMarkdown={insertMarkdown}
                name={name}
                placeholder={placeholder}
                onUndo={handleUndo}
                onRedo={handleRedo}
                setViewMode={setViewMode}
                handleEditorialChange={handleEditorialChange}
              />
            </div>
          </>
        ) : (
          <Preview markdown={markdown} title={title} />
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
// return (
//   <div className="min-h-screen bg-[#09111f]">
//     {/* <header className="border-b border-[#1a2332]">
//       <div className="max-w-7xl mx-auto px-4 py-4">
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="New Post Title Here..."
//           className="w-full text-4xl font-bold text-white bg-transparent border-none outline-none mb-4 placeholder:text-gray-600"
//         />
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold text-gray-400">Create Post</h2>
//           <ToggleButtons viewMode={viewMode} setViewMode={setViewMode} />
//         </div>
//       </div>
//     </header> */}

//     <div className="max-w-7xl mx-auto px-4 pb-8">
//       {viewMode === "edit" ? (
//         <>
//           <div className="max-w-7xl mx-auto   pb-4">
//             <Toolbar
//               onInsertMarkdown={insertMarkdown}
//               onImageClick={() => setIsImageModalOpen(true)}
//               onUndo={handleUndo}
//               onRedo={handleRedo}
//               canUndo={historyIndex > 0}
//               canRedo={historyIndex < history.length - 1}
//             />
//             <Editor
//               markdown={markdown}
//               setMarkdown={setMarkdown}
//               textareaRef={textareaRef}
//               onInsertMarkdown={insertMarkdown}
//             />
//           </div>
//         </>
//       ) : (
//         <Preview markdown={markdown} title={title} />
//       )}
//     </div>

//     <ImageUploadModal
//       isOpen={isImageModalOpen}
//       onClose={() => setIsImageModalOpen(false)}
//       onInsert={handleImageInsert}
//     />
//   </div>
// );
// }
