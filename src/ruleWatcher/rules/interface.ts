import ts from "typescript";
import { InterfaceDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";

const checkModifiers = (
  v1Decl: InterfaceDeclaration,
  v2Decl: InterfaceDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  //Removing export is a BC
  if (v1Decl.modifiers?.some((m) => m === "export")) {
    if (!v2Decl.modifiers?.some((m) => m === "export")) {
      return [BCCreate(BC.modifiers.removedExport)];
    }
  }

  //Adding or removing the default modifier keyword is always a BC.
  if (v1Decl.modifiers?.some((m) => m === "default")) {
    if (!v2Decl.modifiers?.some((m) => m === "default")) {
      return [BCCreate(BC.modifiers.removedDefault)];
    }
  } else {
    if (v2Decl.modifiers?.some((m) => m === "default")) {
      return [BCCreate(BC.modifiers.addedDefault)];
    }
  }

  return [];
};

const checkMembers = (
  v1Decl: InterfaceDeclaration,
  v2Decl: InterfaceDeclaration,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  let v2MembersLeft = [...v2Decl.members];

  const breakingChanges: BreakingChange[] = [];

  // Check if there are any members added to v2;
  for (const v1Member of v1Decl.members) {
    const v2Member = v2MembersLeft.find((m) => m.name === v1Member.name);
    // If no v2Member - member was removed
    if (!v2Member) {
      breakingChanges.push(
        BCCreate(BC.interface.member.removed(v1Member.name)),
      );
      continue;
    }

    // Also check optional vs required
    if (v1Member.optional && !v2Member.optional) {
      breakingChanges.push(
        BCCreate(BC.interface.member.optionalToRequired(v1Member.name)),
      );
    }
    // Check member type changes
    breakingChanges.push(
      ...checkTypeRules(
        v1Member.type,
        v2Member.type,
        BCCreate,
        v1Checker,
        v2Checker,
      ),
    );

    // Finally, remove from v2MembersLeft
    v2MembersLeft = v2MembersLeft.filter((m) => m.name !== v1Member.name);
  }

  // For each v2Member in v2MembersLeft, if it is required, its a bc (added required member)
  for (const v2Member of v2MembersLeft) {
    if (!v2Member.optional) {
      breakingChanges.push(
        BCCreate(BC.interface.member.addedRequired(v2Member.name)),
      );
    }
  }

  return breakingChanges;
};

export const checkInterfaceRules = (
  v1Decl: InterfaceDeclaration,
  v2Decl: InterfaceDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Interface Declaration rules are being checked", v1Decl.name);

  const modifiersBC = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  const membersBC = checkMembers(
    v1Decl,
    v2Decl,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...membersBC);

  return breakingChanges;
};
