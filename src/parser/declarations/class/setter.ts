import ts from "typescript";

export const handleSetAccessor = (node: ts.SetAccessorDeclaration) => {
  if (node.name) {
    console.log(`  Setter: ${node.name.getText()}`);
  }
};
