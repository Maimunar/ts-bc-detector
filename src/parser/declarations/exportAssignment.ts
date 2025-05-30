import ts from "typescript";
import { ExportAssignment } from "../../model";

export const parseExportAssignment = (
  node: ts.ExportAssignment,
  checker: ts.TypeChecker,
): ExportAssignment => {
  const value = node.expression.getText();
  const exportAssignment: ExportAssignment = {
    kind: "exportAssignment",
    value,
  };

  const type = getExportAssignmentType(node, checker);
  if (type) exportAssignment.type = type;

  return exportAssignment;
};

function getExportAssignmentType(
  node: ts.ExportAssignment,
  checker: ts.TypeChecker,
): ts.Type | null {
  // Ensure the export is an expression (not `export =`)
  if (!node.isExportEquals && node.expression) {
    return checker.getTypeAtLocation(node.expression);
  }
  return null;
}
