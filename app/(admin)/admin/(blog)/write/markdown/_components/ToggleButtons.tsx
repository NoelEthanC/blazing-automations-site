"use client";

import type { ToggleButtonsProps } from "@/lib/types";
import { Eye, PenBoxIcon } from "lucide-react";

export default function ToggleButtons({
  viewMode,
  setViewMode,
}: ToggleButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setViewMode("edit")}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          viewMode === "edit"
            ? "bg-[#3f79ff] text-white"
            : "bg-[#1a2332] text-gray-400 hover:text-white"
        }`}
      >
        <PenBoxIcon className="inline-block mr-2 mb-1" size={16} />
      </button>
      <button
        type="button"
        onClick={() => setViewMode("preview")}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          viewMode === "preview"
            ? "bg-[#3f79ff] text-white"
            : "bg-[#1a2332] text-gray-400 hover:text-white"
        }`}
      >
        <Eye className="inline-block mr-2 mb-1" size={16} />
      </button>
    </div>
  );
}
