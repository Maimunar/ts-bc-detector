import ts from "typescript";

export const parseMethod = (
  node: ts.MethodDeclaration,
  checker: ts.TypeChecker,
) => {
  if (node.name) {
    console.log(`  Method: ${node.name.getText()}`);
  }
};
