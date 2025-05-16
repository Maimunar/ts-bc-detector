import ts from "typescript";
import { parseMethod } from "./method";
import { parseProperty } from "./property";
import { parseConstructor } from "./constructor";
import { parseGetAccessor } from "./getter";
import { parseSetAccessor } from "./setter";

const routeClassMember = (member: ts.ClassElement, checker: ts.TypeChecker) => {
  if (ts.isMethodDeclaration(member)) return parseMethod(member, checker);
  if (ts.isPropertyDeclaration(member)) return parseProperty(member, checker);
  if (ts.isConstructorDeclaration(member))
    return parseConstructor(member, checker);
  if (ts.isGetAccessorDeclaration(member))
    return parseGetAccessor(member, checker);
  if (ts.isSetAccessorDeclaration(member))
    return parseSetAccessor(member, checker);
};

export const parseClass = (
  node: ts.ClassDeclaration,
  checker: ts.TypeChecker,
) => {
  if (node.name) {
    console.log(`Class: ${node.name.text}`);
  }
  if (node.members) {
    node.members.forEach((member) => routeClassMember(member, checker));
  }
};
