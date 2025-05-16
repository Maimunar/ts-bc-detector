import ts from "typescript";

export const parseExportDeclaration = (node: ts.ExportDeclaration) => {
  console.log(`Export Declaration: ${node.getText()}`);
};
