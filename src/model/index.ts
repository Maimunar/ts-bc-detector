import ts from "typescript";

// Utils
export type Type = ts.Type;

export type Parameter = {
  name: string;
  type: Type;
  extraOperator: "rest" | "optional" | "initializer" | "none";
  initializer?: string; // only if extraoperator is initializer
};

// Enum
export type EnumModifier = "export" | "declare" | "const";
export type EnumMember = { name: string; initializer?: string | number };

export interface EnumDeclaration {
  kind: "enum";
  modifiers: EnumModifier[];
  name: string;
  members: EnumMember[];
}

// Export Assignment
export interface ExportAssignment {
  kind: "exportAssignment";
  value: string;
}

// Export Declaration
export type ExportSpecifier = {
  isTypeOnly: boolean;
  name: string;
  propertyName?: string;
};
export type NamedExport = { specifiers: ExportSpecifier[]; type: "named" };
export type NamespaceExport = { name?: string; type: "namespace" };

export interface ExportDeclaration {
  kind: "exportDeclaration";
  isTypeOnly: boolean;
  exportClause: NamedExport | NamespaceExport;
  moduleSpecifier?: string;
}

// Function Declaration
export type FunctionModifier = "export" | "default" | "async";
export interface FunctionDeclaration {
  kind: "function";
  modifiers: FunctionModifier[];
  name: string;
  parameters: Parameter[];
  returnType?: Type;
}

// Interface Declaration
export type InterfaceModifier = "export" | "declare" | "default";
export interface InterfaceMember {
  name: string;
  optional: boolean;
  type: Type;
}

export interface InterfaceDeclaration {
  kind: "interface";
  modifiers: InterfaceModifier[];
  name: string;
  members: InterfaceMember[];
}

// Type Alias Declaration
export type TypeAliasModifier = "export" | "declare";

export interface TypeAliasDeclaration {
  kind: "typeAlias";
  modifiers: TypeAliasModifier[];
  name: string;
  type: Type;
}

// Variable Declaration
export type VariableModifier = "export" | "declare";
export type VariableDeclaration = {
  name: string;
  type: Type;
};
export interface VariableStatement {
  kind: "variable";
  modifiers: VariableModifier[];
  declarationType: "const" | "let" | "var";
  declarations: VariableDeclaration[];
}

/*
 * Class Declaration
 */

export type AccessibilityModifier = "public" | "private" | "protected";

// Setter
export type SetterModifier = "static" | AccessibilityModifier;

export interface SetterDeclaration {
  kind: "setter";
  modifiers: SetterModifier[];
  name: string;
  parameters: { name: string; type: Type }[];
}

// Property
export type PropertyModifier =
  | "static"
  | "readonly"
  | "abstract"
  | "declare"
  | AccessibilityModifier;

export interface PropertyDeclaration {
  kind: "property";
  modifiers: PropertyModifier[];
  name: string;
  type: Type;
}

// Method
export type MethodModifier =
  | "static"
  | "abstract"
  | "async"
  | AccessibilityModifier;

export interface MethodDeclaration {
  kind: "method";
  modifiers: MethodModifier[];
  name: string;
  parameters: Parameter[];
  returnType?: Type;
}

// Getter
export type GetterModifier = "static" | AccessibilityModifier;
export interface GetterDeclaration {
  kind: "getter";
  modifiers: GetterModifier[];
  name: string;
  returnType?: Type;
}

// Constructor
export interface ConstructorDeclaration {
  kind: "constructor";
  parameters: Parameter[];
}

// Class
export type ClassModifier = "export" | "default" | "declare" | "abstract";
export type ClassMember =
  | ConstructorDeclaration
  | MethodDeclaration
  | PropertyDeclaration
  | GetterDeclaration
  | SetterDeclaration;

export interface ClassDeclaration {
  kind: "class";
  modifiers: ClassModifier[];
  name: string;
  members: ClassMember[];
}

export type Declaration =
  | ClassDeclaration
  | EnumDeclaration
  | FunctionDeclaration
  | InterfaceDeclaration
  | TypeAliasDeclaration
  | VariableStatement
  | ExportDeclaration
  | ExportAssignment;
