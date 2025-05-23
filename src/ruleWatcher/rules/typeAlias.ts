import ts from "typescript";
import { TypeAliasDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";

const checkModifiers = (
  v1Decl: TypeAliasDeclaration,
  v2Decl: TypeAliasDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  if (v1Decl.modifiers?.some((m) => m === "export")) {
    if (!v2Decl.modifiers?.some((m) => m === "export")) {
      return [BCCreate(BC.modifiers.removedExport)];
    }
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

  console.log("Type Alias Declaration rules are being checked", v1Decl.name);

  const modifiersBC = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  breakingChanges.push(
    ...checkTypeRules(v1Decl.type, v2Decl.type, BCCreate, v1Checker, v2Checker),
  );

  return breakingChanges;
};
