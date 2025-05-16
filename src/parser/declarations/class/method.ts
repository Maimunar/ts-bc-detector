import ts from "typescript";

export const parseMethod = (node: ts.MethodDeclaration) => {
  if (node.name) {
    console.log(`  Method: ${node.name.getText()}`);
  }
};
