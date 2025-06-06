import ts from "typescript";
import { Type } from "../../../model";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";
import {
  isEffectivelyEqual,
  isGenericType,
  isPrimitiveType,
  isTypeLiteralType,
} from "./utils";
import { compareInterfaceTypes } from "./interface";
import { compareFunctionTypes } from "./function";
import { compareTupleTypes } from "./tuple";
import { compareArrayTypes } from "./array";
import { compareUnionTypes } from "./union";
import { compareIntersectionTypes } from "./intersection";
import { checkWrappedInGenerics } from "./generics";

export function checkTypeRules(
  typeA: Type,
  typeB: Type,
  BCCreate: BCCreateType,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];

  if (isEffectivelyEqual(typeA, typeB, checkerA, checkerB)) return [];

  // The system is limited due to generics, this makes BCs a warning if a generic type is involved
  const wFlag = isGenericType(typeA) || isGenericType(typeB);

  // Function
  const signatureA = getFunctionSignaturesFromType(typeA, checkerA);
  const signatureB = getFunctionSignaturesFromType(typeB, checkerB);
  const atleastOneIsFunction = signatureA.length > 0 || signatureB.length > 0;
  if (atleastOneIsFunction) {
    bcs.push(
      ...compareFunctionTypes(
        signatureA,
        checkerA,
        signatureB,
        checkerB,
        BCCreate,
        wFlag,
      ),
    );
  }

  // Tuples
  if (checkerA.isTupleType(typeA) || checkerB.isTupleType(typeB)) {
    bcs.push(
      ...compareTupleTypes(typeA, typeB, checkerA, checkerB, BCCreate, wFlag),
    );
  }

  // Arrays
  if (checkerA.isArrayType(typeA) || checkerB.isArrayType(typeB)) {
    bcs.push(
      ...compareArrayTypes(typeA, typeB, checkerA, checkerB, BCCreate, wFlag),
    );
  }

  // Interface/Object
  if (isTypeLiteralType(typeA) || isTypeLiteralType(typeB)) {
    // Function goes in here
    if (!atleastOneIsFunction) {
      bcs.push(
        ...compareInterfaceTypes(
          typeA,
          typeB,
          checkerA,
          checkerB,
          BCCreate,
          wFlag,
        ),
      );
    }
  }

  // Unions
  if (typeA.isUnion() || typeB.isUnion()) {
    bcs.push(
      ...compareUnionTypes(typeA, typeB, checkerA, checkerB, BCCreate, wFlag),
    );
  }

  // Intersections
  if (typeA.isIntersection() || typeB.isIntersection()) {
    bcs.push(
      ...compareIntersectionTypes(
        typeA,
        typeB,
        checkerA,
        checkerB,
        BCCreate,
        wFlag,
      ),
    );
  }

  // We check for any builtin types like promise through generics changed
  const genericsChangedBC = checkWrappedInGenerics(
    typeA,
    typeB,
    checkerA,
    checkerB,
    BCCreate,
  );
  if (genericsChangedBC) bcs.push(genericsChangedBC);

  // Here just check if the types substantially change
  if (
    isPrimitiveType(typeA, checkerA) &&
    isPrimitiveType(typeB, checkerB) &&
    !isEffectivelyEqual(typeA, typeB, checkerA, checkerB)
  ) {
    bcs.push(
      BCCreate(
        BC.types.changed(
          checkerA.typeToString(typeA),
          checkerB.typeToString(typeB),
        ),
      ),
    );
  }

  return bcs;
}

function getFunctionSignaturesFromType(
  type: ts.Type,
  checker: ts.TypeChecker,
): ts.Signature[] {
  // Prefer symbol if available, to reach the full set of declarations
  const symbol = type.getSymbol();
  if (!symbol)
    return [...checker.getSignaturesOfType(type, ts.SignatureKind.Call)];

  const declarations = symbol.getDeclarations() ?? [];
  const signatures: ts.Signature[] = [];

  for (const decl of declarations) {
    if (ts.isFunctionDeclaration(decl)) {
      const sig = checker.getSignatureFromDeclaration(decl);
      if (sig) signatures.push(sig);
    }
  }

  // Fallback if no signature found from declarations
  if (signatures.length === 0) {
    return [...checker.getSignaturesOfType(type, ts.SignatureKind.Call)];
  }

  return signatures;
}
