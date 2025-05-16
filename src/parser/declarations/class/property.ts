import ts from "typescript";
import { PropertyDeclaration, PropertyModifier } from "../../../model";
import { extractModifiers } from "../../helper";

export const parseProperty = (
  node: ts.PropertyDeclaration,
  checker: ts.TypeChecker,
): PropertyDeclaration | null => {
  if (!node.name) return null;

  const name = node.name.getText();
  const modifiers = extractModifiers<PropertyModifier>(node.modifiers);

  let type = "any";
  if (node.type) {
    type = node.type.getText();
  } else if (node.initializer) {
    const inferredType = checker.getTypeAtLocation(node.initializer);
    type = checker.typeToString(inferredType);
  }

  const propertyDeclaration: PropertyDeclaration = {
    name,
    modifiers,
    type,
    kind: "property",
  };

  console.log(propertyDeclaration);
  return propertyDeclaration;
};
