import ts from "typescript";

export const handleEnum = (node: ts.EnumDeclaration) => {
  console.log(`Enum: ${node.name.text}`);
};
