"use client";
import React, { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@/components/admin/onChangePlugin";
import CustomOnChangePlugin from "./plugins/CustomOnChangePlugin";
import ColorPlugin from "./plugins/ColorPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import TablePlugin from "./plugins/TablePlugin";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { EditorThemeClasses, EditorThemeClassName } from "lexical";
import CodeBlockPlugin from "./plugins/CodeBlockPlugin";
import { theme } from "./constants/editor-theme";
import Image from "next/image";
import { ImageNode } from "./nodes/ImageNode";
import ImagePlugin from "./plugins/ImagePlugin";
import { YoutubeNode } from "./nodes/YoutubeNode";
import FloatingToolbar from "@/components/admin/plugins/FloatingToolbar";
import { TableNodeComponent } from "./nodes/TableNode";
import { CustomTableNode } from "./nodes/CustomTable";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = React.memo(
  function RichTextEditor({ value, onChange, placeholder, name }) {
    const initialConfig = useMemo(
      () => ({
        namespace: "RichTextEditor-1",
        theme,
        onError: (error: Error) => {
          console.log("editor", error);
        },
        nodes: [
          HeadingNode,
          CodeHighlightNode,
          CodeNode,
          ListNode,
          ListItemNode,
          CustomTableNode,
          TableNode,
          TableRowNode,
          TableCellNode,
          ImageNode,
          YoutubeNode,
        ],
      }),
      [name]
    );
    return (
      <div>
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[600px] p-4 text-white bg-secondary-blue/5 focus:outline-none prose prose-invert max-w-none"
                  value={value}
                  style={{ caretColor: "blue" }}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                  Start writing here...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <AutoFocusPlugin />
          <HistoryPlugin />
          <CustomOnChangePlugin value={value} onChange={onChange} />
          <ListPlugin />
          <FloatingToolbar />
          {/* <OnChangePlugin onChange={onChange} /> */}
        </LexicalComposer>
      </div>
    );
  }
);

export default RichTextEditor;
