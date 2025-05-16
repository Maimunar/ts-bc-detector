import ts from "typescript";

export const handleInterface = (node: ts.InterfaceDeclaration) => {
  console.log(`Interface: ${node.name.text}`);
};
