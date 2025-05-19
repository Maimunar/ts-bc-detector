import ts from "typescript";
import { Parameter } from "../model";

export function parseParameter(
  param: ts.ParameterDeclaration,
  checker: ts.TypeChecker,
): Parameter {
  const name = (param.name as ts.Identifier).text;
  const type = getNodeTypeOrAny(param, checker);

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

export function getReturnTypeOrAny(
  node:
    | ts.FunctionDeclaration
    | ts.MethodDeclaration
    | ts.GetAccessorDeclaration,
  checker: ts.TypeChecker,
): ts.Type {
  const signature = checker.getSignatureFromDeclaration(node);
  if (signature) {
    return checker.getReturnTypeOfSignature(signature);
  }

  // fallback to `any`
  return fallbackAny(checker);
}

export function fallbackAny(checker: ts.TypeChecker): ts.Type {
  const anyNode = ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  return checker.getTypeFromTypeNode(anyNode);
}

export function getNodeTypeOrAny(
  node: ts.Node,
  checker: ts.TypeChecker,
): ts.Type {
  // Case 1: Node has an explicit type (e.g., `: string`)
  if (
    ts.isVariableDeclaration(node) ||
    ts.isParameter(node) ||
    ts.isPropertySignature(node) ||
    ts.isTypeAliasDeclaration(node)
  ) {
    if (node.type) return checker.getTypeFromTypeNode(node.type);
  }

  // Case 2: Try to infer type from symbol
  const symbol = checker.getSymbolAtLocation(
    (node as ts.NamedDeclaration).name!,
  );
  if (symbol) {
    return checker.getTypeOfSymbolAtLocation(symbol, node);
  }

  // Case 3: Fallback to `any`
  return fallbackAny(checker);
}
