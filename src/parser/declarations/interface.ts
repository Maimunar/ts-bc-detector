import ts from "typescript";
import {
  InterfaceDeclaration,
  InterfaceMember,
  InterfaceModifier,
} from "../../model";
import { extractModifiers, fallbackAny, getNodeTypeOrAny } from "../helper";

export const parseInterface = (
  node: ts.InterfaceDeclaration,
  checker: ts.TypeChecker,
): InterfaceDeclaration => {
  const name = node.name.text;
  const modifiers = extractModifiers<InterfaceModifier>(node.modifiers);

  const members: InterfaceMember[] = node.members
    .filter(ts.isPropertySignature)
    .map((member) => {
      const memberName = (member.name as ts.Identifier).text;
      const optional = Boolean(member.questionToken);
      const type = getNodeTypeOrAny(member, checker);

      return { name: memberName, optional, type };
    });

  const interfaceDeclaration: InterfaceDeclaration = {
    name,
    modifiers,
    members,
    kind: "interface",
  };

  return interfaceDeclaration;
};
