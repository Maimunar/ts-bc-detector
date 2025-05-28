import ts from "typescript";
import { Type } from "../../../model";
import { BCCreateType } from "../../utils";
import { BC, BreakingChange } from "../../../model/bcs";
import { isEffectivelyEqual } from "./utils";

export function compareInterfaceTypes(
  typeA: Type,
  typeB: Type,
  checkerA: ts.TypeChecker,
  checkerB: ts.TypeChecker,
  BCCreate: BCCreateType,
  warningFlag: boolean,
): BreakingChange[] {
  const bcs: BreakingChange[] = [];

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
      // Allow change to index signature if type is the same
      if (
        (kindA === "property" || kindA === "mapped") &&
        kindB === "index" &&
        checkerA.typeToString(typeAProp) === checkerB.typeToString(typeBProp)
      ) {
        // Allowed
      } else if (
        kindA === "mapped" &&
        kindB === "index" &&
        isIndexKeyRelaxedToString(declA, declB)
      ) {
        // Allowed if type the same
      } else {
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
  }

  // 2. Detect added properties
  for (const [name, symB] of mapB.entries()) {
    if (mapA.has(name)) continue;

    const declB = getRelevantDeclaration(symB);
    const kind = getMemberKind(declB);

    if (!isOptional(symB) && kind !== "index") {
      bcs.push(
        BCCreate(BC.types.typeLiteral.property.added(name), warningFlag),
      );
    }
  }

  return bcs;
}

function isOptional(sym: ts.Symbol): boolean {
  return (sym.getFlags() & ts.SymbolFlags.Optional) !== 0;
}

function getRelevantDeclaration(sym: ts.Symbol): ts.Declaration {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  return sym.getDeclarations()?.[0]!;
}

function getMemberKind(decl: ts.Declaration): "property" | "index" | "mapped" {
  if (!decl) return "property"; // Fallback if no declaration
  if (ts.isIndexSignatureDeclaration(decl)) return "index";
  if (ts.isMappedTypeNode(decl.parent)) return "mapped";
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
