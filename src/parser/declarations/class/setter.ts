import ts from "typescript";

export const parseSetAccessor = (node: ts.SetAccessorDeclaration) => {
  if (node.name) {
    console.log(`  Setter: ${node.name.getText()}`);
  }
};
