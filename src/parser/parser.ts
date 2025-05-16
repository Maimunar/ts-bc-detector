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
  routeNode(node, checker);
}

const fileName = process.argv[2]; // Change this as needed

const program = ts.createProgram([fileName], {});
const checker = program.getTypeChecker();

const sourceFile = program.getSourceFile(fileName)!;

// Traverse only top-level nodes
sourceFile.statements.forEach((node) => visit(node, checker));
