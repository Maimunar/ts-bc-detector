import ts from "typescript";
import { parseMethod } from "./method";
import { parseProperty } from "./property";
import { parseConstructor } from "./constructor";
import { parseGetAccessor } from "./getter";
import { parseSetAccessor } from "./setter";
import { ClassDeclaration, ClassMember, ClassModifier } from "../../../model";
import { extractModifiers } from "../../helper";

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
): ClassDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.text;
  const modifiers = extractModifiers<ClassModifier>(node.modifiers);

  let members: ClassMember[] = [];

  if (node.members) {
    members = node.members
      .map((member) => routeClassMember(member, checker))
      .filter((m) => m !== null) as ClassMember[];
  }

  const classDeclaration: ClassDeclaration = {
    name,
    modifiers,
    members,
    kind: "class",
  };

  return classDeclaration;
};
