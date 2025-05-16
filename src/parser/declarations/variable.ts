import ts from "typescript";

export const parseVariable = (
  node: ts.VariableStatement,
  checker: ts.TypeChecker,
) => {
  node.declarationList.declarations.forEach((decl) => {
    if (ts.isIdentifier(decl.name)) {
      console.log(`Variable: ${decl.name.text}`);
    }
  });
};
