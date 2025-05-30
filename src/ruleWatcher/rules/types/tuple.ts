import ts from "typescript";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";
import { isAnyOrUnknown, isEffectivelyEqual, isObjectKeyword } from "./utils";

export function compareTupleTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const breakingChanges: BreakingChange[] = [];
  if (!checkerA.isTupleType(typeA)) {
    return [BCCreate(BC.types.tuple.added, warningFlag)];
  }
  if (!checkerB.isTupleType(typeB)) {
    if (isObjectKeyword(typeB, checkerB) || isAnyOrUnknown(typeB)) return [];

    if (isTupleAssignableToArray(typeA, typeB, checkerA, checkerB)) return [];

    return [BCCreate(BC.types.tuple.removed, warningFlag)];
  }

  const elementsA = [...checkerA.getTypeArguments(typeA as ts.TypeReference)];
  const elementsB = [...checkerB.getTypeArguments(typeB as ts.TypeReference)];

  if (elementsA.length > elementsB.length) {
    breakingChanges.push(BCCreate(BC.types.tuple.itemRemoved, warningFlag));
  }
  if (elementsA.length < elementsB.length) {
    breakingChanges.push(BCCreate(BC.types.tuple.itemAdded, warningFlag));
  }

  const minLen = Math.min(elementsA.length, elementsB.length);

  for (let i = 0; i < minLen; i++) {
    const tA = elementsA[i];
    const tB = elementsB[i];
    if (!isEffectivelyEqual(tA, tB, checkerA, checkerB)) {
      breakingChanges.push(
        BCCreate(BC.types.tuple.itemTypeChanged(i), warningFlag),
      );
    }
  }

  return breakingChanges;
}

export function isTupleAssignableToArray(
  tupleType: ts.Type,
  arrayType: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): boolean {
  // Check that tupleType is a tuple
  if (!checkerA.isTupleType(tupleType)) return false;

  // Ensure arrayType is an array
  const arrayElementType = getElementTypeOfArray(arrayType, checkerB);
  if (!arrayElementType) return false;

  // Get tuple element types
  const tupleElements = checkerA.getTypeArguments(
    tupleType as ts.TypeReference,
  );

  // Check if all tuple elements are assignable to array element type
  return tupleElements.every((tupleEl) =>
    isEffectivelyEqual(tupleEl, arrayElementType, checkerA, checkerB),
  );
}

function getElementTypeOfArray(
  type: ts.Type,
  checker: ts.TypeChecker,
): ts.Type | null {
  if (!(type.flags & ts.TypeFlags.Object)) return null;

  const symbol = type.getSymbol();
  if (!symbol || symbol.name !== "Array") {
    // Try resolving for shorthand like string[]
    const numberIndex = checker.getIndexInfoOfType(type, ts.IndexKind.Number);
    return numberIndex?.type || null;
  }

  const typeArgs = checker.getTypeArguments(type as ts.TypeReference);
  return typeArgs.length > 0 ? typeArgs[0] : null;
}
