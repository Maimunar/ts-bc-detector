import ts from "typescript";
import { Type } from "../../../model";
import { BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";
import { isEffectivelyEqual, isGenericType, isTypeLiteralType } from "./utils";
import { compareInterfaceTypes } from "./interface";
import { compareFunctionTypes } from "./function";

export function checkTypeRules(
  typeA: Type,
  typeB: Type,
  BCCreate: BCCreateType,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];
  if (isEffectivelyEqual(typeA, typeB, checkerA, checkerB)) {
    return [];
  }

  // The system is limited due to generics, this makes BCs a warning if a generic type is involved
  const wFlag = isGenericType(typeA) || isGenericType(typeB);
  if (wFlag) console.log("Generic caught", typeA, typeB);

  // Interface/Object
  if (isTypeLiteralType(typeA) && isTypeLiteralType(typeB)) {
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

  // Function
  const signatureA = getFunctionSignaturesFromType(typeA, checkerA);
  const signatureB = getFunctionSignaturesFromType(typeB, checkerB);
  if (signatureA.length > 0 || signatureB.length > 0) {
    bcs.push(
      ...compareFunctionTypes(signatureA, checkerA, signatureB, checkerB),
    );
  }
  //
  //// Tuples
  //if (checkerA.isTupleType(typeA) && checkerB.isTupleType(typeB)) {
  //  messages.push(...compareTupleTypes(typeA, checkerA, typeB, checkerB));
  //}
  //
  //// Arrays
  //if (checkerA.isArrayType(typeA) && checkerB.isArrayType(typeB)) {
  //  messages.push(...compareArrayTypes(typeA, checkerA, typeB, checkerB));
  //}
  //
  //if (typeA.isUnion() && typeB.isUnion()) {
  //  messages.push(...compareUnionTypes(typeA, checkerA, typeB, checkerB));
  //}
  //
  //if (typeA.isIntersection() && typeB.isIntersection()) {
  //  messages.push(
  //    ...compareIntersectionTypes(typeA, checkerA, typeB, checkerB),
  //  );
  //}

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

function getImplementationSignature(
  type: ts.Type,
  checker: ts.TypeChecker,
): ts.Signature | undefined {
  const callSignatures = checker.getSignaturesOfType(
    type,
    ts.SignatureKind.Call,
  );

  // Implementation signature typically has a declaration with a body
  return callSignatures.find((sig) => {
    const decl = sig.getDeclaration();
    // @ts-expect-error stuff
    return decl && ts.isFunctionLike(decl) && !!decl.body;
  });
}
