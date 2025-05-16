// Utils
type Type = string;

type Parameter = {
  name: string;
  type: Type;
  extraOperator: "rest" | "optional" | "initializer" | "none";
  initializer?: string; // only if extraoperator is initializer
};

// Enum
type EnumModifier = "export" | "declare" | "const";
type EnumMember = { name: string; initializer?: string | number };

export interface Enum {
  modifiers: EnumModifier[];
  name: string[];
  members: EnumMember[];
}

// Export Assignment
export interface ExportAssignment {
  value: string;
}

// Export Declaration
type ExportSpecifier = {
  isTypeOnly: boolean;
  name: string;
  propertyName?: string;
};
type NamedExport = { specifiers: ExportSpecifier[]; type: "named" };
type NamespaceExport = { name?: string; type: "namespace" };

export interface ExportDeclaration {
  isTypeOnly: boolean;
  exportClause: NamedExport | NamespaceExport;
  moduleSpecifier?: string;
}

// Function Declaration
type FunctionModifier = "export" | "default" | "async";
export interface FunctionDeclaration {
  modifiers: FunctionModifier[];
  name: string;
  parameters: Parameter[];
  returnType?: Type;
}

// Interface Declaration
type InterfaceModifier = "export" | "declare" | "default";
interface InterfaceMember {
  name: string;
  optional: boolean;
  type: Type;
}

export interface InterfaceDeclaration {
  modifiers: InterfaceModifier[];
  name: string;
  members: InterfaceMember[];
}

// Type Alias Declaration
type TypeAliasModifier = "export" | "declare";

export interface TypeAliasDeclaration {
  modifiers: TypeAliasModifier[];
  name: string;
  type: Type;
}

// Variable Declaration
type VariableModifier = "export" | "declare";
type VariableDeclaration = {
  name: string;
  type: Type;
};
export interface VariableStatement {
  modifiers: VariableModifier[];
  declarationType: "const" | "let" | "var";
  declarations: VariableDeclaration[];
}

/*
 * Class Declaration
 */

type AccessibilityModifier = "public" | "private" | "protected";

// Setter
type SetterModifier = "static" | AccessibilityModifier;

export interface SetterDeclaration {
  modifiers: SetterModifier[];
  name: string;
  parameters: { name: string; type: Type }[];
}

// Property
type PropertyModifier =
  | "static"
  | "readonly"
  | "abstract"
  | "declare"
  | AccessibilityModifier;

export interface PropertyDeclaration {
  modifiers: PropertyModifier[];
  name: string;
  type: Type;
}

// Method
type MethodModifier = "static" | "abstract" | "async" | AccessibilityModifier;
export interface MethodDeclaration {
  modifiers: MethodModifier[];
  name: string;
  parameters: Parameter[];
  returnType?: Type;
}

// Getter
type GetterModifier = "static" | AccessibilityModifier;
export interface GetterDeclaration {
  modifiers: GetterModifier[];
  name: string;
  returnType?: Type;
}

// Constructor
export interface ConstructorDeclaration {
  parameters: Parameter[];
}

// Class
type ClassModifier = "export" | "default" | "declare" | "abstract";
type ClassMember =
  | ConstructorDeclaration
  | MethodDeclaration
  | PropertyDeclaration
  | GetterDeclaration
  | SetterDeclaration;

export interface ClassDeclaration {
  modifiers: ClassModifier[];
  name: string;
  members: ClassMember[];
}
