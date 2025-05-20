import { MethodDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkMethodRules = (
  v1Decl: MethodDeclaration,
  v2Decl: MethodDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Method rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
