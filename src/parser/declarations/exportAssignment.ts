import ts from "typescript";

export const handleExportAssignment = (node: ts.ExportAssignment) => {
  console.log(`Export Assignment: ${node.getText()}`);
};
