import ts from "typescript";
import { Type } from "../../../model";

export function isEffectivelyEqual(
  typeA: Type,
  typeB: Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): boolean {
  // If they have identical string representations, assume equal
  const strA = checkerA.typeToString(typeA);
  const strB = checkerB.typeToString(typeB);
  if (strA === strB) return true;

  if (!typeA || !typeB) return false;

  // If it is a type literal return false
  if (isTypeLiteralType(typeA) && isTypeLiteralType(typeB)) return false;

  // Special case: breaking changes for index keys
  if (isBreakingIndexedType(typeA, typeB, checkerA, checkerB)) return true;

  // Use assignability one-way
  return checkerA.isTypeAssignableTo(typeA, typeB);
}

const isBreakingIndexedType = (
  typeA: ts.Type,
  typeB: ts.Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
): boolean => {
  if (
    checkerA.isTupleType(typeA) ||
    checkerB.isTupleType(typeB) ||
    checkerA.isArrayType(typeA) ||
    checkerB.isArrayType(typeB)
  )
    return false;

  const indexInfoA = checkerA.getIndexInfosOfType(typeA)[0];
  const indexInfoB = checkerB.getIndexInfosOfType(typeB)[0];

  if (!indexInfoA || !indexInfoB) return false;

  const keyKindA = getIndexKeyKind(indexInfoA);
  const keyKindB = getIndexKeyKind(indexInfoB);

  const isNumberToString = keyKindA === "number" && keyKindB === "string";
  const isTemplateToString = keyKindA === "template" && keyKindB === "string";
  const isNotBreaking = isNumberToString || isTemplateToString;

  const valueA = indexInfoA.type;
  const valueB = indexInfoB.type;
  const aString = checkerA.typeToString(typeA);
  const bString = checkerB.typeToString(typeB);

  const sameValueType =
    aString === bString || checkerA.isTypeAssignableTo(valueA, valueB);

  if (isNotBreaking && sameValueType) return false;

  return true;
};

function getIndexKeyKind(
  info: ts.IndexInfo,
): "string" | "number" | "symbol" | "template" | "unknown" {
  const keyType = info.keyType;
  if (!keyType) return "unknown";

  const flags = keyType.flags;

  if ((flags & ts.TypeFlags.TemplateLiteral) !== 0) {
    return "template";
  }
  if ((flags & ts.TypeFlags.StringLike) !== 0) {
    return "string";
  }
  if ((flags & ts.TypeFlags.NumberLike) !== 0) {
    return "number";
  }
  if ((flags & ts.TypeFlags.ESSymbolLike) !== 0) {
    return "symbol";
  }

  return "unknown";
}

export function isGenericType(type: ts.Type): boolean {
  // Direct type parameter
  if (type.getFlags() & ts.TypeFlags.TypeParameter) {
    return true;
  }

  // Type reference (e.g., T in Array<T>)
  if (type.isUnionOrIntersection()) {
    return type.types.some(isGenericType);
  }

  if (type.aliasTypeArguments?.some(isGenericType)) {
    return true;
  }

  if (
    type.aliasSymbol &&
    type.aliasSymbol.getFlags() & ts.SymbolFlags.TypeParameter
  ) {
    return true;
  }

  // If it's a type reference (e.g., MyType<T>) – inspect the type arguments
  if (type.aliasTypeArguments && type.aliasTypeArguments.length > 0) {
    return type.aliasTypeArguments.some(isGenericType);
  }

  const symbol = type.getSymbol();
  if (symbol && symbol.getFlags() & ts.SymbolFlags.TypeParameter) {
    return true;
  }

  // If it's a reference to a generic type (like T inside an interface)
  if (type.isTypeParameter()) {
    return true;
  }
  return false;
}

export function isObjectType(t: ts.Type): t is ts.ObjectType {
  return (t.flags & ts.TypeFlags.Object) !== 0;
}

export function isTypeLiteralType(t: ts.Type): boolean {
  return (
    isObjectType(t) &&
    ((t.objectFlags & ts.ObjectFlags.Anonymous) !== 0 ||
      (t.objectFlags & ts.ObjectFlags.Mapped) !== 0)
  );
}

export function isOptionalParameter(sym: ts.Symbol): boolean {
  const decl = sym.valueDeclaration ?? sym.declarations?.[0];
  if (!decl || !ts.isParameter(decl)) return false;

  return (
    !!decl.questionToken || // param?: T
    !!decl.initializer // param = defaultValue
  );
}

export function isOptional(sym: ts.Symbol): boolean {
  return (sym.getFlags() & ts.SymbolFlags.Optional) !== 0;
}

export function isAnyOrUnknown(type: ts.Type): boolean {
  return (
    (type.flags & ts.TypeFlags.Any) !== 0 ||
    (type.flags & ts.TypeFlags.Unknown) !== 0
  );
}

export function isNumberKeyword(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.Number) !== 0;
}

export function isNumberLiteral(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.NumberLiteral) !== 0;
}

export function isStringKeyword(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.String) !== 0;
}

export function isStringLiteral(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.StringLiteral) !== 0;
}

export function isBooleanKeyword(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.Boolean) !== 0;
}

export function isBooleanLiteral(type: ts.Type): boolean {
  return (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
}

export function isObjectKeyword(
  type: ts.Type,
  checker: ts.TypeChecker,
): boolean {
  return checker.typeToString(type) === "object";
}

export function isTupleType(type: ts.Type): boolean {
  return (
    (type.getFlags() & ts.TypeFlags.Object) !== 0 &&
    ((type as ts.ObjectType).objectFlags & ts.ObjectFlags.Tuple) !== 0
  );
}

export function isFunctionType(type: ts.Type): boolean {
  return type.getCallSignatures().length > 0;
}

export function isArrayType(type: ts.Type): boolean {
  return (
    (type.symbol?.name === "Array" || type.symbol?.escapedName === "Array") &&
    !!(type as ts.TypeReference).typeArguments
  );
}

export function isPrimitiveType(
  type: ts.Type,
  checker: ts.TypeChecker,
): boolean {
  const flags = ts.TypeFlags;
  return (
    (type.flags & flags.String) !== 0 ||
    (type.flags & flags.Number) !== 0 ||
    (type.flags & flags.Boolean) !== 0 ||
    (type.flags & flags.BigInt) !== 0 ||
    (type.flags & flags.ESSymbol) !== 0 ||
    (type.flags & flags.Null) !== 0 ||
    (type.flags & flags.Undefined) !== 0 ||
    (type.flags & flags.Never) !== 0 ||
    (type.flags & flags.Void) !== 0 ||
    (type.flags & flags.Any) !== 0 ||
    (type.flags & flags.Unknown) !== 0 ||
    (!isTypeLiteralType(type) &&
      !checker.isArrayLikeType(type) &&
      (type.flags & flags.Object) !== 0) ||
    (type.flags & flags.StringLiteral) !== 0 ||
    (type.flags & flags.NumberLiteral) !== 0 ||
    (type.flags & flags.BooleanLiteral) !== 0 ||
    (type.flags & flags.BigIntLiteral) !== 0 ||
    (type.flags & flags.TemplateLiteral) !== 0 ||
    (type.flags & flags.Literal) !== 0 // includes other literal-like types
  );
}
