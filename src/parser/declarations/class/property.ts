import ts from "typescript";

export const handleProperty = (node: ts.PropertyDeclaration) => {
  if (node.name) {
    console.log(`  Property: ${node.name.getText()}`);
  }
};
