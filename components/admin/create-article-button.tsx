"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function CreateArticleButton({
  isLoading,
  handleCreateNewArticle,
}: any) {
  const [editorType, setEditorType] = useState<"markdown" | "wysiwyg">(
    "markdown"
  );

  const onSelectEditor = (type: "markdown" | "wysiwyg") => {
    setEditorType(type);
    // maybe store somewhere or pass to handleCreateNewArticle
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={() => handleCreateNewArticle(editorType)}
          disabled={isLoading}
          className="bg-[#3f79ff] hover:bg-[#3f79ff]/80"
        >
          {/* <Link href="/admin/blog/new"> */}
          {/* plus icon */}
          {isLoading
            ? "Creating..."
            : `Create New Article (${editorType === "markdown" ? "Markdown" : "WYSIWYG"})`}
          {/* </Link> */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onSelectEditor("markdown")}>
          Markdown Editor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectEditor("wysiwyg")}>
          WYSIWYG Editor
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
