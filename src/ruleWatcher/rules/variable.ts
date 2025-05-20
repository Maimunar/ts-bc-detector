import { VariableStatement } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkVariableRules = (
  v1Decl: VariableStatement,
  v2Decl: VariableStatement,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Variable Declaration rules are being checked");
  console.log(v1Decl.declarations[0].name, v2Decl.declarations[0].name);

  return breakingChanges;
};
