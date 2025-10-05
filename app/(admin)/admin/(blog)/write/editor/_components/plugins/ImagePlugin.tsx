"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode, $isImageNode } from "../nodes/ImageNode";
import { $insertNodes, $getSelection, $isNodeSelection } from "lexical";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile, deleteFile } from "@/app/actions/blog";
import { toast } from "sonner";

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");
  const [file, setFile] = useState<File>();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedImageNode, setSelectedImageNode] = useState<any>(null);
  const [imageDOMRect, setImageDOMRect] = useState<DOMRect | null>(null);

  /** Detect node selection */
  useEffect(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        for (const node of nodes) {
          if ($isImageNode(node)) {
            setSelectedImageNode(node);

            // get DOM rect
            const dom = editor.getElementByKey(node.getKey());
            if (dom) setImageDOMRect(dom.getBoundingClientRect());
            return;
          }
        }
      }

      setSelectedImageNode(null);
      setImageDOMRect(null);
    });
  }, [editor]);

  /** Add Image Node */
  const onAddImage = async () => {
    if (!url && !file) return;

    try {
      setUploading(true);
      let src = "";

      if (file) {
        src = await uploadFile(file, "article-photos", `thumb-${Date.now()}`);
      } else {
        src = url;
      }

      editor.update(() => {
        const node = $createImageNode({ src, altText: "Article Image" });
        $insertNodes([node]);
      });

      setFile(undefined);
      setURL("");
      setIsOpen(false);
    } catch (err) {
      toast.error("Error uploading image.", {
        description: (err as Error).message,
        duration: 8000,
      });
    } finally {
      setUploading(false);
    }
  };

  /** Remove Selected Image */
  const onRemoveImage = async () => {
    if (!selectedImageNode) return;

    editor.update(() => {
      const src = selectedImageNode.getSrc();
      selectedImageNode.remove();

      if (src?.includes("article-photos")) {
        deleteFile(src, "article-photos").catch(console.error);
      }
    });

    setSelectedImageNode(null);
    setImageDOMRect(null);
  };

  return (
    <div className="inline-block relative">
      {/* Toolbar Buttons */}
      <Button
        variant="ghost"
        type="button"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1"
      >
        <ImageIcon className="w-5 h-5" /> Upload
      </Button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) setFile(f);
          e.target.value = "";
        }}
      />

      {/* Modal for URL/File Upload */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <Input
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="Add Image URL"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              {file ? file.name : "Upload Image"}
            </Button>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={onAddImage}
              disabled={(!url && !file) || uploading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {uploading ? "Uploading..." : "Add Image"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Delete Button on Image */}
      {selectedImageNode && imageDOMRect && (
        <div
          className="absolute bg-black text-white p-1 rounded flex gap-1 z-50"
          style={{
            top: imageDOMRect.top - 30 + window.scrollY,
            left: imageDOMRect.left + window.scrollX,
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemoveImage}
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
