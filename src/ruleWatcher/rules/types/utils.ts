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

  // Use assignability one-way
  const assignable = checkerA.isTypeAssignableTo(typeA, typeB);

  return assignable;
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
  return isObjectType(t) && (t.objectFlags & ts.ObjectFlags.Anonymous) !== 0;
}
