import ts from "typescript";
import fs from "fs";
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

const fileName = process.argv[2]; // Change this as needed
const sourceCode = fs.readFileSync(fileName, "utf-8");

const sourceFile = ts.createSourceFile(
  fileName,
  sourceCode,
  ts.ScriptTarget.Latest,
  true,
);

function routeNode(node: ts.Node) {
  if (ts.isFunctionDeclaration(node)) return parseFunction(node);
  if (ts.isVariableStatement(node)) return parseVariable(node);
  if (ts.isClassDeclaration(node)) return parseClass(node);
  if (ts.isInterfaceDeclaration(node)) return parseInterface(node);
  if (ts.isEnumDeclaration(node)) return parseEnum(node);
  if (ts.isTypeAliasDeclaration(node)) return parseTypeAlias(node);
  if (ts.isExportDeclaration(node)) return parseExportDeclaration(node);
  if (ts.isExportAssignment(node)) return parseExportAssignment(node);
}

function visit(node: ts.Node) {
  routeNode(node);
}

// Traverse only top-level nodes
sourceFile.statements.forEach((node) => visit(node));
