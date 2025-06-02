import ts from "typescript";
import { Type } from "../../../model";
import { BCCreateType } from "../../utils";
import { BC, BreakingChange } from "../../../model/bcs";
import {
  isAnyOrUnknown,
  isEffectivelyEqual,
  isObjectKeyword,
  isOptional,
  isPrimitiveType,
  isStringKeyword,
  isTypeLiteralType,
} from "./utils";
import { fallbackAny } from "../../../parser/helper";

export function compareInterfaceTypes(
  typeA: Type,
  typeB: Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];

  // If v2 no longer has a type literal
  if (!isTypeLiteralType(typeB)) {
    // If it is object, any, or unknown its okay
    if (isObjectKeyword(typeB, checkerB) || isAnyOrUnknown(typeB)) return [];

    // If it is a string, check if it has indexes with numbered keys and string value
    if (isStringKeyword(typeB)) {
      const props = checkerA.getPropertiesOfType(typeA);
      let isKeyNumberStringValue = false;
      props.forEach((sym) => {
        const decl = getRelevantDeclaration(sym);
        const typeAProp = checkerA.getTypeOfSymbolAtLocation(sym, decl);
        if (hasNumberToStringIndexSignature(typeAProp, checkerA)) {
          isKeyNumberStringValue = true;
        }
      });

      if (isKeyNumberStringValue) return [];
    }

    // If not, return a BC
    bcs.push(BCCreate(BC.types.typeLiteral.removed, warningFlag));
    return bcs;
  }

  // If v1 was not a type literal, return a BC
  if (!isTypeLiteralType(typeA)) {
    bcs.push(BCCreate(BC.types.typeLiteral.added, warningFlag));
    return bcs;
  }

  const propsA = checkerA.getPropertiesOfType(typeA);
  const propsB = checkerB.getPropertiesOfType(typeB);

  const mapA = new Map(propsA.map((sym) => [sym.name, sym]));
  const mapB = new Map(propsB.map((sym) => [sym.name, sym]));

  // 1. Detect removed or modified properties
  for (const [name, symA] of mapA.entries()) {
    const symB = mapB.get(name);
    if (!symB) {
      // Warning because an index type could be added to cover it
      bcs.push(BCCreate(BC.types.typeLiteral.property.removed(name), true));
      continue;
    }

    const declA = getRelevantDeclaration(symA);
    const declB = getRelevantDeclaration(symB);

    const typeAProp = checkerA.getTypeOfSymbolAtLocation(symA, declA);
    const typeBProp = checkerB.getTypeOfSymbolAtLocation(symB, declB);

    const kindA = getMemberKind(declA);
    const kindB = getMemberKind(declB);

    // Optionality change
    // Making required is a breaking change if its not an index signature
    if (isOptional(symA) && !isOptional(symB) && kindB !== "index") {
      bcs.push(
        BCCreate(
          BC.types.typeLiteral.property.optionalToRequired(name),
          warningFlag,
        ),
      );
    }

    // Type change
    if (!isEffectivelyEqual(typeAProp, typeBProp, checkerA, checkerB)) {
      bcs.push(
        BCCreate(
          BC.types.typeLiteral.property.changed(
            checkerA.typeToString(typeAProp),
            checkerB.typeToString(typeBProp),
          ),
          warningFlag,
        ),
      );
    }
  }
  // 2. Detect added properties
  for (const [name, symB] of mapB.entries()) {
    if (mapA.has(name)) continue;

    if (!isOptional(symB)) {
      bcs.push(
        BCCreate(BC.types.typeLiteral.property.added(name), warningFlag),
      );
    }
  }

  const declA = inspectStructure(typeA, checkerA);
  const declB = inspectStructure(typeB, checkerB);

  for (const [nameA, declarationA] of Object.entries(declA)) {
    if (declarationA.kind === "property") continue;

    const declarationB = declB[nameA];
    const aIsIndex = declarationA.kind === "index";
    if (!declarationB) {
      const secondaryName = aIsIndex ? "mapped" : "index";
      const secondaryDeclarationB = declB[secondaryName];
      if (!secondaryDeclarationB) {
        bcs.push(BCCreate(BC.types.typeLiteral.property.removed(nameA)));
        continue;
      } else if (aIsIndex) {
        bcs.push(
          BCCreate(
            BC.types.typeLiteral.property.changed("Index", "Mapped Type"),
          ),
        );
        continue;
      }
    }
    // Both are index
    if (aIsIndex) {
      if (
        declarationA.keyType === "string" &&
        declarationB.keyType !== "string"
      ) {
        if (declarationB.keyType === "number") {
          bcs.push(BCCreate(BC.types.typeLiteral.index.stringToNumber));
          continue;
        } else {
          // is template
          bcs.push(
            BCCreate(BC.types.typeLiteral.index.stringToTemplateLiteral),
          );
          continue;
        }
      }
      // Types: different is error
      if (
        !isEffectivelyEqual(
          declarationA.type,
          declarationB.type,
          checkerA,
          checkerB,
        )
      ) {
        bcs.push(
          BCCreate(
            BC.types.typeLiteral.index.typeChanged(
              checkerA.typeToString(declarationA.type),
              checkerB.typeToString(declarationB.type),
            ),
          ),
        );
      }
    }
  }

  // logic for index and shit
  // // Allow change to index signature if type is the same
  // if (
  //   (kindA === "property" || kindA === "mapped") &&
  //   kindB === "index" &&
  //   checkerA.typeToString(typeAProp) === checkerB.typeToString(typeBProp)
  // ) {
  //   // Allowed
  // } else if (
  //   kindA === "mapped" &&
  //   kindB === "index" &&
  //   isIndexKeyRelaxedToString(declA, declB)
  // ) {
  //   // Allowed if type the same

  return bcs;
}
type Decl = {
  kind: "index" | "property" | "mapped";
  name: string;
  keyType?: "number" | "string" | "template";
  keyTypeValue?: number | string;
  type: Type;
};

