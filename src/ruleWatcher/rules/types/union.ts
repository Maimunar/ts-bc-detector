import ts from "typescript";

export function compareUnionTypes(
  typeA: ts.Type,
  checkerA: ts.TypeChecker,
  typeB: ts.Type,
  checkerB: ts.TypeChecker,
): string[] {
  const messages: string[] = [];

  const typesA = (typeA as ts.UnionType).types;
  const typesB = (typeB as ts.UnionType).types;

  const strA = typesA.map((t) => checkerA.typeToString(t));
  const strB = typesB.map((t) => checkerB.typeToString(t));

  const removed = strA.filter((t) => !strB.includes(t));
  const added = strB.filter((t) => !strA.includes(t));

  for (const r of removed) messages.push(`❌ Union member removed: ${r}`);
  for (const a of added) messages.push(`❌ Union member added: ${a}`);

  return messages;
}
