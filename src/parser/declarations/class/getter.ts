import ts from "typescript";
import { extractModifiers } from "../../helper";
import { GetterDeclaration, GetterModifier } from "../../../model";

export const parseGetAccessor = (
  node: ts.GetAccessorDeclaration,
  checker: ts.TypeChecker,
): GetterDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<GetterModifier>(node.modifiers);

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

  const getterDeclaration: GetterDeclaration = {
    name,
    modifiers,
    returnType,
    kind: "getter",
  };

  console.log(getterDeclaration);
  return getterDeclaration;
};
