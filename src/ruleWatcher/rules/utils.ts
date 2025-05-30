import ts from "typescript";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import {
  ClassMember,
  ConstructorDeclaration,
  Declaration,
  FunctionDeclaration,
  MethodDeclaration,
  Parameter,
} from "../../model";
import { checkTypeRules } from "./types";

export const checkParamAdded = (
  v1Decl: FunctionDeclaration | ConstructorDeclaration | MethodDeclaration,
  v2Decl: FunctionDeclaration | ConstructorDeclaration | MethodDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];
  // Check if there are any parameters added to v2; note that parameters are ordered
  // If there are, check if there's any of them with no special operators
  if (v1Decl.parameters.length < v2Decl.parameters.length) {
    const addedParams = v2Decl.parameters.slice(v1Decl.parameters.length);

    for (const { name, extraOperator } of addedParams) {
      if (extraOperator === "none") {
        breakingChanges.push(BCCreate(BC.parameter.added(name)));
      }
    }
  }

  return breakingChanges;
};

export const checkParam = (
  v1Decl: FunctionDeclaration | ConstructorDeclaration | MethodDeclaration,
  v2Decl: FunctionDeclaration | ConstructorDeclaration | MethodDeclaration,
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
    const v1Type = getParameterType(v1Param, v1Checker);
    const v2Type = getParameterType(v2Param, v1Checker);

    const typeBCs = checkTypeRules(
      v1Type,
      v2Type,
      BCCreate,
      v1Checker,
      v2Checker,
    );
    breakingChanges.push(...typeBCs);
  }

  return breakingChanges;
};

interface Modifiered {
  modifiers: string[];
}
interface WithModifiers extends Modifiered {}

export const hasModifier =
  (modifier: string) =>
  (decl: (Declaration | ClassMember) & WithModifiers): boolean => {
    return !!decl.modifiers?.some((m) => m === modifier);
  };

function getParameterType(param: Parameter, checker: ts.TypeChecker): ts.Type {
  const { extraOperator, type } = param;

  if (extraOperator === "rest") {
    if (checker.isArrayType(type)) {
      const typeArgs = checker.getTypeArguments(type as ts.TypeReference);
      return typeArgs[0];
    }
  }

  return type;
}
