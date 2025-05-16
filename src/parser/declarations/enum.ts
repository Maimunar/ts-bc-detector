import ts from "typescript";
import { EnumDeclaration, EnumMember, EnumModifier } from "../../model";
import { extractModifiers } from "../helper";

export function parseEnum(node: ts.EnumDeclaration): EnumDeclaration {
  const name = node.name.text;
  const modifiers = extractModifiers<EnumModifier>(node.modifiers);
  let members: EnumMember[] = [];

  if (node.members) {
    members = node.members.map((member) => {
      const newMember: EnumMember = {
        name: member.name.getText(),
      };

      if (member.initializer) {
        newMember.initializer = member.initializer.getText();
      }

      return newMember;
    });
  }

  const enumDeclaration: EnumDeclaration = {
    name,
    modifiers,
    members,
    kind: "enum",
  };

  console.log(enumDeclaration);

  return enumDeclaration;
}
