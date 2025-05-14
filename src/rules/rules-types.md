## ConstructorType

1. Anything can be converted to any and unknown without resulting in a BC.
2. Literals can be converted to their respective types.
3. Boolean, number, object, string, void and symbol can convert to their own type.
4. Never can convert into anything else.
5. Undefined can be converted to undefined and void (but void can not be converted to undefined)
6. Import, Indexed Access and Type Query types 'inherit' the behaviour of the related primitive type. Changing between them is allowed as long as the primitive type allows it.

## BuildType

### Guidelines

When refering to a primitive type (any, object...), we mean that this type can appear in the forms of:

- ConstructorType
- ParenthesizedType
- Predefined Type Reference
- Union with 1 member in the types mentioned
- Intersection resulting in 1 of the above types

### Changing between types

- Anything can be changed to any type and not be a BC.
- ArrayType, FunctionType, TupleType, Builtin Promise type can be changed to object and not be a BC.
- Literal type can be changed to type keyword of the same type
- TupleType can be changed to ArrayType (of the same type) and not be a BC

### ArrayType

There are 570 Tests for ArrayType.
362 Breaking Changes found and displayed in `ArrayType/BCs.md`

1. Adding an array to a type is always a BC
2. Removing an array type is alllowed only in an object or any, or an array of object or any
3. Changing is allowed only if the resulting type is object or any

### ParenthesizedType

In a simple expample, a parenthesized type is equivalent to a constructor type, as parenthesis are used only to show order.
They are tested in more complex examples within the other types, but no tests are written for ParenthesizedType, as they would be the same as the ones for constructor types.

### Function Type

1. Adding a parameter is a BC if it is required and is not a BC if it is optional
2. Removing a parameter is a BC
3. Making a parameter optional is not a BC
4. Making a parameter required is a BC
5. Adding a function type is a BC
6. Removing a function type is a BC, except when the resulting type is any

### IntersectionType

1. Adding an intersection type is almost always a BC, with following exceptions happening with a type of a bigger range:
   - There is an any type in the intersection.
   - Adding an intersection with the same type.
   - Adding an intersection with an object type where the current type is an array, tuple, type literal or function.
   - Adding an intersection with an (array of/tuple of) number(s) type where the current type is ( an array of/a tuple of ) number literal(s), and vice versa for all types
   - Adding an intersection where the parameter of a function type is holding rules above
2. Removing an intersection type is never a BC.

### TupleType

1. Adding an removing an item to a tuple type is a BC
2. Adding a tuple type is a BC
3. Removing a tuple type is a BC, unless the resulting type is object, any, or a tuple/array of object or any

### TypeLiteral

1. Adding an index signature is never a BC (of type string, number, symbol or template literal).
2. Adding a mapped type and normal property signature is always a BC
3. Removing is always a BC, unless the resulting type is an empty object ({}).
4. Making a property signature, mapped type or index optional is never a BC.
5. Making an index signature required is never a BC.
6. Making a mapped type or property signature required is always a BC.
7. Changing Type literals varies as follows:
   - Changing to an object or any type is not a BC
   - Everything else is a BC, except the following special conditions below
   - Index Signature of Numbers - Changing to index of type string if the type is the same as the index type
   - Index Signature of Template Literal Type - Changing to index of type string if the type is the same as the index type
   - Mapped Type - Changing to index of type string if the type is the same as the index type
   - Property Signature - Changing to index of type string if the type is the same as the index type
   - No Type Literal:
     - Object type can be changed to an indexed type (index can be any type)
     - String type can be changed to an indexed type of type number with a value of type string

### TypeReference

1. Builtin types need to be tested separately to have a full pictures, rules below are for Promise.
2. Adding a Promise type reference is a BC
3. Removing a Promise type reference is a BC unless the resulting type is any or object

### UnionType

1. Adding a union type is never a BC
2. Removing a union type is a BC unless:
   - The is an any type left in the union
   - Number is left in the union and a number literal was removed, similarly for all types
   - Object is left in the union while an array, tuple, type literal or function was removed

### Total Count

1. ConstructorType: 2184 Tests; 1181 BCs
2. ArrayType: 570 Tests; 362 BCs
3. FunctionType: 483 Tests; 348 BCs
4. IntersectionType: 7200 Tests; 5532 BCs
5. TupleType: 240 Tests; 235 BCs
6. TypeLiteral: 4320 Tests; 954 BCs
7. TypeReference: 120 Tests; 111 BCs
8. UnionType: 10800 Tests; 3213 BCs
9. Changing between BuildTypes: 3240 Tests; 2597 BCs

Total: 29157 Tests; 14533 BCs
