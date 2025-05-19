import ts from "typescript";
import { PropertyDeclaration, PropertyModifier } from "../../../model";
import { extractModifiers, getNodeTypeOrAny } from "../../helper";

export const parseProperty = (
  node: ts.PropertyDeclaration,
  checker: ts.TypeChecker,
): PropertyDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<PropertyModifier>(node.modifiers);
  const type = getNodeTypeOrAny(node, checker);

  const propertyDeclaration: PropertyDeclaration = {
    name,
    modifiers,
    type,
    kind: "property",
  };

  console.log(propertyDeclaration);
  return propertyDeclaration;
};
