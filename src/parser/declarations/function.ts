import ts from "typescript";

export const parseFunction = (node: ts.FunctionDeclaration) => {
  if (node.name) {
    console.log(`Function: ${node.name.text}`);
  }
};
