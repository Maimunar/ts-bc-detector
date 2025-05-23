import { EnumDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { hasModifier } from "./utils";

const checkRemovedEnumMember = (
  v1Decl: EnumDeclaration,
  v2Decl: EnumDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  for (const v1Member of v1Decl.members) {
    const v2Member = v2Decl.members.find((m) => m.name === v1Member.name);
    if (!v2Member) {
      breakingChanges.push(BCCreate(BC.enum.removedMember(v1Member.name)));
    }
  }

  return breakingChanges;
};

const checkRemovedExport = (
  v1Decl: EnumDeclaration,
  v2Decl: EnumDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const hasExport = hasModifier("export");
  if (hasExport(v1Decl) && !hasExport(v2Decl)) {
    return [BCCreate(BC.enum.removedExport)];
  }

  return [];
};

export const checkEnumRules = (
  v1Decl: EnumDeclaration,
  v2Decl: EnumDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Enum rules are being checked for", v1Decl.name);

  const removedEnumMemberBCs = checkRemovedEnumMember(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...removedEnumMemberBCs);

  const removedExportBCs = checkRemovedExport(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...removedExportBCs);

  return breakingChanges;
};
