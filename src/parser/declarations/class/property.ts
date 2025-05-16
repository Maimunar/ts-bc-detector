import ts from "typescript";

export const parseProperty = (
  node: ts.PropertyDeclaration,
  checker: ts.TypeChecker,
) => {
  if (node.name) {
    console.log(`  Property: ${node.name.getText()}`);
  }
};
