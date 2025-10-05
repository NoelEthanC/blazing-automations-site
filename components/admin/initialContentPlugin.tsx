"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $insertNodes } from "lexical";
import { useEffect } from "react";

interface InitialContentPluginProps {
  content: string;
}

export function InitialContentPlugin({ content }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        $insertNodes(nodes);
      });
    }
  }, [editor, content]);

  return null;
}
