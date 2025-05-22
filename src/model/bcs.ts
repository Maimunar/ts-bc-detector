export interface BreakingChange {
  file: string;
  declaration: string;
  description: string;
}

export const BC = {
  removedDeclaration: "Removed Declaration",
  removedClassMember: "Removed Class Member",
  modifiers: {
    removedExport: "Removed Export Modifier",
    removedDefault: "Removed Default Modifier from export",
    addedDefault: "Added Default Modifier to export",
  },
  enum: {
    removedMember: (member: string) => `Removed Enum Member: ${member}`,
    removedExport: "Removed Enum Export Modifier",
  },
  type: {},
  parameter: {
    added: (name: string) =>
      `Added Parameter with no special operator: ${name}`,
    removed: (name: string) => `Removed Parameter: ${name}`,
    restToOptional: (name: string) =>
      `Changed Rest Parameter to Optional: ${name}`,
    restToNoOperator: (name: string) =>
      `Removed Rest Operator from Parameter: ${name}`,
    restToInitializer: (name: string) =>
      `Changed Rest Parameter to Initialized Parameter: ${name}`,
    optionalToNoOperator: (name: string) =>
      `Removed Optional Operator from Parameter: ${name}`,
    initializerToNoOperator: (name: string) =>
      `Removed Initializer from Parameter: ${name}`,
  },
  function: {},
};
