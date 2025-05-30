import ts from "typescript";
import { isAnyOrUnknown, isEffectivelyEqual, isObjectKeyword } from "./utils";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";

export function compareArrayTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  // Adding array
  if (!checkerA.isArrayType(typeA)) {
    // If a tuple to an array, the logic is handled in the tuple rules
    if (checkerA.isTupleType(typeA)) return [];
    if (
      (typeA.isUnion() || typeA.isIntersection()) &&
      typeA.types.some((t) => checkerA.isArrayType(t))
    )
      return [];

    return [BCCreate(BC.types.array.added)];
  }

  // Removing array
  if (!checkerB.isArrayType(typeB)) {
    if (isAnyOrUnknown(typeB)) return [];
    if (isObjectKeyword(typeB, checkerB)) return [];
    if (
      (typeA.isUnion() || typeA.isIntersection()) &&
      typeA.types.some((t) => checkerA.isArrayType(t))
    )
      return [];

    return [BCCreate(BC.types.array.removed)];
  }

  const breakingChanges: BreakingChange[] = [];

  const elemA = checkerA.getTypeArguments(typeA as ts.TypeReference)[0];
  const elemB = checkerB.getTypeArguments(typeB as ts.TypeReference)[0];

  if (!isEffectivelyEqual(elemA, elemB, checkerA, checkerB)) {
    breakingChanges.push(BCCreate(BC.types.array.baseTypeChanged, warningFlag));
  }

  return breakingChanges;
}
