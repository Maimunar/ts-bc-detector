import ts from "typescript";
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
import { BCCreateType } from "../../utils";
import { checkConstructorRules } from "./constructor";
import { checkGetterRules } from "./getter";
import { checkMethodRules } from "./method";
import { checkPropertyRules } from "./property";
import { checkSetterRules } from "./setter";
import { bcConstructorAdded, isConstructorBC } from "./utils";

export const routeMemberRules = (
  v1Member: ClassMember,
  v2Member: ClassMember,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  switch (v1Member.kind) {
    case "constructor":
      return checkConstructorRules(
        v1Member,
        v2Member as ConstructorDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "method":
      return checkMethodRules(
        v1Member,
        v2Member as MethodDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "property":
      return checkPropertyRules(
        v1Member,
        v2Member as PropertyDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "getter":
      return checkGetterRules(
        v1Member,
        v2Member as GetterDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "setter":
      return checkSetterRules(
        v1Member,
        v2Member as SetterDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
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
  if (!v2Member) {
    if (v1Member.kind !== "constructor") {
      if (
        v1Member.modifiers?.some((m) => m === "public" || m === "protected")
      ) {
        return [BCCreate(BC.removedClassMember)];
      }
    }
    return [BCCreate(BC.removedClassMember)];
  }

  if (v1Member.kind !== v2Member.kind) {
    // Bug
    console.error("Bug: Member kind mismatch");
  }

  return [];
};

const checkModifiers = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];
  // removing the export keyword
  if (v1Class.modifiers?.some((m) => m === "export")) {
    if (!v2Class.modifiers?.some((m) => m === "export")) {
      breakingChanges.push(BCCreate(BC.modifiers.removedExport));
    }
  }

  // removing the default keyword
  if (v1Class.modifiers?.some((m) => m === "default")) {
    if (!v2Class.modifiers?.some((m) => m === "default")) {
      breakingChanges.push(BCCreate(BC.modifiers.removedDefault));
    }
  }
  // adding the default keyword
  if (!v1Class.modifiers?.some((m) => m === "default")) {
    if (v2Class.modifiers?.some((m) => m === "default")) {
      breakingChanges.push(BCCreate(BC.modifiers.addedDefault));
    }
  }
  // removing the declare keyword
  if (v1Class.modifiers?.some((m) => m === "declare")) {
    if (!v2Class.modifiers?.some((m) => m === "declare")) {
      breakingChanges.push(BCCreate(BC.modifiers.removedDeclare));
    }
  }
  // adding the declare keyword
  if (!v1Class.modifiers?.some((m) => m === "declare")) {
    if (v2Class.modifiers?.some((m) => m === "declare")) {
      breakingChanges.push(BCCreate(BC.modifiers.addedDeclare));
    }
  }
  // adding the abstract keyword
  if (!v1Class.modifiers?.some((m) => m === "abstract")) {
    if (v2Class.modifiers?.some((m) => m === "abstract")) {
      breakingChanges.push(BCCreate(BC.modifiers.addedAbstract));
    }
  }

  return breakingChanges;
};

export const checkClassRules = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Class rules are being checked", v1Class.name);

  // Check modifiers
  const modifierBCs = checkModifiers(v1Class, v2Class, BCCreate);
  breakingChanges.push(...modifierBCs);

  // If a constructor with a BC is added, it is a BC
  if (bcConstructorAdded(v1Class, v2Class)) {
    breakingChanges.push(BCCreate(BC.class.constructor.added));
  }

  for (const v1Member of v1Class.members) {
    const v2Member = findV2Member(v1Member, v2Class);
    if (!v2Member) {
      // Constructor removed can be not a BC
      if (v1Member.kind === "constructor" && isConstructorBC(v1Member)) {
        breakingChanges.push(BCCreate(BC.class.constructor.removed));
        continue;
      }
      breakingChanges.push(BCCreate(BC.removedClassMember));
      continue;
    }

    const parseV2BCs = parseV2Member(v1Member, v2Member, BCCreate);
    if (parseV2BCs.length > 0) {
      breakingChanges.push(...parseV2BCs);
      continue;
    }

    const bcsForMember = routeMemberRules(
      v1Member,
      v2Member,
      BCCreate,
      v1Checker,
      v2Checker,
    );
    breakingChanges.push(...bcsForMember);
  }

  return breakingChanges;
};
