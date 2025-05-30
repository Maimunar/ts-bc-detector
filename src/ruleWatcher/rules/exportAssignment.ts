import ts from "typescript";
import { ExportAssignment } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";

export const checkExportAssignmentRules = (
  v1Decl: ExportAssignment,
  v2Decl: ExportAssignment,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  // Check if the value changed - this is definitely not perfect but it will do the trick
  if (v1Decl.value !== v2Decl.value) {
    breakingChanges.push(
      BCCreate(BC.exportAssignment.valueChanged(v1Decl.value, v2Decl.value)),
    );
  }

  if (v1Decl.type && v2Decl.type) {
    const typeBCs = checkTypeRules(
      v1Decl.type,
      v2Decl.type,
      BCCreate,
      v1Checker,
      v2Checker,
    );
    breakingChanges.push(...typeBCs);
  }
  return breakingChanges;
};
