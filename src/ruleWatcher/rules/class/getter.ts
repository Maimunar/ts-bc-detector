import { GetterDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkGetterRules = (
  v1Decl: GetterDeclaration,
  v2Decl: GetterDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Getter rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
