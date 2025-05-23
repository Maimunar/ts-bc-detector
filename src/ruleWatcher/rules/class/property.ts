import ts from "typescript";
import { PropertyDeclaration } from "../../../model";
import { BC, BreakingChange } from "../../../model/bcs";
import { checkAccessibilityBCs } from "./utils";
import { BCCreateType } from "../../utils";
import { checkTypeRules } from "../types";
import { hasModifier } from "../utils";

//- Adding and removing the static keyword is a BC.
//- Adding the readonly keyword is a BC, but removing it is not.
//- Adding and removing the abstract and declare keywords is a BC.
const checkModifiers = (
  v1Decl: PropertyDeclaration,
  v2Decl: PropertyDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const hasStatic = hasModifier("static");
  const hasReadonly = hasModifier("readonly");
  const hasAbstract = hasModifier("abstract");
  const hasDeclare = hasModifier("declare");
  // Adding static
  if (!hasStatic(v1Decl) && hasStatic(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedStatic));
  }
  // Removing static
  if (hasStatic(v1Decl) && !hasStatic(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.removedStatic));
  }
  // Adding readonly
  if (!hasReadonly(v1Decl) && hasReadonly(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedReadonly));
  }
  // Adding abstract
  if (!hasAbstract(v1Decl) && hasAbstract(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedAbstract));
  }
  // Removing abstract
  if (hasAbstract(v1Decl) && !hasAbstract(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.removedAbstract));
  }
  // Adding declare
  if (!hasDeclare(v1Decl) && hasDeclare(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedDeclare));
  }
  // Removing declare
  if (hasDeclare(v1Decl) && !hasDeclare(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.removedDeclare));
  }
  return breakingChanges;
};

export const checkPropertyRules = (
  v1Decl: PropertyDeclaration,
  v2Decl: PropertyDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Property rules are being checked", v1Decl.name);

  // Check accessibility
  const accessibilityBCs = checkAccessibilityBCs(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...accessibilityBCs);

  // Check modifiers
  const modifiersBCs = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBCs);

  // Check type
  const typeBCs = checkTypeRules(
    v1Decl.type,
    v2Decl.type,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...typeBCs);

  return breakingChanges;
};
