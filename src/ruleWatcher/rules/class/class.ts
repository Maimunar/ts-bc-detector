import {
  ClassDeclaration,
  ClassMember,
  ConstructorDeclaration,
  GetterDeclaration,
  MethodDeclaration,
  PropertyDeclaration,
  SetterDeclaration,
} from "../../../model";
import { BC, BreakingChange } from "../../../model/bcs";
import { checkConstructorRules } from "./constructor";
import { checkGetterRules } from "./getter";
import { checkMethodRules } from "./method";
import { checkPropertyRules } from "./property";
import { checkSetterRules } from "./setter";

export const routeMemberRules = (
  v1Member: ClassMember,
  v2Member: ClassMember,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  switch (v1Member.kind) {
    case "constructor":
      return checkConstructorRules(
        v1Member,
        v2Member as ConstructorDeclaration,
        BCCreate,
      );
    case "method":
      return checkMethodRules(
        v1Member,
        v2Member as MethodDeclaration,
        BCCreate,
      );
    case "property":
      return checkPropertyRules(
        v1Member,
        v2Member as PropertyDeclaration,
        BCCreate,
      );
    case "getter":
      return checkGetterRules(
        v1Member,
        v2Member as GetterDeclaration,
        BCCreate,
      );
    case "setter":
      return checkSetterRules(
        v1Member,
        v2Member as SetterDeclaration,
        BCCreate,
      );
  }
};

export const findV2Member = (
  v1Member: ClassMember,
  v2Class: ClassDeclaration,
) => {
  if (v1Member.kind === "constructor") {
    return v2Class.members.find((v2Member) => v2Member.kind === "constructor");
  }
  return v2Class.members.find(
    (v2Member) =>
      v2Member.kind !== "constructor" && v1Member.name === v2Member.name,
  );
};

export const parseV2Member = (
  v1Member: ClassMember,
  v2Member: ClassMember | undefined,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  if (!v2Member) return [BCCreate(BC.removedClassMember)];

  if (v1Member.kind !== v2Member.kind) {
    // Bug
    console.error("Member kind mismatch");
  }

  return [];
};

export const checkClassRules = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
  BCCreate: (description: string) => BreakingChange,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Class rules are being checked");
  console.log(v1Class.name, v2Class.name);

  for (const v1Member of v1Class.members) {
    const v2Member = findV2Member(v1Member, v2Class);
    if (!v2Member) {
      breakingChanges.push(BCCreate(BC.removedClassMember));
      continue;
    }

    const parseV2BCs = parseV2Member(v1Member, v2Member, BCCreate);
    if (parseV2BCs.length > 0) {
      breakingChanges.push(...parseV2BCs);
      continue;
    }

    const BCsForMember = routeMemberRules(v1Member, v2Member, BCCreate);
    breakingChanges.push(...BCsForMember);
  }

  return breakingChanges;

  return breakingChanges;
};
