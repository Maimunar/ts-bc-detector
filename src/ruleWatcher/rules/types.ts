import ts from "typescript";
import { Type } from "../../model";
import { BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";

export const checkTypeRules = (
  v1Decl: Type,
  v2Decl: Type,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Type rules are being checked");

  return breakingChanges;
};
