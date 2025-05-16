import ts from "typescript";

export const parseGetAccessor = (
  node: ts.GetAccessorDeclaration,
  checker: ts.TypeChecker,
) => {
  if (node.name) {
    console.log(`  Getter: ${node.name.getText()}`);
  }
};
