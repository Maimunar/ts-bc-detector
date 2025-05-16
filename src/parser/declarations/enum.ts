import ts from "typescript";

export const parseEnum = (node: ts.EnumDeclaration) => {
  console.log(`Enum: ${node.name.text}`);
};
