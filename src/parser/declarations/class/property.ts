import ts from "typescript";

export const parseProperty = (node: ts.PropertyDeclaration) => {
  if (node.name) {
    console.log(`  Property: ${node.name.getText()}`);
  }
};
