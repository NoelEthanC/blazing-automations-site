"use client";

import type React from "react";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import type { ImageUploadModalProps } from "@/lib/types";
import { uploadFile } from "@/app/actions/blog";

export default function ImageUploadModal({
  isOpen,
  onClose,
  onInsert,
}: ImageUploadModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadFile(file, "article-photos");

    setImageUrl(url);
    setAltText(file.name.replace(/\.[^/.]+$/, ""));
    setIsUploading(false);
  };

  const handleInsert = () => {
    if (imageUrl) {
      onInsert(imageUrl, altText || "Image description");
      setImageUrl("");
      setAltText("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1520] border border-[#1a2332] rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Insert Image</h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              className="w-full px-3 py-2 bg-[#09111f] border border-[#1a2332] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Image description"
              className="w-full px-3 py-2 bg-[#09111f] border border-[#1a2332] rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3f79ff]"
            />
          </div>

          <div className="relative">
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">OR</span>
            </div>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2332] hover:bg-[#243044] text-white rounded transition-colors disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Select from Computer"}
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleInsert}
              disabled={!imageUrl}
              className="flex-1 px-4 py-2 bg-[#3f79ff] hover:bg-[#3366cc] text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#1a2332] hover:bg-[#243044] text-white rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
