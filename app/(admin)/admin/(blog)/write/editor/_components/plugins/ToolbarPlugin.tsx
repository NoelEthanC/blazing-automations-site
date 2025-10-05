"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  HEADINGS,
  LOW_PRIORIRTY,
  RICH_TEXT_OPTIONS,
  RichTextAction,
} from "../constants";
import { Separator } from "@/components/ui/separator";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, MoreHorizontal } from "lucide-react";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType, $wrapNodes } from "@lexical/selection";
import useKeyBindings from "@/hooks/useKeyBindings";
import ColorPlugin from "./ColorPlugin";
import ListPlugin from "./ListPlugin";
import { $isListNode, ListNode } from "@lexical/list";
import { $isCodeNode, getDefaultCodeLanguage } from "@lexical/code";
import TablePlugin from "./TablePlugin";
import CodeBlockPlugin from "./CodeBlockPlugin";
import ImagePlugin from "./ImagePlugin";
import YoutubePlugin from "./YoutubePlugin";

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [disableMap, setDisableMap] = useState<{ [id: string]: boolean }>({
    [RichTextAction.Undo]: true,
    [RichTextAction.Redo]: true,
  });
  const [selectionMap, setSelectionMap] = useState<{ [id: string]: boolean }>(
    {}
  );

  const [blockType, setBlockType] = useState<string>("paragraph");
  const [codeLanguage, setCodeLanguage] = useState<string>(
    getDefaultCodeLanguage()
  );
  const [selectedElementKey, setSelectedElementKey] = useState<string>("");

  function updateToolbar() {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const newSelectionMap = {
        [RichTextAction.Bold]: selection.hasFormat("bold"),
        [RichTextAction.Italics]: selection.hasFormat("italic"),
        [RichTextAction.Underline]: selection.hasFormat("underline"),
        [RichTextAction.Strikethrough]: selection.hasFormat("strikethrough"),
        [RichTextAction.Superscript]: selection.hasFormat("superscript"),
        [RichTextAction.Subscript]: selection.hasFormat("subscript"),
        [RichTextAction.Code]: selection.hasFormat("code"),
        [RichTextAction.Highlight]: selection.hasFormat("highlight"),
      };
      setSelectionMap(newSelectionMap);
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      setSelectedElementKey(elementKey);
      const elementDOM = editor.getElementByKey(elementKey);

      if (!elementDOM) return;

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
        if ($isCodeNode(element)) {
          setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
        }
      }
    }
  }
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar();
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisabledMap) => ({
            ...prevDisabledMap,
            undo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setDisableMap((prevDisabledMap) => ({
            ...prevDisabledMap,
            redo: !payload,
          }));
          return false;
        },
        LOW_PRIORIRTY
      )
    );
  }, [editor]);
  const onAction = (id: RichTextAction) => {
    switch (id) {
      case RichTextAction.Bold: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        break;
      }
      case RichTextAction.Italics: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        break;
      }
      case RichTextAction.Underline: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        break;
      }
      case RichTextAction.Strikethrough: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        break;
      }
      case RichTextAction.Superscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
        break;
      }
      case RichTextAction.Subscript: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
        break;
      }
      case RichTextAction.Highlight: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        break;
      }
      case RichTextAction.Code: {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        break;
      }
      case RichTextAction.LeftAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        break;
      }
      case RichTextAction.RightAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        break;
      }
      case RichTextAction.CenterAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        break;
      }
      case RichTextAction.JustifyAlign: {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        break;
      }
      case RichTextAction.Undo: {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        break;
      }
      case RichTextAction.Redo: {
        editor.dispatchCommand(REDO_COMMAND, undefined);
        break;
      }
    }
  };

  useKeyBindings({ onAction });

  const getSelectedBtnProps = (isSelected: boolean) =>
    isSelected
      ? {
          color: "blue",
          variant: "secondary",
        }
      : {};

  const updateHeading = (heading: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // $setBlocksType(selection, () => $createHeadingNode(heading));
        $wrapNodes(selection, () => $createHeadingNode(heading));
      }
    });
  };
  return (
    <div className="flex flex-wrap text-white gap-4 items-center">
      {blockType !== "code" && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger className="" asChild>
              <Button
                variant={"ghost"}
                size="sm"
                className=" text-white flex items-center bg-secondary-blue/15 outline-secondary-blue"
              >
                Heading
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 border-gray-700 text-white"
            >
              {HEADINGS.map((heading) => (
                <DropdownMenuItem
                  className="py-2"
                  key={heading}
                  defaultValue={heading}
                  onClick={(e) => {
                    console.log("e.target.value", heading);
                    updateHeading(heading as HeadingTagType);
                  }}
                >
                  <Button variant={"ghost"} className="py-1">
                    {heading}{" "}
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {RICH_TEXT_OPTIONS.map(({ id, label, fontSize, Icon }) =>
            id === RichTextAction.Divider ? (
              <Separator
                orientation="vertical"
                className="h-6 mx-1 opacity-35"
                key={Math.random().toString(36).substring(7)}
              />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="p-2 font-bold"
                onClick={() => onAction(id)}
                key={id}
                color="white"
                title={label}
                disabled={disableMap[id]}
                {...getSelectedBtnProps(selectionMap[id])}
              >
                <Icon size="10" />
              </Button>
            )
          )}
          <Separator
            orientation="vertical"
            className="h-6 mx-1 opacity-35"
            key={Math.random().toString(36).substring(7)}
          />
        </>
      )}

      {blockType !== "code" && (
        <>
          <ColorPlugin />
          <ListPlugin blockType={blockType} />
          <Separator
            orientation="vertical"
            className="h-6 mx-1 opacity-35"
            key={Math.random().toString(36).substring(7)}
          />
          <TablePlugin />
        </>
      )}
      <YoutubePlugin />
      <ImagePlugin />
      <CodeBlockPlugin
        blockType={blockType}
        selectedElementKey={selectedElementKey}
        codeLanguage={codeLanguage}
      />
    </div>
  );
};

export default ToolbarPlugin;
