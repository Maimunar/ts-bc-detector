# Rules

## Enum

### Tested

1. changes from each state to another, with a single element for all tests.
2. changing the name of the enum in all 8 states.
3. adding an enum member - with and without an optional initializer (of type string)
4. removing an enum member - with and without an optional initializer (of type string)
5. adding an optional initializer
6. removing an optional initializer
7. changing the initializer from string to number
8. changing the initializer from number to string

### Rules

- Names - Changing an enum name is always a BC
- Adding an enum member is never a BC
- Removing an enum member is always a BC
- Adding and removing an initializer is not a BC
- Changing from string initializer to number and vice versa is not a BC
- Removing export is always a BC

## Export Assignment

### Tested

1. Remove Export Assignment - we test it with Identifier and Expression
2. Change - we test going from each state to another one.

### Rules

- Expression to Identifier and vice versa is allowed if the result is the same, otherwise it is a BC
- Interface can be converted to the same type and vice versa, but if it is not the same it is a BC.
- Removing an export assignment is always a BC.

## Export Declaration

### Tested

1. Adding an export specifier
2. Changing the export specifier (alias, type in all contexts)
3. changing named export to a namerspace export and vice versa
4. adding and removing the type keyword

### Rules

- Adding an export specifier is not a BC
- Removing an export specifier, namespace export or named export declaration is a BC.
- Adding or removing an alias (from clause or a specifier or a namespace) is a BC.
- Adding type is not a BC iff types are exported in v1 - usually it is a BC.
- Removing type is not a BC
- If one can guarantee that when changing the import from a named export to a namspace, we will export atleast the same element types, it is not a BC. Otherwise it is a BC.

## Function

### Tested

1. Adding a function
2. Removing a function
3. Changing a function modifier state
4. Changing a parameter - from no parameters; with all operators and with and without a declared type, in all viable function states
5. Parameter name change

### Rules

- Adding a function is not a BC
- Removing a function is a BC
- Adding and removing the default modifier is a BC
- Adding and removing the async modifier is a BC since it adds the Promise type to the return type. Consult with types if there are exceptions to that rule.
  - Note - this change is not breaking here, but in the types testing. Since we are not testing for types here, we are infering the knowledge here.
- Changing parameter names is not a BC
- Changing parameter modifiers (and adding/removing):
  - Changing from a dotdotdot modifier is always a BC.
  - Changing from an initializer is a BC iff the parameter is removed or there is no modifier. If there is a question mark or a dotdotdotdot, it is not a BC.
  - Changing from no operator is a BC only if the parameter is removed.
  - Changing from no parameter is a BC only if changed to an operator with no operators. Adding a parameter with dotdotdot, questionmark or initializer is not a BC.
  - Changing from a question mark is a BC iff parameter is removed or changed to have no operator. It is not a BC if changed to a dotdotdot or an initializer.
- Removing export is a BC

## Interface

### Tested

1. Changing from interface modifier states
2. Adding a member to the interface - with and without question token
3. Removing a member from the interface - with and without question token
4. Changing member name
5. Adding question token
6. Removing question token

### Rules

Adding or removing the default modifier keyword is always a BC.
Adding a required member is a BC.
Adding an optional member is not a BC.
Removing a member is a BC (optional or not).
Making a member optional is not a BC
Making an optional member required is a BC.
Changing a member name is a BC.
Removing export is a BC

## Type Alias

### Tested

1. Changing modifier states
2. Adding a type declaration
3. Removing a type declaration

### Rules

- Adding a type alias is not a BC
- Removing a type alias is a BC
- Changing modifier states is not a BC

## Variable

### Tested

1. Changing modifier states and declaration states (const, let, var)
2. Adding a variable declaration
3. Removing a variable declaration
4. Adding an initializer
5. Removing an initializer
6. Adding type
7. Removing type

### Rules

- Removing a variable declaration is a BC
- Everything else is not a BC
  - Declare breaks the api when used in an implemented variable, but this is on a library-level, so we are not concerned with it.
