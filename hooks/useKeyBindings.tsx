import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { KEY_ENTER_COMMAND } from "lexical";
import {
  LOW_PRIORIRTY,
  RichTextAction,
} from "@/app/(admin)/admin/(blog)/write/editor/_components/constants";

const useKeyBindings = ({
  onAction,
}: {
  onAction: (id: RichTextAction) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (event?.key === "B" && (event.ctrlKey || event.metaKey)) {
          onAction(RichTextAction.Bold);
        }
        if (
          event?.key === "C" &&
          event.altKey &&
          (event.ctrlKey || event.metaKey)
        ) {
          onAction(RichTextAction.Code);
        }
        if (
          event?.key === "E" &&
          event.altKey &&
          (event.ctrlKey || event.metaKey)
        ) {
          onAction(RichTextAction.JustifyAlign);
        }
        if (
          event?.key === "L" &&
          event.altKey &&
          (event.ctrlKey || event.metaKey)
        ) {
          onAction(RichTextAction.LeftAlign);
        }
        if (
          event?.key === "R" &&
          event.altKey &&
          (event.ctrlKey || event.metaKey)
        ) {
          onAction(RichTextAction.RightAlign);
        }
        if (event?.key === "Z" && (event.ctrlKey || event.metaKey)) {
          onAction(RichTextAction.Undo);
        }
        if (event?.key === "Y" && (event.ctrlKey || event.metaKey)) {
          onAction(RichTextAction.Redo);
        }
        if (event?.key === "S" && (event.shiftKey || event.metaKey)) {
          onAction(RichTextAction.Strikethrough);
        }
        if (event?.key === "U" && (event.ctrlKey || event.metaKey)) {
          onAction(RichTextAction.Underline);
        }
        return false;
      },
      LOW_PRIORIRTY
    );
  }, [onAction, editor]);
  return <div>useKeyBindings</div>;
};

export default useKeyBindings;
