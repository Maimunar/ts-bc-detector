import ts from "typescript";
import {
  ClassDeclaration,
  Declaration,
  EnumDeclaration,
  ExportAssignment,
  ExportDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  TypeAliasDeclaration,
  VariableStatement,
} from "../model";
import { BC, BreakingChange } from "../model/bcs";
import { checkClassRules } from "./rules/class/class";
import { checkEnumRules } from "./rules/enum";
import { checkExportAssignmentRules } from "./rules/exportAssignment";
import { checkExportDeclarationRules } from "./rules/exportDeclaration";
import { checkFunctionRules } from "./rules/function";
import { checkInterfaceRules } from "./rules/interface";
import { checkTypeAliasRules } from "./rules/typeAlias";
import { checkVariableRules } from "./rules/variable";
import { createBC } from "./utils";

interface DeclarationFile {
  file: string;
  declarations: Declaration[];
  checker: ts.TypeChecker;
}

function routeDeclarationRules(
  v1Decl: Declaration,
  v2Decl: Declaration | undefined,
  BCCreate: (description: string) => BreakingChange,
  v1Checker: ts.TypeChecker,
  v2Checker: ts.TypeChecker,
): BreakingChange[] {
  switch (v1Decl.kind) {
    case "enum":
      return checkEnumRules(v1Decl, v2Decl as EnumDeclaration, BCCreate);
    case "function":
      return checkFunctionRules(
        v1Decl,
        v2Decl as FunctionDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "interface":
      return checkInterfaceRules(
        v1Decl,
        v2Decl as InterfaceDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "typeAlias":
      return checkTypeAliasRules(
        v1Decl,
        v2Decl as TypeAliasDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "exportAssignment":
      return checkExportAssignmentRules(
        v1Decl,
        v2Decl as ExportAssignment,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "exportDeclaration":
      return checkExportDeclarationRules(
        v1Decl,
        v2Decl as ExportDeclaration,
        BCCreate,
      );
    case "variable":
      return checkVariableRules(
        v1Decl,
        v2Decl as VariableStatement,
        BCCreate,
        v1Checker,
        v2Checker,
      );
    case "class":
      return checkClassRules(
        v1Decl,
        v2Decl as ClassDeclaration,
        BCCreate,
        v1Checker,
        v2Checker,
      );
  }
}

export const createBCCreator = (
  v1Decl: Declaration,
  BCFabric: (declaration: string) => (description: string) => BreakingChange,
) => {
  if (v1Decl.kind === "exportAssignment") {
    return BCFabric(v1Decl.value);
  }
  if (v1Decl.kind === "exportDeclaration") {
    if (v1Decl.moduleSpecifier) {
      return BCFabric(v1Decl.moduleSpecifier);
    } else {
      return BCFabric(
        v1Decl.exportClause.type === "named"
          ? v1Decl.exportClause.specifiers[0]?.propertyName ||
              v1Decl.exportClause.specifiers[0]?.name ||
              ""
          : v1Decl.exportClause.name || "",
      );
    }
  }
  if (v1Decl.kind === "variable") {
    return BCFabric(v1Decl.declarations[0].name);
  }

  return BCFabric(v1Decl.name);
};

function findV2Declaration(v1Decl: Declaration, v2: DeclarationFile) {
  // if exportAssignment, find by value
  // if exportDeclaration, find by moduleSpecifier or exportClause
  // if variable, find by any name match
  // else, find by name

  if (v1Decl.kind === "exportAssignment") {
    return v2.declarations.find((d) => {
      return d.kind === v1Decl.kind && d.value === v1Decl.value;
    });
  }

  if (v1Decl.kind === "exportDeclaration") {
    return v2.declarations.find((d) => {
      if (d.kind !== "exportDeclaration") return false;

      if (v1Decl.moduleSpecifier)
        return v1Decl.moduleSpecifier === d.moduleSpecifier;

      if (
        v1Decl.exportClause.type === "named" &&
        d.exportClause.type === "named"
      ) {
        for (const v1Spec of v1Decl.exportClause.specifiers) {
          for (const v2Spec of d.exportClause.specifiers) {
            if (
              v1Spec.propertyName &&
              v2Spec.propertyName &&
              v1Spec.propertyName === v2Spec.propertyName
            ) {
              return true;
            }
            if (
              v1Spec.propertyName &&
              !v2Spec.propertyName &&
              v1Spec.propertyName === v2Spec.name
            ) {
              return true;
            }
            if (
              !v1Spec.propertyName &&
              v2Spec.propertyName &&
              v1Spec.name === v2Spec.propertyName
            ) {
              return true;
            }
            if (
              !v1Spec.propertyName &&
              !v2Spec.propertyName &&
              v1Spec.name === v2Spec.name
            ) {
              return true;
            }
          }
        }
      }

      return false;
    });
  }

  if (v1Decl.kind === "variable") {
    return v2.declarations.find((d) => {
      if (d.kind !== "variable") return false;

      for (const v1Dec of v1Decl.declarations) {
        for (const v2Dec of d.declarations) {
          if (v1Dec.name === v2Dec.name) {
            return true;
          }
        }
      }

      return false;
    });
  }

  return v2.declarations.find((d) => {
    return d.kind === v1Decl.kind && d.name === v1Decl.name;
  });
}

export function watchForBCs(
  v1: DeclarationFile,
  v2: DeclarationFile,
  debug: boolean,
): BreakingChange[] {
  const breakingChanges: BreakingChange[] = [];

  const bcCreateDeclaration = createBC(v2.file);

  for (const v1Decl of v1.declarations) {
    const BCCreate = createBCCreator(v1Decl, bcCreateDeclaration);
    if (debug) console.log(BCCreate("Debug"));
    // If item is not exported, we are not checking it
    if (
      v1Decl.kind !== "exportDeclaration" &&
      v1Decl.kind !== "exportAssignment" &&
      !v1Decl.modifiers.includes("export")
    ) {
      continue;
    }

    const v2Decl = findV2Declaration(v1Decl, v2);

    // Declaration was removed
    if (!v2Decl) {
      breakingChanges.push(BCCreate(BC.removedDeclaration));
      continue;
    }

    const bcsForDeclaration = routeDeclarationRules(
      v1Decl,
      v2Decl,
      BCCreate,
      v1.checker,
      v2.checker,
    );
    breakingChanges.push(...bcsForDeclaration);
  }
  return breakingChanges;
}
