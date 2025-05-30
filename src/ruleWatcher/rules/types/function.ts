import ts from "typescript";
import { isEffectivelyEqual, isOptional, isOptionalParameter } from "./utils";
import { BC, BreakingChange } from "../../../model/bcs";
import { BCCreateType } from "../../utils";

export function compareFunctionTypes(
  sigsA: ts.Signature[],
  checkerA: ts.TypeChecker,
  sigsB: ts.Signature[],
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const breakingChanges: BreakingChange[] = [];
  if (sigsA.length !== sigsB.length) {
    if (sigsA.length == 0) {
      return [BCCreate(BC.types.function.added, warningFlag)];
    }
    if (sigsB.length == 0) {
      return [BCCreate(BC.types.function.removed, warningFlag)];
    }
    return [BCCreate(BC.types.function.overload, true)];
  }

  for (let i = 0; i < sigsA.length; i++) {
    const sigA = sigsA[i];
    const sigB = sigsB[i];

    const paramsA = sigA.getParameters();
    const paramsB = sigB.getParameters();

    // Removed parameters
    if (paramsA.length > paramsB.length) {
      for (let j = paramsB.length; j < paramsA.length; j++) {
        const paramName = paramsA[j].getName();
        breakingChanges.push(
          BCCreate(BC.types.function.removeParameter(paramName), warningFlag),
        );
      }
    }

    // Added Required Parameters
    if (paramsA.length < paramsB.length) {
      for (let j = paramsA.length; j < paramsB.length; j++) {
        const param = paramsB[j];
        if (isOptionalParameter(param)) continue;

        breakingChanges.push(
          BCCreate(
            BC.types.function.addParameter(param.getName()),
            warningFlag,
          ),
        );
      }
    }

    // Changing param type
    const sameParamCt = Math.min(paramsA.length, paramsB.length);
    for (let i = 0; i < sameParamCt; i++) {
      const paramA = paramsA[i];
      const paramB = paramsB[i];
      // Making param required
      if (isOptional(paramA) && !isOptional(paramB)) {
        breakingChanges.push(
          BCCreate(
            BC.types.function.makeParameterRequired(paramA.getName()),
            warningFlag,
          ),
        );
      }
      const t1 = checkerA.getTypeOfSymbolAtLocation(
        paramA,
        paramA.valueDeclaration!,
      );
      const t2 = checkerB.getTypeOfSymbolAtLocation(
        paramB,
        paramB.valueDeclaration!,
      );

      if (!isEffectivelyEqual(t1, t2, checkerA, checkerB)) {
        breakingChanges.push(
          BCCreate(
            BC.types.function.parameterTypeChanged(paramA.getName()),
            warningFlag,
          ),
        );
      }
    }

    // Changing return type
    const r1 = checkerA.getReturnTypeOfSignature(sigA);
    const r2 = checkerB.getReturnTypeOfSignature(sigB);
    if (!isEffectivelyEqual(r1, r2, checkerA, checkerB)) {
      breakingChanges.push(
        BCCreate(BC.types.function.returnTypeChanged, warningFlag),
      );
    }
  }

  return breakingChanges;
}
