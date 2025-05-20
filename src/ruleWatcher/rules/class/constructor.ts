import { ConstructorDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkConstructorRules = (
  v1Decl: ConstructorDeclaration,
  v2Decl: ConstructorDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Constructor rules are being checked");

  return breakingChanges;
};
