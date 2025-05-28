import ts from "typescript";

export function compareTupleTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): string[] {
  const messages: string[] = [];

  const elementsA = (checkerA as any).getTypeArguments(
    typeA as ts.TypeReference,
  ) as ts.Type[];
  const elementsB = (checkerB as any).getTypeArguments(
    typeB as ts.TypeReference,
  ) as ts.Type[];

  if (elementsA.length !== elementsB.length) {
    messages.push(
      `❌ Tuple length changed: ${elementsA.length} -> ${elementsB.length}`,
    );
    return messages;
  }

  for (let i = 0; i < elementsA.length; i++) {
    const tA = elementsA[i];
    const tB = elementsB[i];
    if (!isEffectivelyEqual(tA, tB, checkerA, checkerB)) {
      messages.push(
        `❌ Tuple element ${i + 1} changed from '${checkerA.typeToString(tA)}' to '${checkerB.typeToString(tB)}'`,
      );
    }
  }

  return messages;
}
