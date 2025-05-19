import ts from "typescript";
import { MethodDeclaration, MethodModifier } from "../../../model";
import {
  extractModifiers,
  getReturnTypeOrAny,
  parseParameter,
} from "../../helper";

export const parseMethod = (
  node: ts.MethodDeclaration,
  checker: ts.TypeChecker,
): MethodDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<MethodModifier>(node.modifiers);
  const parameters = node.parameters.map((param) =>
    parseParameter(param, checker),
  );
  const returnType = getReturnTypeOrAny(node, checker);

  const methodDeclaration: MethodDeclaration = {
    name,
    modifiers,
    parameters,
    returnType,
    kind: "method",
  };

  return methodDeclaration;
};
