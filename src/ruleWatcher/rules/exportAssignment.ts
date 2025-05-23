import { ExportAssignment } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";

export const checkExportAssignmentRules = (
  v1Decl: ExportAssignment,
  v2Decl: ExportAssignment,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Export Assignment rules are being checked", v1Decl.value);

  // Check if the value changed - this is definitely not perfect but it will do the trick
  if (v1Decl.value !== v2Decl.value) {
    breakingChanges.push(
      BCCreate(BC.exportAssignment.valueChanged(v1Decl.value, v2Decl.value)),
    );
  }
  return breakingChanges;
};
