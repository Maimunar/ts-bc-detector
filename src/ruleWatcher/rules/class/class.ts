import { ClassDeclaration } from "../../../model";
import { BreakingChange } from "../../../model/bcs";

export const checkClassRules = (
  v1Decl: ClassDeclaration,
  v2Decl: ClassDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Class rules are being checked");
  console.log(v1Decl.name, v2Decl.name);

  return breakingChanges;
};
