import ts from "typescript";
import { GetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";
import { checkTypeRules } from "../types";
import { checkAccessibilityBCs } from "./utils";

// Check return type
export const checkGetterRules = (
  v1Decl: GetterDeclaration,
  v2Decl: GetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const modifiersBC = checkAccessibilityBCs(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  // Check if the return type has changed
  const returnTypeBCs = checkTypeRules(
    v1Decl.returnType,
    v2Decl.returnType,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...returnTypeBCs);

  return breakingChanges;
};
