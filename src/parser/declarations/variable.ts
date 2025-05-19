import ts from "typescript";
import { VariableModifier, VariableStatement } from "../../model";
import { extractModifiers, getNodeTypeOrAny } from "../helper";

function getDeclarationType(
  declList: ts.VariableDeclarationList,
): "const" | "let" | "var" {
  if (declList.flags & ts.NodeFlags.Const) return "const";
  if (declList.flags & ts.NodeFlags.Let) return "let";
  return "var";
}

export function parseVariable(
  node: ts.VariableStatement,
  checker: ts.TypeChecker,
): VariableStatement {
  const modifiers = extractModifiers<VariableModifier>(node.modifiers);
  const declarationType = getDeclarationType(node.declarationList);

  const declarations = node.declarationList.declarations.map((decl) => {
    const name = decl.name.getText();

    const type = getNodeTypeOrAny(decl, checker);

    return { name, type };
  });

  const variableStatement: VariableStatement = {
    modifiers,
    declarationType,
    declarations,
    kind: "variable",
  };

  return variableStatement;
}
