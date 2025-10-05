"use client";

import React, { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions, $isTableNode } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { $getSelection, $isNodeSelection } from "lexical";
import { Key, Table, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomTableNode } from "../nodes/CustomTable";

export default function TablePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [rows, setRows] = useState<number>();
  const [columns, setColumns] = useState<number>();
  const [editor] = useLexicalComposerContext();

  const onAddTable = () => {
    if (!rows || !columns) return;

    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(rows, columns, true);
      // const tableNode = new CustomTableNode("key");
      $insertNodeToNearestRoot(tableNode as any);
    });

    setRows(undefined);
    setColumns(undefined);
    setIsOpen(false);
  };

  const onRemoveTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!selection) return;

      // Works for node selection or cursor inside table
      const nodes = selection.getNodes();
      for (const node of nodes) {
        let parent = node.getParent();
        while (parent) {
          if ($isTableNode(parent)) {
            parent.remove();
            return;
          }
          parent = parent.getParent();
        }
      }
    });
  };

  return (
    <>
      {/* Add Table Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Add Table"
      >
        <Table className="h-4 w-4" />
      </Button>

      {/* Remove Table Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemoveTable}
        aria-label="Remove Table"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Table</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <Input
              type="number"
              value={rows ?? ""}
              onChange={(e) => setRows(Number(e.target.value))}
              placeholder="Rows"
              autoFocus
            />
            <Input
              type="number"
              value={columns ?? ""}
              onChange={(e) => setColumns(Number(e.target.value))}
              placeholder="Columns"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onAddTable}
              disabled={!rows || !columns}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
