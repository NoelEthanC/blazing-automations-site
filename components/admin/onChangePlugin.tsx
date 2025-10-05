"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useEffect } from "react";

interface OnChangePluginProps {
  onChange?: (html: string) => void;
}

export function OnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        if (onChange) {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString);
        }
      });
    });
  }, [editor, onChange]);

  return null;
}
