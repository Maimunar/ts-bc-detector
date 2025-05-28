export interface BreakingChange {
  file: string;
  declaration: string;
  description: string;
  warning?: boolean;
}

export const BC = {
  removedDeclaration: "Removed Declaration",
  removedClassMember: "Removed Class Member",
  modifiers: {
    removedExport: "Removed Export Modifier",
    removedDefault: "Removed Default Modifier from export",
    addedDefault: "Added Default Modifier to export",
    removedDeclare: "Removed Declare Modifier",
    addedDeclare: "Added Declare Modifier",
    addedAbstract: "Added Abstract Modifier",
  },
  enum: {
    removedMember: (member: string) => `Removed Enum Member: ${member}`,
    removedExport: "Removed Enum Export Modifier",
  },
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
  interface: {
    member: {
      addedRequired: (name: string) => `Added Required Member: ${name}`,
      removed: (name: string) => `Removed Member: ${name}`,
      optionalToRequired: (name: string) =>
        `Changed Optional Member to Required: ${name}`,
    },
  },
  exportAssignment: {
    valueChanged: (from: string, to: string) =>
      `Changed Export Assignment Value from ${from} to ${to}`,
  },
  exportDeclaration: {
    removedExportSpecifier: (name: string) =>
      `Removed Export Specifier: ${name}`,
    addedTypeKeyword: "Added Type Keyword to Export Declaration",
    addedTypeKeywordToExportSpecifier: (name: string) =>
      `Added Type Keyword to Export Specifier: ${name}`,
    namespaceToNamed: "Changed Namespace Export to Named Export",
  },
  variable: {
    removedDeclaration: (name: string) =>
      `Removed Variable Declaration: ${name}`,
  },
  class: {
    modifiers: {
      publicToPrivate: "Changed Public Modifier to Private",
      publicToProtected: "Changed Public Modifier to Protected",
      protectedToPrivate: "Changed Protected Modifier to Private",
      addedStatic: "Added Static Modifier",
      removedStatic: "Removed Static Modifier",
      addedAbstract: "Added Abstract Modifier",
      removedAbstract: "Removed Abstract Modifier",
      addedReadonly: "Added Readonly Modifier",
      addedDeclare: "Added Declare Modifier",
      removedDeclare: "Removed Declare Modifier",
    },
    constructor: {
      added: "Constructor with required parameters added",
      removed: "Constructor with required parameters removed",
    },
  },
  types: {
    typeLiteral: {
      property: {
        removed: (name: string) => `Removed Type Literal Property: ${name}`,
        optionalToRequired: (name: string) =>
          `Changed Optional Type Literal Property to Required: ${name}`,
        changed: (from: string, to: string) =>
          `Changed Type Literal Property Type from '${from}' to '${to}'`,
        added: (name: string) =>
          `Added Required Type Literal Property: ${name}`,
      },
    },
  },
};
