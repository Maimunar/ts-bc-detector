import ts from "typescript";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";
import {
  isAnyOrUnknown,
  isArrayType,
  isBooleanKeyword,
  isBooleanLiteral,
  isFunctionType,
  isNumberKeyword,
  isNumberLiteral,
  isObjectKeyword,
  isStringKeyword,
  isStringLiteral,
  isTupleType,
  isTypeLiteral,
} from "./utils";

export function compareUnionTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];
  const membersA = typeA.isUnion() ? typeA.types : [typeA];
  const membersB = typeB.isUnion() ? typeB.types : [typeB];

  // If there's any/unknown in B, all removals are safe
  if (membersB.some(isAnyOrUnknown)) {
    return bcs;
  }

  const stringsB = new Set(membersB.map((t) => checkerB.typeToString(t)));

  for (const type of membersA) {
    const typeStr = checkerA.typeToString(type);

    if (stringsB.has(typeStr)) continue; // still present

    // Try to determine if the type is "covered" by a broader type in B
    const isCovered = membersB.some((t) =>
      isCoveredByBroaderType(type, t, checkerB),
    );
    if (!isCovered) {
      bcs.push(BCCreate(BC.types.union.memberRemoved(typeStr), warningFlag));
    }
  }

  return bcs;
}

function isCoveredByBroaderType(
  removed: ts.Type,
  broader: ts.Type,
  broaderChecker: ts.TypeChecker,
): boolean {
  if (isNumberLiteral(removed) && isNumberKeyword(broader)) return true;
  if (isStringLiteral(removed) && isStringKeyword(broader)) return true;
  if (isBooleanLiteral(removed) && isBooleanKeyword(broader)) return true;

  // object subsuming array, tuple, function, type literal
  if (
    isObjectKeyword(broader, broaderChecker) &&
    (isTupleType(removed) ||
      isFunctionType(removed) ||
      isTypeLiteral(removed) ||
      isArrayType(removed))
  ) {
    return true;
  }

  return false;
}
