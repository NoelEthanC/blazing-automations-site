import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { TableNodeComponent } from "./TableNode";

export class CustomTableNode extends TableNode {
  static getType() {
    return "table"; // Must match TableNode type
  }

  static clone(node: CustomTableNode) {
    // clone uses the internal TableNode clone
    return new CustomTableNode(node.__rows, node.__columns, node.__withHeader);
  }

  constructor(rows?: number, columns?: number, withHeader?: boolean) {
    // Call parent constructor, do NOT touch private fields directly
    super(rows, columns, withHeader);
  }

  decorate(editor: any) {
    return <TableNodeComponent node={this} editor={editor} />;
  }
}
