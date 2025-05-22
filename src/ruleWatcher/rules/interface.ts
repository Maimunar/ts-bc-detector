import { InterfaceDeclaration } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkInterfaceRules = (
  v1Decl: InterfaceDeclaration,
  v2Decl: InterfaceDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Interface Declaration rules are being checked", v1Decl.name);

  return breakingChanges;
};
