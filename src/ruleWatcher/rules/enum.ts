import { EnumDeclaration } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkEnumRules = (
  v1Decl: EnumDeclaration,
  v2Decl: EnumDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Enum rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
