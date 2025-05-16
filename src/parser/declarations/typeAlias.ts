import ts from "typescript";

export const handleTypeAlias = (node: ts.TypeAliasDeclaration) => {
  console.log(`Type Alias: ${node.name.text}`);
};
