import ts from "typescript";

export const handleVariable = (node: ts.VariableStatement) => {
  node.declarationList.declarations.forEach((decl) => {
    if (ts.isIdentifier(decl.name)) {
      console.log(`Variable: ${decl.name.text}`);
    }
  });
};
