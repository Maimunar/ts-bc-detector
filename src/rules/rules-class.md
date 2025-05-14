# Rules for class

## Class

### Tested

1. Changes from one state to another.
2. Adding and removing a class.

### Rules

- Removing the export keyword is a BC
- Adding a class is never a BC, removing a class always is a BC
- Adding and removing the declare keyword to a class is always a BC.
- Adding and removing the default keyword to a (class) export is always a BC.
- Adding the abstract keyword to a class is a BC, but removing it isnt.

## Constructor

### Tested

1. Adding a paremeter
2. Removing a parameter
3. Changing a parameter name
4. Changing from 1 parameter operator to another

### Rules

1. Adding and removing a parameter with its rules is following the function analysis in terms of BCs and operators
2. Adding a constructor is not a BC only when the constructor has no parameters or optional parameters/rest operator parameters/parameter with initializer.
3. Removing a constructor is not a BC only when the constructor has no parameters or optional parameters/rest operator parameters/parameter with initializer.
4. Changing a parameter name is not a BC

## Getter

### Tested

1. Adding a getter
2. Removing a getter

### Rules

1. Removing a getter is a BC only if the getter removed is public or protected

## Method

### Tested

1. Changing states
2. Adding a method - different name
3. Adding a method - same name
4. Removing a method
5. Adding a param
6. Removing a param

### Rules

- Moving from a public state to a protected/private one and from a protected state to a private one is a BC
- Adding and removing static is a BC
- Adding and removing abstract is a BC
- No accessibility keyword is equal to private
- Although async results in a different return type, adding the keyword is not a BC
- Removing a public or protected method is a BC.
- Adding a type of a method with the same name is not a BC, but removing it is. You can not have more than 1 implementation
- Adding a method param is a BC if it does not have a special operator (initializer, optional, rest)
- Removing a method param is a BC

## Property

### Tested

1. Adding a property
2. Removing a property
3. Changing state

### Rules

- Adding a property is not a BC, but removing a (protected/private) property is a BC.
- Adding and removing the static keyword is a BC.
- Adding the readonly keyword is a BC, but removing it is not.
- Adding and removing the abstract and declare keywords is a BC.
- Accessibility modifiers work as methods

## Setter

### Tested

1. Adding a setter
2. Removing a setter

### Rules

1. Removing a setter is a BC only if the setter removed is public or protected
