import ts from "typescript";
import { isEffectivelyEqual } from "./utils";
import { BreakingChange } from "../../../model/bcs";

export function compareFunctionTypes(
  sigsA: ts.Signature[],
  checkerA: ts.TypeChecker,
  sigsB: ts.Signature[],
  checkerB: ts.TypeChecker,
): BreakingChange[] {
  const messages: BreakingChange[] = [];
  //if (sigsA.length !== sigsB.length) {
  //  messages.push(
  //    `❌ Number of call signatures changed: ${sigsA.length} -> ${sigsB.length}`,
  //  );
  //  return messages;
  //}
  //
  //for (let i = 0; i < sigsA.length; i++) {
  //  const sigA = sigsA[i];
  //  const sigB = sigsB[i];
  //
  //  const paramsA = sigA.getParameters();
  //  const paramsB = sigB.getParameters();
  //
  //  if (paramsA.length !== paramsB.length) {
  //    messages.push(`❌ Signature ${i + 1} parameter count changed`);
  //    continue;
  //  }
  //
  //  for (let j = 0; j < paramsA.length; j++) {
  //    const t1 = checkerA.getTypeOfSymbolAtLocation(
  //      paramsA[j],
  //      paramsA[j].valueDeclaration!,
  //    );
  //    const t2 = checkerB.getTypeOfSymbolAtLocation(
  //      paramsB[j],
  //      paramsB[j].valueDeclaration!,
  //    );
  //    if (!isEffectivelyEqual(t1, t2, checkerA, checkerB)) {
  //      messages.push(
  //        `❌ Signature ${i + 1}, param ${j + 1} type changed from '${checkerA.typeToString(t1)}' to '${checkerB.typeToString(t2)}'`,
  //      );
  //    }
  //  }
  //
  //  const r1 = checkerA.getReturnTypeOfSignature(sigA);
  //  const r2 = checkerB.getReturnTypeOfSignature(sigB);
  //  if (!isEffectivelyEqual(r1, r2, checkerA, checkerB)) {
  //    messages.push(
  //      `❌ Signature ${i + 1} return type changed from '${checkerA.typeToString(r1)}' to '${checkerB.typeToString(r2)}'`,
  //    );
  //  }
  //}

  return messages;
}
