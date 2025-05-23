import ts from "typescript";
import { ConstructorDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";
import { checkParam, checkParamAdded } from "../utils";

//1. Adding and removing a parameter with its rules is following the function analysis in terms of BCs and operators
export const checkConstructorRules = (
  v1Decl: ConstructorDeclaration,
  v2Decl: ConstructorDeclaration,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const paramAddedBreakingChanges = checkParamAdded(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...paramAddedBreakingChanges);

  const paramBreakingChange = checkParam(
    v1Decl,
    v2Decl,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...paramBreakingChange);

  return breakingChanges;
};
