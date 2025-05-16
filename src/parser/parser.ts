import ts from "typescript";
import fs from "fs";
import {
  handleClass,
  handleEnum,
  handleFunction,
  handleInterface,
  handleTypeAlias,
  handleVariable,
  handleExportDeclaration,
  handleExportAssignment,
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
  if (ts.isFunctionDeclaration(node)) return handleFunction(node);
  if (ts.isVariableStatement(node)) return handleVariable(node);
  if (ts.isClassDeclaration(node)) return handleClass(node);
  if (ts.isInterfaceDeclaration(node)) return handleInterface(node);
  if (ts.isEnumDeclaration(node)) return handleEnum(node);
  if (ts.isTypeAliasDeclaration(node)) return handleTypeAlias(node);
  if (ts.isExportDeclaration(node)) return handleExportDeclaration(node);
  if (ts.isExportAssignment(node)) return handleExportAssignment(node);
}

function visit(node: ts.Node) {
  routeNode(node);
}

// Traverse only top-level nodes
sourceFile.statements.forEach((node) => visit(node));
