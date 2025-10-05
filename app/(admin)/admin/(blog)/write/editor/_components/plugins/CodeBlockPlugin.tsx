"use client";

import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  registerCodeHighlighting,
  $createCodeNode,
  getCodeLanguages,
  $isCodeNode,
} from "@lexical/code";
import { $getNodeByKey, $getSelection, $isRangeSelection } from "lexical";
import { $wrapNodes } from "@lexical/selection";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, CodeSquare } from "lucide-react";

const languages = getCodeLanguages();

interface CodeBlockPluginProps {
  codeLanguage: string;
  blockType: string;
  selectedElementKey: string;
}

export default function CodeBlockPlugin({
  codeLanguage,
  blockType,
  selectedElementKey,
}: CodeBlockPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const onAddCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
      }
    });
  };

  const onLanguageChange = (language: string) => {
    editor.update(() => {
      if (!selectedElementKey) return;
      const node = $getNodeByKey(selectedElementKey);
      if ($isCodeNode(node)) {
        node.setLanguage(language);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={onAddCodeBlock}
        aria-label="Add Code Block"
      >
        <CodeSquare className="h-4 w-4" />
      </Button>

      {blockType && (
        <Select value={codeLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[115px] bg-secondary-blue/15 outline-secondary-blue border-0 text-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className=" bg-secondary-blue/35 outline-secondary-blue text-white border-secondary-blue/20">
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
