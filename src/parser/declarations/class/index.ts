import ts from "typescript";
import { handleMethod } from "./method";
import { handleProperty } from "./property";
import { handleConstructor } from "./constructor";
import { handleGetAccessor } from "./getter";
import { handleSetAccessor } from "./setter";

const routeClassMember = (member: ts.ClassElement) => {
  if (ts.isMethodDeclaration(member)) return handleMethod(member);
  if (ts.isPropertyDeclaration(member)) return handleProperty(member);
  if (ts.isConstructorDeclaration(member)) return handleConstructor(member);
  if (ts.isGetAccessorDeclaration(member)) return handleGetAccessor(member);
  if (ts.isSetAccessorDeclaration(member)) return handleSetAccessor(member);
};

export const handleClass = (node: ts.ClassDeclaration) => {
  if (node.name) {
    console.log(`Class: ${node.name.text}`);
  }
  if (node.members) {
    node.members.forEach(routeClassMember);
  }
};
