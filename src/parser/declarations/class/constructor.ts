import ts from "typescript";

export const parseConstructor = (
  node: ts.ConstructorDeclaration,
  checker: ts.TypeChecker,
) => {
  console.log(`  Constructor`);
};
