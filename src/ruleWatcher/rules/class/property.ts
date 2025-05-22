import { PropertyDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkPropertyRules = (
  v1Decl: PropertyDeclaration,
  v2Decl: PropertyDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Property rules are being checked", v1Decl.name);

  return breakingChanges;
};
