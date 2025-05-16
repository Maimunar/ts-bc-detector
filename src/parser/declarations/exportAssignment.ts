import ts from "typescript";

export const parseExportAssignment = (node: ts.ExportAssignment) => {
  console.log(`Export Assignment: ${node.getText()}`);
};
