import ts from "typescript";

export const parseVariable = (node: ts.VariableStatement) => {
  node.declarationList.declarations.forEach((decl) => {
    if (ts.isIdentifier(decl.name)) {
      console.log(`Variable: ${decl.name.text}`);
    }
  });
};
