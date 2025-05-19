import ts from "typescript";
import { ConstructorDeclaration } from "../../../model";
import { parseParameter } from "../../helper";

export const parseConstructor = (
  node: ts.ConstructorDeclaration,
  checker: ts.TypeChecker,
): ConstructorDeclaration => {
  const parameters = node.parameters.map((param) =>
    parseParameter(param, checker),
  );

  const constructorDeclaration: ConstructorDeclaration = {
    kind: "constructor",
    parameters,
  };

  console.log(constructorDeclaration);
  return constructorDeclaration;
};
