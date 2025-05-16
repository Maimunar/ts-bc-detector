import ts from "typescript";

export const handleMethod = (node: ts.MethodDeclaration) => {
  if (node.name) {
    console.log(`  Method: ${node.name.getText()}`);
  }
};
