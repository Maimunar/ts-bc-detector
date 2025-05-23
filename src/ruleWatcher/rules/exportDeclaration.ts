import { ExportDeclaration } from "../../model";
import { BC, BreakingChange } from "../../model/bcs";
import { BCCreateType } from "../utils";

const checkSpecifiers = (
  v1Decl: ExportDeclaration,
  v2Decl: ExportDeclaration,
  BCCreate: BCCreateType,
) => {
  const breakingChanges: BreakingChange[] = [];
  if (
    v1Decl.exportClause.type === "named" &&
    v2Decl.exportClause.type === "named"
  ) {
    for (const v1Specifier of v1Decl.exportClause.specifiers) {
      const v2Specifier = v2Decl.exportClause.specifiers.find((s) => {
        if (s.propertyName) {
          if (v1Specifier?.propertyName) {
            return s.propertyName === v1Specifier.propertyName;
          }
          return s.propertyName === v1Specifier.name;
        }
        if (v1Specifier?.propertyName) {
          return s.name === v1Specifier.propertyName;
        }
        return s.name === v1Specifier.name;
      });

      if (!v2Specifier) {
        breakingChanges.push(
          BCCreate(
            BC.exportDeclaration.removedExportSpecifier(
              v1Specifier.propertyName || v1Specifier.name,
            ),
            true,
          ),
        );
      }

      // Check type added
      if (!v1Specifier.isTypeOnly && v2Specifier?.isTypeOnly) {
        breakingChanges.push(
          BCCreate(
            BC.exportDeclaration.addedTypeKeywordToExportSpecifier(
              v1Specifier.propertyName || v1Specifier.name,
            ),
            true,
          ),
        );
      }
    }
  }

  return breakingChanges;
};

//- Adding type is not a BC iff types are exported in v1 - usually it is a BC.
const checkTypeModifier = (
  v1Decl: ExportDeclaration,
  v2Decl: ExportDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  if (!v1Decl.isTypeOnly && v2Decl.isTypeOnly) {
    return [BCCreate(BC.exportDeclaration.addedTypeKeyword)];
  }
  return [];
};

//- If one can guarantee that when changing the import from a named export to a namspace, we will export atleast the same element types, it is not a BC. Otherwise it is a BC.
const checkTypeOfExportDeclaration = (
  v1Decl: ExportDeclaration,
  v2Decl: ExportDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  if (
    v1Decl.exportClause.type === "namespace" &&
    v2Decl.exportClause.type === "named"
  ) {
    return [BCCreate(BC.exportDeclaration.namespaceToNamed, true)];
  }
  return [];
};
export const checkExportDeclarationRules = (
  v1Decl: ExportDeclaration,
  v2Decl: ExportDeclaration,
  BCCreate: BCCreateType,
): BreakingChange[] => {
  const breakingChanges: BreakingChange[] = [];

  console.log("Export Declaration rules are being checked");

  const modifiersBC = checkTypeModifier(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...modifiersBC);

  const specifiersBC = checkSpecifiers(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...specifiersBC);

  const typeBC = checkTypeOfExportDeclaration(v1Decl, v2Decl, BCCreate);
  breakingChanges.push(...typeBC);

  return breakingChanges;
};

//- Adding or removing an alias (from clause or a specifier or a namespace) is a BC.
