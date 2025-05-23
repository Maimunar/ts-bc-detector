import ts from "typescript";
import { FunctionDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";
import { checkParam, checkParamAdded } from "./paramUtils";

const checkModifiers = (
  v1Decl: FunctionDeclaration,
  v2Decl: FunctionDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  if (v1Decl.modifiers?.some((m) => m === "export")) {
    if (!v2Decl.modifiers?.some((m) => m === "export")) {
      return [BCCreate(BC.modifiers.removedExport)];
    }
  }

  if (v1Decl.modifiers?.some((m) => m === "default")) {
    if (!v2Decl.modifiers?.some((m) => m === "default")) {
      return [BCCreate(BC.modifiers.removedDefault)];
    }
  } else {
    if (v2Decl.modifiers?.some((m) => m === "default")) {
      return [BCCreate(BC.modifiers.addedDefault)];
    }
  }

  return [];
};

export const checkFunctionRules = (
  v1Decl: FunctionDeclaration,
  v2Decl: FunctionDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Function Declaration rules are being checked", v1Decl.name);

  const modifierBreakingChanges = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifierBreakingChanges);

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
