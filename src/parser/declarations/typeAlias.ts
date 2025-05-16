import ts from "typescript";

export const parseTypeAlias = (
  node: ts.TypeAliasDeclaration,
  checker: ts.TypeChecker,
) => {
  console.log(`Type Alias: ${node.name.text}`);
};
