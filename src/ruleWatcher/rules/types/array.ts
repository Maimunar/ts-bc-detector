import ts from "typescript";
import { isEffectivelyEqual } from "./utils";

export function compareArrayTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): string[] {
  const messages: string[] = [];

  const elemA = (checkerA as any).getTypeArguments(
    typeA as ts.TypeReference,
  )[0];
  const elemB = (checkerB as any).getTypeArguments(
    typeB as ts.TypeReference,
  )[0];

  if (!isEffectivelyEqual(elemA, elemB, checkerA, checkerB)) {
    messages.push(
      `❌ Array element type changed from '${checkerA.typeToString(elemA)}' to '${checkerB.typeToString(elemB)}'`,
    );
  }

  return messages;
}
