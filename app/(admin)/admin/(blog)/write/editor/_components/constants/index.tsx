import {
  RotateCw as ArrowClockwise,
  RotateCcw as ArrowCounterclockwise,
  Code,
  Highlighter as Highlighter,
  AlignJustify as Justify,
  AlignLeft as JustifyLeft,
  AlignRight as JustifyRight,
  Subscript,
  Superscript,
  AlignCenter as TextCenter, // Note: lucide-react doesn't have a direct TextCenter; use Type or AlignCenter
  Bold as TypeBold,
  Italic as TypeItalic,
  Strikethrough as TypeStrikethrough,
  Underline as TypeUnderline,
} from "lucide-react";

export enum RichTextAction {
  Bold = "bold",
  Italics = "italics",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Superscript = "superscript",
  Subscript = "subscript",
  Highlight = "highlight",
  Code = "code",
  LeftAlign = "leftAlign",
  CenterAlign = "centerAlign",
  RightAlign = "rightAlign",
  JustifyAlign = "justifyAlign",
  Divider = "divider",
  Undo = "undo",
  Redo = "redo",
}

export const RICH_TEXT_OPTIONS = [
  { id: RichTextAction.Bold, Icon: TypeBold, label: "Bold" },
  { id: RichTextAction.Italics, Icon: TypeItalic, label: "Italics" },
  { id: RichTextAction.Underline, Icon: TypeUnderline, label: "Underline" },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Highlight,
    Icon: Highlighter,
    label: "Highlight",
    fontSize: 10,
  },
  {
    id: RichTextAction.Strikethrough,
    Icon: TypeStrikethrough,
    label: "Strikethrough",
  },
  {
    id: RichTextAction.Superscript,
    Icon: Superscript,
    label: "Superscript",
  },
  {
    id: RichTextAction.Subscript,
    Icon: Subscript,
    label: "Subscript",
  },
  {
    id: RichTextAction.Code,
    Icon: Code,
    label: "Code",
  },
  { id: RichTextAction.Divider },
  {
    id: RichTextAction.LeftAlign,
    Icon: JustifyLeft,
    label: "Align Left",
  },
  {
    id: RichTextAction.CenterAlign,
    Icon: TextCenter,
    label: "Align Center",
  },
  {
    id: RichTextAction.RightAlign,
    Icon: JustifyRight,
    label: "Align Right",
  },
  {
    id: RichTextAction.JustifyAlign,
    Icon: Justify,
    label: "Align Justify",
  },

  { id: RichTextAction.Divider },
  {
    id: RichTextAction.Undo,
    Icon: ArrowCounterclockwise,
    label: "Undo",
  },
  {
    id: RichTextAction.Redo,
    Icon: ArrowClockwise,
    label: "Redo",
  },
];

export const LOW_PRIORIRTY = 1;
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
