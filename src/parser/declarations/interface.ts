import ts from "typescript";

export const parseInterface = (
  node: ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
) => {
  console.log(`Interface: ${node.name.text}`);
};
