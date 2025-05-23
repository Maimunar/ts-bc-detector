import ts from "typescript";
import { GetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

// Check return type
export const checkGetterRules = (
  v1Decl: GetterDeclaration,
  v2Decl: GetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Getter rules are being checked", v1Decl.name);

  return breakingChanges;
};
