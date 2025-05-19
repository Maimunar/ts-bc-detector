import ts from "typescript";
import { FunctionDeclaration, FunctionModifier } from "../../model";
import {
  extractModifiers,
  getReturnTypeOrAny,
  parseParameter,
} from "../helper";

export function parseFunction(
  node: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
): FunctionDeclaration | null {
  if (!node.name) return null;

  const name = node.name.text;
  const modifiers = extractModifiers<FunctionModifier>(node.modifiers);
  const parameters = node.parameters.map((param) =>
    parseParameter(param, checker),
  );

  const returnType = getReturnTypeOrAny(node, checker);

  const functionDeclaration: FunctionDeclaration = {
    name,
    modifiers,
    parameters,
    returnType,
    kind: "function",
  };

  return functionDeclaration;
}
