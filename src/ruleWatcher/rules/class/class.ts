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
import { hasModifier } from "../utils";

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

const checkModifiers = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];
  const hasExport = hasModifier("export");

  // removing the export keyword
  if (hasExport(v1Class) && !hasExport(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.removedExport));
  }

  const hasDefault = hasModifier("default");
  // removing the default keyword
  if (hasDefault(v1Class) && !hasDefault(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.removedDefault));
  }

  // adding the default keyword
  if (!hasDefault(v1Class) && hasDefault(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.addedDefault));
  }

  const hasDeclare = hasModifier("declare");
  // removing the declare keyword
  if (hasDeclare(v1Class) && !hasDeclare(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.removedDeclare));
  }
  // adding the declare keyword
  if (!hasDeclare(v1Class) && hasDeclare(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.addedDeclare));
  }

  const hasAbstract = hasModifier("abstract");
  // adding the abstract keyword
  if (!hasAbstract(v1Class) && hasAbstract(v2Class)) {
    breakingChanges.push(BCCreate(BC.modifiers.addedAbstract));
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

  // Check modifiers
  const modifierBCs = checkModifiers(v1Class, v2Class, BCCreate);
  breakingChanges.push(...modifierBCs);

  // If a constructor with a BC is added, it is a BC
  if (bcConstructorAdded(v1Class, v2Class)) {
    breakingChanges.push(BCCreate(BC.class.constructor.added));
  }

  for (const v1Member of v1Class.members) {
    const hasPrivate = hasModifier("private");

    if (v1Member.kind !== "constructor") {
      // We're not testing private members
      if (hasPrivate(v1Member)) continue;
    }
    const v2Member = findV2Member(v1Member, v2Class);

    if (!v2Member) {
      if (v1Member.kind === "constructor") {
        if (isConstructorBC(v1Member)) {
          breakingChanges.push(BCCreate(BC.class.constructor.removed));
        }
        continue;
      }

      // No accessibility = public, so we only skip if it is private
      if (!hasPrivate(v1Member)) {
        breakingChanges.push(BCCreate(BC.removedClassMember));
      }

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
