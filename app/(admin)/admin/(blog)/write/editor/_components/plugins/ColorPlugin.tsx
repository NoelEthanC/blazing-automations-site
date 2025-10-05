import React, { useEffect, useState } from "react";
import ColorPicker from "../ColorPicker";
import { Clock1, PaintBucket, Type } from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { LOW_PRIORIRTY } from "../constants";

const ColorPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [{ color, bgColor }, setColors] = useState({
    color: "#000",
    bgColor: "#fff",
  });
  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const color = $getSelectionStyleValueForProperty(
        selection,
        "color",
        "#000"
      );
      const bgColor = $getSelectionStyleValueForProperty(
        selection,
        "background",
        "#fff"
      );
      setColors({ color, bgColor });
    }
  };

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
      )
    );
  }, [editor]);

  const updateColor = ({
    property,
    color,
  }: {
    property: "background" | "color";
    color: string;
  }) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          // ✅ Applies style to future text typed
          selection.formatTextStyle({
            [property]: color,
          });
        } else {
          // ✅ Applies style to highlighted text
          $patchStyleText(selection, { [property]: color });
        }
      }
    });
  };
  return (
    <>
      <ColorPicker
        color={color}
        onChange={(color) => {
          updateColor({ property: "color", color });
        }}
        Icon={<Type />}
      />
      <ColorPicker
        color={bgColor}
        onChange={(color) => {
          updateColor({ property: "background", color });
        }}
        Icon={<PaintBucket />}
      />
    </>
  );
};

export default ColorPlugin;
