import ts from "typescript";
import { extractModifiers, getNodeTypeOrAny } from "../helper";
import { TypeAliasDeclaration, TypeAliasModifier } from "../../model";

export const parseTypeAlias = (
  node: ts.TypeAliasDeclaration,
  checker: ts.TypeChecker,
) => {
  const name = node.name.text;
  const modifiers = extractModifiers<TypeAliasModifier>(node.modifiers);
  const type = getNodeTypeOrAny(node, checker);

  const typeAliasDeclaration: TypeAliasDeclaration = {
    name,
    modifiers,
    type,
    kind: "typeAlias",
  };

  console.log(typeAliasDeclaration);
  return typeAliasDeclaration;
};
