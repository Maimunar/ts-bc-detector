import ts from "typescript";
import { PropertyDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkPropertyRules = (
  v1Decl: PropertyDeclaration,
  v2Decl: PropertyDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Property rules are being checked", v1Decl.name);

  return breakingChanges;
};
