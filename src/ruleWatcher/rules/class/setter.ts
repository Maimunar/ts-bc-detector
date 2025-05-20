import { SetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkSetterRules = (
  v1Decl: SetterDeclaration,
  v2Decl: SetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Setter rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
