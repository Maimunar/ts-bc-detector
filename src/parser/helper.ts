import ts from "typescript";
import { Parameter } from "../model";

export function parseParameter(param: ts.ParameterDeclaration): Parameter {
  const name = (param.name as ts.Identifier).text;
  const type = param.type ? param.type.getText() : "any";

  let extraOperator: Parameter["extraOperator"] = "none";
  if (param.dotDotDotToken) extraOperator = "rest";
  else if (param.questionToken) extraOperator = "optional";
  else if (param.initializer) extraOperator = "initializer";

  const parameterDeclaration: Parameter = { name, type, extraOperator };

  if (param.initializer) {
    parameterDeclaration.initializer = param.initializer.getText();
  }

  return parameterDeclaration;
}

export function extractModifiers<T extends string>(
  modifiers?: ts.NodeArray<ts.ModifierLike>,
): T[] {
  if (!modifiers) return [];

  return modifiers.map((mod) => mod.getText()) as T[];
}
