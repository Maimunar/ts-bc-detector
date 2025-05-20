import { ExportDeclaration } from "../../model";
import { BreakingChange } from "../../model/bcs";

export const checkExportDeclarationRules = (
  v1Decl: ExportDeclaration,
  v2Decl: ExportDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Export Declaration rules are being checked");
  console.log(
    v1Decl.exportClause.type,
    v2Decl.exportClause.type,
    v1Decl.moduleSpecifier,
    v2Decl.moduleSpecifier,
  );

  return breakingChanges;
};
