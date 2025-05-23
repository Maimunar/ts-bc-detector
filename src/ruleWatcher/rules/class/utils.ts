import { ClassDeclaration, ConstructorDeclaration } from "../../../model";

export const bcConstructorAdded = (
  v1Class: ClassDeclaration,
  v2Class: ClassDeclaration,
): boolean => {
  const v1Constructor = v1Class.members.find((m) => m.kind === "constructor");
  if (v1Constructor) return false;

  const v2Constructor = v2Class.members.find((m) => m.kind === "constructor");
  if (!v2Constructor) return false;

  if (isConstructorBC(v2Constructor)) return true;

  return false;
};

export const isConstructorBC = (decl: ConstructorDeclaration): boolean => {
  for (const param of decl.parameters) {
    if (param.extraOperator === "none") return true;
  }
  return false;
};
