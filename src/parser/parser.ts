import ts from "typescript";
import {
  parseClass,
  parseEnum,
  parseFunction,
  parseInterface,
  parseTypeAlias,
  parseVariable,
  parseExportDeclaration,
  parseExportAssignment,
} from "./declarations";
import { Declaration } from "../model";
import { printDeclarations } from "./helper";

function routeNode(node: ts.Node, checker: ts.TypeChecker) {
  if (ts.isFunctionDeclaration(node)) return parseFunction(node, checker);
  if (ts.isVariableStatement(node)) return parseVariable(node, checker);
  if (ts.isClassDeclaration(node)) return parseClass(node, checker);
  if (ts.isInterfaceDeclaration(node)) return parseInterface(node, checker);
  if (ts.isEnumDeclaration(node)) return parseEnum(node);
  if (ts.isTypeAliasDeclaration(node)) return parseTypeAlias(node, checker);
  if (ts.isExportDeclaration(node)) return parseExportDeclaration(node);
  if (ts.isExportAssignment(node)) return parseExportAssignment(node);
}

function visit(node: ts.Node, checker: ts.TypeChecker) {
  return routeNode(node, checker);
}

export function parseFile(
  fileName: string,
  debug: boolean,
): { declarations: Declaration[]; checker: ts.TypeChecker } {
  const declarations: Declaration[] = [];

  const program = ts.createProgram([fileName], {});
  const checker = program.getTypeChecker();

  const sourceFile = program.getSourceFile(fileName)!;

  // Traverse only top-level nodes
  sourceFile.statements.forEach((node) => {
    const declaration = visit(node, checker);
    if (declaration) {
      declarations.push(declaration);
    }
  });

  if (debug) printDeclarations(declarations, checker);

  return { declarations, checker };
}
