# Parser

INPUT - A single file.

STEPS:

1. We split it into a list of declarations
2. We model each declaration according to its feature model
3. We handle each declaration according to its type and fill in the modelled info for it
4. We return a list of objects of declarations
5. We handle the types of declarations according to their feature model
6. We move to the rules handler part

## Implementation

1. Return a list of all declarations in a file
2. Return a list of all declarations with their declaration type
3. Model all declarations according to their feature model
4. Implement the code to model part
5. Return a full list of declarations with their modelled info and a type placeholder
6. Implement the types and add them to the returned list

## Declarations

### Enum

1. Modifiers - export, declare, const
2. Name
3. Members - list of member:
  - name
  - initializer (optional) - string or numeric literal

### Export Assignment
1. Expression - type of it

### Export Declaration
1. Modifiers - isTypeOnly
2. Export Clause
  - Namespace Export - with or without name
  - Named Exports - list of specifiers:
    - isTypeOnly
    - name
    - property name (alias)
3. Module specifier (optional) - string literal

### Function Declaration
1. Modifiers - export (default), async
2. Name
3. Parameters - list of parameters:
  - Name
  - Type
  - Extra operator - dotdotdot, question, initalizer (with expression), or no extra operator
4. Return Type

### Interface Declaration
1. Modifiers - export (default), declare
2. Name
3. Heritage Clauses (scoped down) - yes or no inheritance
4. Members: element list:
    - Name
    - Optional or not - questionToken
    - Type

### Type Alias
1. Modifiers - export, declare
2. Name
3. Type

### Variable
1. Modifiers - export, declare
2. Variable Declaration List:
  a. Declaration - let, const, var
  b. Declarations - list of variable declaration:
    - Name
    - Type
    - Initializer (optional) - expression

### Class

1. Modifiers:
  - Export (default or not)
  - Abstract
  - Declare
2. Heritage Clauses (scoped down) - yes or no inheritance
3. Name
4. Members:
  a. Setter
    - Modifiers - static, accessibility (public, private, protected)
      - Name
      - Parameters - (name, type)\*
  b. Property
    - Modifiers - readonly, abstract, static, declare, accessibility (public, private, protected)
    - Name
    - Type
  c. Method
    - Modifiers - static, abstract, async, accessibility (public, private, protected)
    - Name
    - Return Type
    - Parameters - Parameter list:
      - Name
      - Type
      - Extra operator - dotdotdot, question, initalizer (with expression), or no extra operator
  d. Getter
    - Modifiers - static, accessibility (public, private, protected)
    - Name
    - Type - Return Type
  e. Constructor
    - Parameters - Parameter List:
      - Name
      - Type
      - Extra operator - dotdotdot, question, initalizer (with expression), or no extra operator

## Types

Refer to the feature model image for the types.
