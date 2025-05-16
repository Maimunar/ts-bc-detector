import ts from "typescript";

export const handleConstructor = (node: ts.ConstructorDeclaration) => {
  console.log(`  Constructor`);
};
