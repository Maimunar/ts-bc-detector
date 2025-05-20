import { ExportAssignment } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkExportAssignmentRules = (
  v1Decl: ExportAssignment,
  v2Decl: ExportAssignment,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Export Assignment rules are being checked");
  console.log(v1Decl.value, v2Decl.value);

  return breakingChanges;
};
