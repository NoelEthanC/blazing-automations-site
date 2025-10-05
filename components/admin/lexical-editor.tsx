"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { TRANSFORMERS } from "@lexical/markdown";
import {
  LexicalErrorBoundary,
  LexicalErrorBoundaryProps,
} from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  LexicalEditor as LexicalEditorType,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { OnChangePlugin } from "./onChangePlugin";
import { InitialContentPlugin } from "./initialContentPlugin";
import { Heading1, Heading2, Heading3 } from "lucide-react";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-gray-500",
  paragraph: "mb-4",
  quote: "border-l-4 border-blue-500 pl-4 italic text-gray-300 my-4",
  heading: {
    h1: "text-3xl font-bold mb-4 text-white",
    h2: "text-2xl font-bold mb-3 text-white",
    h3: "text-xl font-bold mb-2 text-white",
    h4: "text-lg font-bold mb-2 text-white",
    h5: "text-base font-bold mb-2 text-white",
    h6: "text-sm font-bold mb-2 text-white",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal list-inside mb-4 pl-4",
    ul: "list-disc list-inside mb-4 pl-4",
    listitem: "mb-1",
  },
  image: "max-w-full h-auto rounded-lg my-4",
  link: "text-blue-400 underline hover:text-blue-300",
  text: {
    bold: "font-bold",
    italic: "italic",
    overflowed: "overflow-hidden",
    hashtag: "text-blue-400",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-gray-700 text-green-400 px-1 py-0.5 rounded text-sm font-mono",
  },
  code: "bg-gray-800 text-green-400 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-blue-400",
    boolean: "text-orange-400",
    builtin: "text-purple-400",
    cdata: "text-gray-400",
    char: "text-green-400",
    class: "text-yellow-400",
    "class-name": "text-yellow-400",
    comment: "text-gray-500",
    constant: "text-orange-400",
    deleted: "text-red-400",
    doctype: "text-gray-400",
    entity: "text-orange-400",
    function: "text-blue-400",
    important: "text-red-400",
    inserted: "text-green-400",
    keyword: "text-purple-400",
    namespace: "text-yellow-400",
    number: "text-orange-400",
    operator: "text-gray-300",
    prolog: "text-gray-400",
    property: "text-blue-400",
    punctuation: "text-gray-300",
    regex: "text-green-400",
    selector: "text-yellow-400",
    string: "text-green-400",
    symbol: "text-orange-400",
    tag: "text-red-400",
    url: "text-blue-400",
    variable: "text-orange-400",
  },
};

function onError(error: Error) {
  console.error(error);
}

interface ToolbarPluginProps {
  setIsLinkEditMode: (isLinkEditMode: boolean) => void;
}

function ToolbarPlugin({ setIsLinkEditMode }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null
  );
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsCode(selection.hasFormat("code"));
    }
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor]);

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: string) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () =>
            $createHeadingNode(headingSize as any)
          );
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-600 bg-gray-800/50">
      {/* Text Formatting */}
      <>
        <Button
          variant={isBold ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={isItalic ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={isUnderline ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          variant={isCode ? "default" : "ghost"}
          size="sm"
          onClick={() => formatText("code")}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />
        <br />
        <br />
        {/* Headings */}
        <Button
          variant={blockType === "h1" ? "default" : "ghost"}
          size="sm"
          onClick={() => formatHeading("h1")}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant={blockType === "h2" ? "default" : "ghost"}
          size="sm"
          onClick={() => formatHeading("h2")}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant={blockType === "h3" ? "default" : "ghost"}
          size="sm"
          onClick={() => formatHeading("h3")}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={formatBulletList}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={formatNumberedList}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Block Elements */}
        <Button
          variant={blockType === "quote" ? "default" : "ghost"}
          size="sm"
          onClick={formatQuote}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant={blockType === "code" ? "default" : "ghost"}
          size="sm"
          onClick={formatCode}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
      </>
      {/* <ToolbarPlugin /> */}
      {/* <Separator orientation="vertical" className="h-6 mx-1" /> */}

      {/* Link Editing */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsLinkEditMode(true)}
        className="h-8 w-8 p-0"
      >
        <a className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface LexicalEditorProps {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export function LexicalEditor({
  initialContent = "",
  onChange,
  placeholder = "Write your article content...",
}: LexicalEditorProps) {
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const initialConfig = {
    namespace: "BlogEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="min-h-[400px] p-4 text-white bg-gray-700 focus:outline-none prose prose-invert max-w-none"
                style={{ caretColor: "white" }}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} />
          {initialContent && <InitialContentPlugin content={initialContent} />}
        </div>
      </LexicalComposer>
    </div>
  );
}
