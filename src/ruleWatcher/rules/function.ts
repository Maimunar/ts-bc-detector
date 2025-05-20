import { FunctionDeclaration } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkFunctionRules = (
  v1Decl: FunctionDeclaration,
  v2Decl: FunctionDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Function Declaration rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
