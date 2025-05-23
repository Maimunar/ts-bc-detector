import ts from "typescript";
import { TypeAliasDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";
import { hasModifier } from "./utils";

const checkModifiers = (
  v1Decl: TypeAliasDeclaration,
  v2Decl: TypeAliasDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const hasExport = hasModifier("export");

  if (hasExport(v1Decl) && !hasExport(v2Decl)) {
    return [BCCreate(BC.modifiers.removedExport)];
  }

  return [];
};

export const checkTypeAliasRules = (
  v1Decl: TypeAliasDeclaration,
  v2Decl: TypeAliasDeclaration,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const modifiersBC = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  breakingChanges.push(
    ...checkTypeRules(v1Decl.type, v2Decl.type, BCCreate, v1Checker, v2Checker),
  );

  return breakingChanges;
};
