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
  const parameters = node.parameters.map((param) =>
    parseParameter(param, checker),
  );

  const setterDeclaration: SetterDeclaration = {
    name,
    modifiers,
    parameters,
    kind: "setter",
  };

  console.log(setterDeclaration);
  return setterDeclaration;
};
