import ts from "typescript";
import { VariableStatement } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";
import { checkTypeRules } from "./types";
import { hasModifier } from "./utils";

// remove export check
const checkModifiers = (
  v1Decl: VariableStatement,
  v2Decl: VariableStatement,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const hasExport = hasModifier("export");

  if (hasExport(v1Decl) && !hasExport(v2Decl)) {
    return [BCCreate(BC.modifiers.removedExport)];
  }
  return [];
};

const checkDeclarations = (
  v1Decl: VariableStatement,
  v2Decl: VariableStatement,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  for (const v1Declaration of v1Decl.declarations) {
    const v2Declaration = v2Decl.declarations.find(
      (d) => d.name === v1Declaration.name,
    );
    if (!v2Declaration) {
      breakingChanges.push(
        BCCreate(BC.variable.removedDeclaration(v1Declaration.name)),
      );
      continue;
    }
    // Check if the type of the variable has changed
    const typeBCs = checkTypeRules(
      v1Declaration.type,
      v2Declaration.type,
      BCCreate,
      v1Checker,
      v2Checker,
    );
    breakingChanges.push(...typeBCs);
  }

  return breakingChanges;
};

export const checkVariableRules = (
  v1Decl: VariableStatement,
  v2Decl: VariableStatement,
  BCCreate: BCCreateType,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  const modifiersBC = checkModifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  const declarationsBCs = checkDeclarations(
    v1Decl,
    v2Decl,
    BCCreate,
    v1Checker,
    v2Checker,
  );
  breakingChanges.push(...declarationsBCs);

  return breakingChanges;
};
