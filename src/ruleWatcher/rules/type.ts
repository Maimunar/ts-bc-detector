import { TypeAliasDeclaration } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkTypeAliasRules = (
  v1Decl: TypeAliasDeclaration,
  v2Decl: TypeAliasDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Type Alias Declaration rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
