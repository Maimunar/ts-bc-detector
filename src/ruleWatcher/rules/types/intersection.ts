import ts from "typescript";
import { BCCreateType } from "../../utils";
import { BC, BreakingChange } from "../../../model/bcs";

export function compareIntersectionTypes(
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];

  const aTypes = typeA.isIntersection() ? typeA.types : [typeA];
  const bTypes = typeB.isIntersection() ? typeB.types : [typeB];

  const typeStrA = new Set(aTypes.map((t) => checkerA.typeToString(t)));

  for (const added of bTypes) {
    const addedStr = checkerB.typeToString(added);
    if (typeStrA.has(addedStr)) continue;
    // Any or unknown is always allowed
    if (added.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) continue;

    // ── Object keyword logic ──
    if (
      addedStr === "object" &&
      aTypes.some(
        (t) =>
          isFunctionLike(t, checkerA) ||
          isTypeLiteral(t) ||
          isArrayOrTuple(t, checkerA),
      )
    ) {
      continue;
    }
    // ── Keyword vs Literal logic ──
    if (
      isKeywordCoveringLiterals(added, aTypes, checkerB, checkerA) ||
      isLiteralCoveredByKeywords(added, aTypes, checkerB, checkerA)
    ) {
      continue;
    }

    // ── Array/Tuple of keyword vs literal ──
    if (isArrayLiteralFamilyCovered(added, aTypes, checkerB, checkerA)) {
      continue;
    }

    bcs.push(
      BCCreate(BC.types.intersection.memberAdded(addedStr), warningFlag),
    );
  }

  return bcs;
}

// Helper: Checks if a type is a function
function isFunctionLike(type: ts.Type, checker: ts.TypeChecker): boolean {
  return checker.getSignaturesOfType(type, ts.SignatureKind.Call).length > 0;
}

// Helper: Type literal detection
function isTypeLiteral(type: ts.Type): boolean {
  return (
    (type.flags & ts.TypeFlags.Object) !== 0 &&
    !!((type as ts.ObjectType).objectFlags & ts.ObjectFlags.Anonymous)
  );
}

// Helper: Array or Tuple
function isArrayOrTuple(type: ts.Type, checker: ts.TypeChecker): boolean {
  return checker.isArrayType(type) || checker.isTupleType(type);
}

// ───────────────────────────────
// Keyword (e.g. number) added, literals (e.g. 1, 2) already present
function isKeywordCoveringLiterals(
  added: ts.Type,
  existing: ts.Type[],
  checkerB: ts.TypeChecker,
  checkerA: ts.TypeChecker,
): boolean {
  if (added.flags & ts.TypeFlags.Number) {
    return existing.some((t) => isNumberLiteral(t));
  }
  if (added.flags & ts.TypeFlags.String) {
    return existing.some((t) => isStringLiteral(t));
  }
  if (added.flags & ts.TypeFlags.Boolean) {
    return existing.some((t) => isBooleanLiteral(t));
  }
  return false;
}

// Literal (e.g. 42) added, keyword (e.g. number) already present
function isLiteralCoveredByKeywords(
  added: ts.Type,
  existing: ts.Type[],
  checkerB: ts.TypeChecker,
  checkerA: ts.TypeChecker,
): boolean {
  if (isNumberLiteral(added)) {
    return existing.some((t) => t.flags & ts.TypeFlags.Number);
  }
  if (isStringLiteral(added)) {
    return existing.some((t) => t.flags & ts.TypeFlags.String);
  }
  if (isBooleanLiteral(added)) {
    return existing.some((t) => t.flags & ts.TypeFlags.Boolean);
  }
  return false;
}

// Array<T> added, Array<literal> already exists (or vice versa)
function isArrayLiteralFamilyCovered(
  added: ts.Type,
  existing: ts.Type[],
  checkerB: ts.TypeChecker,
  checkerA: ts.TypeChecker,
): boolean {
  if (!checkerB.isArrayType(added)) return false;

  const argsAdded = (checkerB as any).getTypeArguments(
    added as ts.TypeReference,
  ) as ts.Type[];
  if (!argsAdded?.[0]) return false;

  const argAdded = argsAdded[0];

  for (const exist of existing) {
    if (!checkerA.isArrayType(exist)) continue;

    const argsExist = (checkerA as any).getTypeArguments(
      exist as ts.TypeReference,
    ) as ts.Type[];
    if (!argsExist?.[0]) continue;

    const argExist = argsExist[0];

    // number[] vs 1[]
    if (
      (isNumberLiteral(argExist) && argAdded.flags & ts.TypeFlags.Number) ||
      (isNumberLiteral(argAdded) && argExist.flags & ts.TypeFlags.Number)
    )
      return true;

    if (
      (isStringLiteral(argExist) && argAdded.flags & ts.TypeFlags.String) ||
      (isStringLiteral(argAdded) && argExist.flags & ts.TypeFlags.String)
    )
      return true;

    if (
      (isBooleanLiteral(argExist) && argAdded.flags & ts.TypeFlags.Boolean) ||
      (isBooleanLiteral(argAdded) && argExist.flags & ts.TypeFlags.Boolean)
    )
      return true;
  }

  return false;
}

// Literal flag helpers
const isNumberLiteral = (t: ts.Type) =>
  (t.flags & ts.TypeFlags.NumberLiteral) !== 0;
const isStringLiteral = (t: ts.Type) =>
  (t.flags & ts.TypeFlags.StringLiteral) !== 0;
const isBooleanLiteral = (t: ts.Type) =>
  (t.flags & ts.TypeFlags.BooleanLiteral) !== 0;
