// FloatingNodeActions.tsx
import React from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
} from "@floating-ui/react-dom-interactions";
import { nodeActionRegistry } from "./nodeActionRegistry";

interface FloatingNodeActionsProps {
  node: any;
  editor: any;
  referenceElement: HTMLElement | null;
}

export const FloatingNodeActions: React.FC<FloatingNodeActionsProps> = ({
  node,
  editor,
  referenceElement,
}) => {
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "top-end",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: undefined,
  });

  React.useEffect(() => {
    if (referenceElement) reference(referenceElement);
  }, [referenceElement, reference]);

  if (!node || !referenceElement) return null;

  const nodeType = node.getType?.() || node.getType?.(); // adapt to your node type
  const actions = nodeActionRegistry[nodeType]?.(node) || [];

  return (
    <div
      ref={floating}
      style={{ position: strategy, top: y ?? 0, left: x ?? 0, zIndex: 50 }}
      className="flex gap-2 bg-gray-800 p-1 rounded shadow-md"
    >
      {actions.map((action, idx) => (
        <button
          key={idx}
          type="button"
          title={action.label}
          onClick={action.callback}
          className="hover:bg-gray-700 p-1 rounded"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};
