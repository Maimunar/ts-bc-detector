import ts from "typescript";

export const handleExportDeclaration = (node: ts.ExportDeclaration) => {
  console.log(`Export Declaration: ${node.getText()}`);
};
