import ts from "typescript";
import {
  ExportDeclaration,
  ExportSpecifier,
  NamedExport,
  NamespaceExport,
} from "../../model";

export function parseExportDeclaration(
  node: ts.ExportDeclaration,
): ExportDeclaration {
  const isTypeOnly = node.isTypeOnly;

  let exportClause: NamedExport | NamespaceExport;
  if (node.exportClause) {
    if (ts.isNamedExports(node.exportClause)) {
      // Named export: export { foo, bar }
      const specifiers: ExportSpecifier[] = node.exportClause.elements.map(
        (spec) => ({
          isTypeOnly: spec.isTypeOnly,
          name: spec.name.text,
          propertyName: spec.propertyName?.text,
        }),
      );

      exportClause = { type: "named", specifiers };
    } else if (ts.isNamespaceExport(node.exportClause)) {
      // Namespace export: export * as ns
      exportClause = { type: "namespace", name: node.exportClause.name.text };
    } else {
      throw new Error("Unhandled exportClause kind"); // no such case in current version
    }
  } else {
    // Bare namespace export: export * from "module"
    exportClause = { type: "namespace", name: undefined };
  }

  const exportDeclaration: ExportDeclaration = {
    isTypeOnly,
    exportClause,
    kind: "exportDeclaration",
  };

  if (node.moduleSpecifier)
    exportDeclaration.moduleSpecifier = node.moduleSpecifier.getText();

  return exportDeclaration;
}
