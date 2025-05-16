import ts from "typescript";

export const parseTypeAlias = (node: ts.TypeAliasDeclaration) => {
  console.log(`Type Alias: ${node.name.text}`);
};
