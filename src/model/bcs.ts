export interface BreakingChange {
  file: string;
  declaration: string;
  description: string;
}

export const BC = {
  removedDeclaration: "Removed Declaration",
  removedClassMember: "Removed Class Member",
};
