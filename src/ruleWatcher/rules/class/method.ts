import ts from "typescript";
import { MethodDeclaration } from "../../../model";
import { BC, BreakingChange } from "../../../model/bcs";
import { checkAccessibilityBCs } from "./utils";
import { BCCreateType } from "../../utils";
import { checkParam, checkParamAdded, hasModifier } from "../utils";
import { checkTypeRules } from "../types";

//- Adding and removing static is a BC
//- Adding and removing abstract is a BC
const checkModifiers = (
  v1Decl: MethodDeclaration,
  v2Decl: MethodDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const hasStatic = hasModifier("static");

  // Removing static
  if (hasStatic(v1Decl)) {
    if (!hasStatic(v2Decl)) {
      breakingChanges.push(BCCreate(BC.class.modifiers.removedStatic));
    }
    // Adding static
  } else if (hasStatic(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedStatic));
  }

  const hasAbstract = hasModifier("abstract");
  // Removing abstract
  if (hasAbstract(v1Decl)) {
    if (!hasAbstract(v2Decl)) {
      breakingChanges.push(BCCreate(BC.class.modifiers.removedAbstract));
    }
    // Adding abstract
  } else if (hasAbstract(v2Decl)) {
    breakingChanges.push(BCCreate(BC.class.modifiers.addedAbstract));
  }

  return breakingChanges;
};

export const checkMethodRules = (
  v1Decl: MethodDeclaration,
  v2Decl: MethodDeclaration,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  // Check accessibility
  const accessibilityBCs = checkAccessibilityBCs(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...accessibilityBCs);

  // Check modifiers
  const modifiersBCs = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBCs);

  // Check params
  const paramAddedBreakingChanges = checkParamAdded(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...paramAddedBreakingChanges);

  const paramBreakingChanges = checkParam(
    v1Decl,
    v2Decl,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...paramBreakingChanges);

  // Check return type
  const returnTypeBreakingChanges = checkTypeRules(
    v1Decl.returnType,
    v2Decl.returnType,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...returnTypeBreakingChanges);

  return breakingChanges;
};
