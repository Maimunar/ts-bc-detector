import ts from "typescript";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";

export function checkWrappedInGenerics(
  typeA: ts.Type,
  typeB: ts.Type,
  BCCreate: BCCreateType,
): BreakingChange | null {
  // Helper: Checks if type is generic instantiation
  const isGenericInstantiation = (t: ts.Type) =>
    (t.flags & ts.TypeFlags.Object) !== 0 &&
    !!((t as ts.ObjectType).objectFlags & ts.ObjectFlags.Reference);

  // Check if one is generic instantiation, other is not
  const aIsGeneric = isGenericInstantiation(typeA);
  const bIsGeneric = isGenericInstantiation(typeB);

  if (aIsGeneric && !bIsGeneric) {
    // e.g. Promise<string> vs string
    return BCCreate(BC.types.generic.removed);
  }
  if (!aIsGeneric && bIsGeneric) {
    // e.g. string vs Promise<string> (reverse)
    return BCCreate(BC.types.generic.added);
  }

  return null;
}
