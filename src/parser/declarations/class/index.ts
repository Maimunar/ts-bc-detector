import ts from "typescript";
import { parseMethod } from "./method";
import { parseProperty } from "./property";
import { parseConstructor } from "./constructor";
import { parseGetAccessor } from "./getter";
import { parseSetAccessor } from "./setter";

const routeClassMember = (member: ts.ClassElement) => {
  if (ts.isMethodDeclaration(member)) return parseMethod(member);
  if (ts.isPropertyDeclaration(member)) return parseProperty(member);
  if (ts.isConstructorDeclaration(member)) return parseConstructor(member);
  if (ts.isGetAccessorDeclaration(member)) return parseGetAccessor(member);
  if (ts.isSetAccessorDeclaration(member)) return parseSetAccessor(member);
};

export const parseClass = (node: ts.ClassDeclaration) => {
  if (node.name) {
    console.log(`Class: ${node.name.text}`);
  }
  if (node.members) {
    node.members.forEach(routeClassMember);
  }
};
