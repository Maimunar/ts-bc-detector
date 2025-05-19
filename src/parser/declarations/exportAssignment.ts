import ts from "typescript";
import { ExportAssignment } from "../../model";

export const parseExportAssignment = (
  node: ts.ExportAssignment,
): ExportAssignment => {
  const value = node.expression.getText();

  const exportAssignment: ExportAssignment = {
    kind: "exportAssignment",
    value,
  };

  return exportAssignment;
};
