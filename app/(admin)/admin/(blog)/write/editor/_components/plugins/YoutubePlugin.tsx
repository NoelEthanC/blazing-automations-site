"use client";

import React, { useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createYoutubeNode } from "../nodes/YoutubeNode";
import { $insertNodes } from "lexical";
import { Youtube as YoutubeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function YoutubePlugin() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setURL] = useState("");

  const [editor] = useLexicalComposerContext();

  const onEmbed = () => {
    if (!url) return;

    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    const id = match && match?.[2]?.length === 11 ? match?.[2] : null;
    if (!id) return;

    editor.update(() => {
      const node = $createYoutubeNode({ id });
      $insertNodes([node]);
    });

    setURL("");
    setIsOpen(false);
  };

  return (
    <div className="inline-block">
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-red-600 hover:bg-red-100"
      >
        <YoutubeIcon className="w-5 h-5" />
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Embed Youtube Video</DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <Input
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="Add Youtube URL"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={onEmbed}
              disabled={!url}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Embed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
