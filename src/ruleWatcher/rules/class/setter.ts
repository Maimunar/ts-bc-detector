import ts from "typescript";
import { SetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkSetterRules = (
  v1Decl: SetterDeclaration,
  v2Decl: SetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Setter rules are being checked", v1Decl.name);

  return breakingChanges;
};
