import ts from "typescript";

export const handleGetAccessor = (node: ts.GetAccessorDeclaration) => {
  if (node.name) {
    console.log(`  Getter: ${node.name.getText()}`);
  }
};
