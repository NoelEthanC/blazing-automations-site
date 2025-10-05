"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ListOrdered, List } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

interface ListPluginProps {
  blockType: string;
}

export default function ListPlugin({ blockType }: ListPluginProps) {
  const [editor] = useLexicalComposerContext();

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          variant: "secondary",
        }
      : {};
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-label="Add Ordered List"
        onClick={() => {
          if (blockType === "ol") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ol")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Add Unordered List"
        onClick={() => {
          if (blockType === "ul") {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
        }}
        {...getSelectedBtnProps(blockType === "ul")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
