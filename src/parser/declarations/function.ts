import ts from "typescript";

export const handleFunction = (node: ts.FunctionDeclaration) => {
  if (node.name) {
    console.log(`Function: ${node.name.text}`);
  }
};
