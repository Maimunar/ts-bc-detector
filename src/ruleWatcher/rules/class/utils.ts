import {
  ClassDeclaration,
  ConstructorDeclaration,
  GetterDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
  SetterDeclaration,
} from "../../../model";
import { BC, BreakingChange } from "../../../model/bcs";
import { hasModifier } from "../utils";

export const bcConstructorAdded = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
): boolean => {
  const v1Constructor = v1Class.members.find((m) => m.kind === "constructor");
  if (v1Constructor) return false;

  const v2Constructor = v2Class.members.find((m) => m.kind === "constructor");
  if (!v2Constructor) return false;

  if (isConstructorBC(v2Constructor)) return true;

  return false;
};

export const isConstructorBC = (decl: ConstructorDeclaration): boolean => {
  for (const param of decl.parameters) {
    if (param.extraOperator === "none") return true;
  }
  return false;
};

export const checkAccessibilityBCs = (
  v1Decl:
    | GetterDeclaration
    | SetterDeclaration
    | MethodDeclaration
    | PropertyDeclaration,
  v2Decl:
    | GetterDeclaration
    | SetterDeclaration
    | MethodDeclaration
    | PropertyDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const hasPublic = hasModifier("public");
  const hasPrivate = hasModifier("private");
  const hasProtected = hasModifier("protected");
  const v1NoAccessibilityModifier =
    !hasPublic(v1Decl) && !hasProtected(v1Decl) && !hasPrivate(v1Decl);

  if (hasPublic(v1Decl) || v1NoAccessibilityModifier) {
    if (hasPrivate(v2Decl)) {
      return [BCCreate(BC.class.modifiers.publicToPrivate)];
    }
    if (hasProtected(v2Decl)) {
      return [BCCreate(BC.class.modifiers.publicToProtected)];
    }
  }
  if (hasProtected(v1Decl)) {
    // if it is private or it doesnt have a keyword
    if (hasPrivate(v2Decl)) {
      return [BCCreate(BC.class.modifiers.protectedToPrivate)];
    }
  }

  return [];
};
