import ts from "typescript";
import { SetterDeclaration, SetterModifier } from "../../../model";
import { extractModifiers, parseParameter } from "../../helper";

export const parseSetAccessor = (
  node: ts.SetAccessorDeclaration,
  checker: ts.TypeChecker,
): SetterDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<SetterModifier>(node.modifiers);
  const parameter = parseParameter(node.parameters[0], checker);
  const setterDeclaration: SetterDeclaration = {
    name,
    modifiers,
    parameter,
    kind: "setter",
  };

  return setterDeclaration;
};