function inspectStructure(
  type: ts.Type,
  checker: ts.TypeChecker,
): Record<string, Decl> {
  const declarations: { [key: string]: Decl } = {};

  const symbol = type.getSymbol();
  if (!symbol) return declarations;

  for (const decl of symbol.getDeclarations() || []) {
    if (!ts.isInterfaceDeclaration(decl) && !ts.isTypeLiteralNode(decl))
      continue;

    for (const member of decl.members) {
      // Handle regular properties
      if (
        ts.isPropertySignature(member) &&
        member.name &&
        ts.isIdentifier(member.name)
      ) {
        const name = member.name.text;
        const propType = member.type
          ? checker.getTypeFromTypeNode(member.type)
          : fallbackAny(checker);

        declarations[name] = {
          name,
          kind: "property",
          type: propType,
        };
      }

      // Handle index signatures
      else if (ts.isIndexSignatureDeclaration(member)) {
        const param = member.parameters[0];
        const paramType = param?.type;

        let keyKind = "template";
        if (paramType) {
          if (
            isPrimitiveType(checker.getTypeFromTypeNode(paramType), checker)
          ) {
            if (ts.SyntaxKind[paramType.kind] === "StringKeyword") {
              keyKind = "string";
            } else if (ts.SyntaxKind[paramType.kind] === "NumberKeyword") {
              keyKind = "number";
            }
          }
        }

        const valueType = checker.getTypeFromTypeNode(member.type);
        const valueTypeStr = checker.typeToString(valueType);

        declarations[`index`] = {
          name: `index`,
          kind: "index",
          keyType: keyKind as "number" | "string" | "template",
          keyTypeValue: valueTypeStr,
          type: valueType,
        };
      }

      // Handle mapped types (e.g., { [K in keyof T]: ... })
      else if (ts.isMappedTypeNode(member)) {
        const nameType = member.typeParameter.name.getText();
        const constraint = member.typeParameter.constraint
          ? checker.typeToString(
              checker.getTypeFromTypeNode(member.typeParameter.constraint),
            )
          : "unknown";
        const type = member.type
          ? checker.getTypeFromTypeNode(member.type)
          : fallbackAny(checker);

        declarations["mapped"] = {
          name: "mapped",
          kind: "mapped",
          type,
        };
      }
    }
  }
  return declarations;
}

function getRelevantDeclaration(sym: ts.Symbol): ts.Declaration {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  return sym.getDeclarations()?.[0]!;
}

function getMemberKind(decl: ts.Declaration): "property" | "index" | "mapped" {
  if (!decl) return "property";
  if (ts.isIndexSignatureDeclaration(decl)) return "index";

  if (
    ts.isMappedTypeNode(decl.parent) &&
    decl.parent.typeParameter.constraint &&
    ts.isTemplateLiteralTypeNode(decl.parent.typeParameter.constraint)
  ) {
    return "mapped";
  }

  return "property";
}

function isIndexKeyRelaxedToString(
  declA: ts.Declaration,
  declB: ts.Declaration,
): boolean {
  if (
    !ts.isIndexSignatureDeclaration(declA) ||
    !ts.isIndexSignatureDeclaration(declB)
  )
    return false;

  const paramA = declA.parameters[0];
  const paramB = declB.parameters[0];

  if (!paramA || !paramB || !paramA.type || !paramB.type) return false;

  const allowedTypes = ["string", "number", "template"];
  const getKind = (t: ts.TypeNode): string => {
    if (ts.isTemplateLiteralTypeNode(t)) return "template";
    if (t.kind === ts.SyntaxKind.StringKeyword) return "string";
    if (t.kind === ts.SyntaxKind.NumberKeyword) return "number";
    return "other";
  };

  const kindA = getKind(paramA.type);
  const kindB = getKind(paramB.type);

  return (
    allowedTypes.includes(kindA) && kindB === "string" && kindA !== "string"
  );
}

export function hasNumberToStringIndexSignature(
  type: ts.Type,
  checker: ts.TypeChecker,
): boolean {
  if (!(type.flags & ts.TypeFlags.Object)) {
    return false;
  }

  const indexType = checker.getIndexInfoOfType(type, ts.IndexKind.Number);
  if (!indexType || !indexType.type) return false;

  const valueType = indexType.type;
  const valueTypeStr = checker.typeToString(valueType);

  return valueTypeStr === "string";
}
