import ts from "typescript";
import { extractModifiers, getReturnTypeOrAny } from "../../helper";
import { GetterDeclaration, GetterModifier } from "../../../model";

export const parseGetAccessor = (
  node: ts.GetAccessorDeclaration,
  checker: ts.TypeChecker,
): GetterDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<GetterModifier>(node.modifiers);
  const returnType = getReturnTypeOrAny(node, checker);

  const getterDeclaration: GetterDeclaration = {
    name,
    modifiers,
    returnType,
    kind: "getter",
  };

  console.log(getterDeclaration);
  return getterDeclaration;
};
