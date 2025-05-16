import ts from "typescript";

export const parseInterface = (node: ts.InterfaceDeclaration) => {
  console.log(`Interface: ${node.name.text}`);
};
