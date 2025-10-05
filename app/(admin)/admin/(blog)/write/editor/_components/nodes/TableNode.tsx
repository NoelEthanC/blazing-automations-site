// TableNodeComponent.tsx
import React, { useState, useRef } from "react";
import { TableNode } from "@lexical/table";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FloatingNodeActions } from "./FloatingNodeActions";

export const TableNodeComponent = ({ node }: { node: TableNode }) => {
  const [editor] = useLexicalComposerContext();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative border border-gray-700"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Render table cells */}
      {node.getChildren().map((rowNode) => (
        <div key={rowNode.getKey()} className="flex">
          {rowNode.getChildren().map((cellNode) => (
            <div key={cellNode.getKey()} className="border px-2 py-1">
              {cellNode.getTextContent()}
            </div>
          ))}
        </div>
      ))}

      {hovered && (
        <FloatingNodeActions
          node={node}
          editor={editor}
          referenceElement={ref.current}
        />
      )}
    </div>
  );
};
