import * as ts from "typescript";
import * as fs from "fs";

interface DocEntry {
  name?: string;
  type?: string;
  parameters?: DocEntry[];
  returnType?: string;
  exported?: boolean;
}

function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions,
): void {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();
  const output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
  fs.writeFileSync("addOne.json", JSON.stringify(output, undefined, 4));

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isVariableDeclaration(node) && node.name) {
      console.log("Is variable declaration");
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol) {
        output.push(serializeFunction(node, symbol));
      }
      // No need to walk further, this is a limited example
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.forEachChild(visit);
    }
  }

  function serializeFunction(node: ts.Node, symbol: ts.Symbol): DocEntry {
    const type = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration!,
    );

    const signatures = type.getCallSignatures();
    const signatureSerialized = serializeSignature(signatures[0]);

    const symbolSerialized: DocEntry = serializeSymbol(symbol);
    const exported = isNodeExported(node);

    return {
      ...symbolSerialized,
      ...signatureSerialized,
      exported,
    };
  }

  function serializeSymbol(symbol: ts.Symbol) {
    return {
      name: symbol.getName(),
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
      ),
    };
  }
  /** Serialize a signature (call or construct) */
  function serializeSignature(signature: ts.Signature) {
    return {
      parameters: signature.parameters.map(serializeSymbol),
      returnType: checker.typeToString(signature.getReturnType()),
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}

generateDocumentation(process.argv.slice(2), {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
});
