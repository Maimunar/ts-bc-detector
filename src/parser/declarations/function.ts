import ts from "typescript";
import { FunctionDeclaration, FunctionModifier } from "../../model";
import { extractModifiers, parseParameter } from "../helper";

export function parseFunction(
  node: ts.FunctionDeclaration,
  checker: ts.TypeChecker,
): FunctionDeclaration | null {
  if (!node.name) return null;

  const name = node.name.text;
  const modifiers = extractModifiers<FunctionModifier>(node.modifiers);
  const parameters = node.parameters.map(parseParameter);

  let returnType: string | undefined;

  if (node.type) {
    // Explicit return type
    returnType = node.type.getText();
  } else {
    // Inferred return type
    const signature = checker.getSignatureFromDeclaration(node);
    if (signature) {
      const returnT = checker.getReturnTypeOfSignature(signature);
      returnType = checker.typeToString(returnT);
    }
  }

  const functionDeclaration: FunctionDeclaration = {
    name,
    modifiers,
    parameters,
    returnType,
    kind: "function",
  };

  console.log(functionDeclaration);

  return functionDeclaration;
}
