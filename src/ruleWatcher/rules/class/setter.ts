import ts from "typescript";
import { SetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";
import { checkTypeRules } from "../types";
import { checkAccessibilityBCs } from "./utils";

export const checkSetterRules = (
  v1Decl: SetterDeclaration,
  v2Decl: SetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const accessibilityBCs = checkAccessibilityBCs(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...accessibilityBCs);

  console.log("Setter rules are being checked", v1Decl.name);
  // Check if the param types have changed
  const paramTypeBCs = checkTypeRules(
    v1Decl.parameter.type,
    v2Decl.parameter.type,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...paramTypeBCs);

  return breakingChanges;
};
