import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";

interface ColorPickerProps {
  color?: string;
  onChange?: (color: string) => void;
  Icon?: React.ReactNode;
}

const ColorPicker = ({ color, onChange, Icon }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative  " ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-10 h-10 p-0"
      >
        {Icon}
      </Button>

      {isOpen && (
        <div className="absolute top-full select-none mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
          <SketchPicker
            color={color}
            onChangeComplete={(color) => onChange?.(color.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
