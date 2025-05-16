import ts from "typescript";
import { extractModifiers } from "../helper";
import { TypeAliasDeclaration, TypeAliasModifier } from "../../model";

export const parseTypeAlias = (node: ts.TypeAliasDeclaration) => {
  const name = node.name.text;
  const modifiers = extractModifiers<TypeAliasModifier>(node.modifiers);
  const type = node.type.getText();

  const typeAliasDeclaration: TypeAliasDeclaration = {
    name,
    modifiers,
    type,
    kind: "typeAlias",
  };

  console.log(typeAliasDeclaration);
  return typeAliasDeclaration;
};
