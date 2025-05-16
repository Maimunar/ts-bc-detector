import ts from "typescript";
import { ConstructorDeclaration } from "../../../model";
import { parseParameter } from "../../helper";

export const parseConstructor = (
  node: ts.ConstructorDeclaration,
): ConstructorDeclaration => {
  const parameters = node.parameters.map(parseParameter);

  const constructorDeclaration: ConstructorDeclaration = {
    kind: "constructor",
    parameters,
  };

  console.log(constructorDeclaration);
  return constructorDeclaration;
};
