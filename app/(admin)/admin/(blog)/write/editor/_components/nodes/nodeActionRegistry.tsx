// nodeActionRegistry.tsx
import {
  Trash2,
  Maximize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
} from "lucide-react";

export type NodeAction = {
  label: string;
  icon?: React.ReactNode;
  callback: () => void;
};

export type NodeActionRegistry = {
  [nodeType: string]: (node: any) => NodeAction[];
};

export const nodeActionRegistry: NodeActionRegistry = {};

// Example registrations
export const registerNodeActions = (editor: any) => {
  nodeActionRegistry["table"] = (node) => [
    { label: "Add Row", icon: <Plus />, callback: () => addRow(editor, node) },
    {
      label: "Add Column",
      icon: <Plus />,
      callback: () => addCol(editor, node),
    },
    {
      label: "Resize Table",
      icon: <Maximize2 />,
      callback: () => resizeTable(editor, node),
    },
    { label: "Delete", icon: <Trash2 />, callback: () => node.remove() },
  ];

  nodeActionRegistry["image"] = (node) => [
    {
      label: "Align Left",
      icon: <AlignLeft />,
      callback: () => alignImage(editor, node, "left"),
    },
    {
      label: "Align Center",
      icon: <AlignCenter />,
      callback: () => alignImage(editor, node, "center"),
    },
    {
      label: "Align Right",
      icon: <AlignRight />,
      callback: () => alignImage(editor, node, "right"),
    },
    { label: "Delete", icon: <Trash2 />, callback: () => node.remove() },
  ];

  nodeActionRegistry["youtube"] = (node) => [
    {
      label: "Change Link",
      icon: <Maximize2 />,
      callback: () => changeYouTubeLink(editor, node),
    },
    { label: "Delete", icon: <Trash2 />, callback: () => node.remove() },
  ];
};

// Dummy implementations for demo
const addRow = (editor: any, node: any) =>
  editor.update(() => {
    /* add row logic */
  });
const addCol = (editor: any, node: any) =>
  editor.update(() => {
    /* add col logic */
  });
const resizeTable = (editor: any, node: any) =>
  editor.update(() => {
    /* resize */
  });
const alignImage = (editor: any, node: any, align: string) =>
  editor.update(() => {
    /* align */
  });
const changeYouTubeLink = (editor: any, node: any) =>
  editor.update(() => {
    /* change link */
  });
