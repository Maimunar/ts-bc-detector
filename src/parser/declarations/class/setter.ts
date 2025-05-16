import ts from "typescript";

export const parseSetAccessor = (
  node: ts.SetAccessorDeclaration,
  checker: ts.TypeChecker,
) => {
  if (node.name) {
    console.log(`  Setter: ${node.name.getText()}`);
  }
};
