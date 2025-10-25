export interface Resource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  fileType: string;
  tool: string;
  downloadUrl?: string;
  hasGuide: boolean;
  category: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Lead {
  id: string;
  email: string;
  resourceId?: string;
  source: string;
  createdAt: Date;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  company?: string;
}

import type React from "react";
export interface ToolbarButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  shortcut?: string;
}

export type ViewMode = "edit" | "preview";

export interface EditorProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onInsertMarkdown: (before: string, after?: string) => void;
  placeholder?: string;
  name?: string;
  onUndo: () => void;
  onRedo: () => void;
  setViewMode: (mode: ViewMode) => void;
}

export interface ToolbarProps {
  onInsertMarkdown: (before: string, after?: string) => void;
  onImageClick: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface PreviewProps {
  markdown: string;
  title: string;
  isEditor: boolean;
}

export interface ToggleButtonsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, alt: string) => void;
}
