import ts from "typescript";
import { FunctionDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";

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

const checkParamAdded = (
  v1Decl: FunctionDeclaration,
  v2Decl: FunctionDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];
  // Check if there are any parameters added to v2; note that parameters are ordered
  // If there are, check if there's any of them with no special operators
  if (v1Decl.parameters.length < v2Decl.parameters.length) {
    const addedParams = v2Decl.parameters.slice(v1Decl.parameters.length);

    for (const { name, extraOperator } of addedParams) {
      if (extraOperator === "none")
        breakingChanges.push(BCCreate(BC.parameter.added(name)));
    }
  }

  return breakingChanges;
};

const checkParam = (
  v1Decl: FunctionDeclaration,
  v2Decl: FunctionDeclaration,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  for (let i = 0; i < v1Decl.parameters.length; i++) {
    const v1Param = v1Decl.parameters[i];
    const v2Param = v2Decl.parameters[i];

    // Param Removed
    if (!v2Param) {
      breakingChanges.push(BCCreate(BC.parameter.removed(v1Param.name)));
      continue;
    }

    // Rest param changed to optional, no operator or initializer
    if (v1Param.extraOperator === "rest") {
      if (v2Param.extraOperator === "none") {
        breakingChanges.push(
          BCCreate(BC.parameter.restToNoOperator(v1Param.name)),
        );
      } else if (v2Param.extraOperator === "initializer") {
        breakingChanges.push(
          BCCreate(BC.parameter.restToInitializer(v1Param.name)),
        );
      } else if (v2Param.extraOperator === "optional") {
        breakingChanges.push(
          BCCreate(BC.parameter.restToOptional(v1Param.name)),
        );
      }
    }

    // Optional operator removed
    if (
      v1Param.extraOperator === "optional" &&
      v2Param.extraOperator === "none"
    ) {
      breakingChanges.push(
        BCCreate(BC.parameter.optionalToNoOperator(v1Param.name)),
      );
    }
    // Initializer removed
    if (
      v1Param.extraOperator === "initializer" &&
      v2Param.extraOperator === "none"
    ) {
      breakingChanges.push(
        BCCreate(BC.parameter.initializerToNoOperator(v1Param.name)),
      );
    }

    // Check Types
    const typeBCs = checkTypeRules(
      v1Param.type,
      v2Param.type,
      BCCreate,
      v1Checker,
      v2Checker,
    );
    breakingChanges.push(...typeBCs);
  }

  return breakingChanges;
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
