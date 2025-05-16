import ts from "typescript";
import { MethodDeclaration, MethodModifier } from "../../../model";
import { extractModifiers, parseParameter } from "../../helper";

export const parseMethod = (
  node: ts.MethodDeclaration,
  checker: ts.TypeChecker,
): MethodDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<MethodModifier>(node.modifiers);
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

  const methodDeclaration: MethodDeclaration = {
    name,
    modifiers,
    parameters,
    returnType,
    kind: "method",
  };

  console.log(methodDeclaration);
  return methodDeclaration;
};
