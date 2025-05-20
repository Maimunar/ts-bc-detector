import { parseFile } from "./parser/parser";
import { watchForBCs } from "./ruleWatcher/ruleWatcher";

export function detectBCsFiles(v1File: string, v2File: string) {
  const v1Declaration = {
    file: v1File,
    declarations: parseFile(v1File),
  };

  const v2Declaration = {
    file: v2File,
    declarations: parseFile(v2File),
  };

  const breakingChanges = watchForBCs(v1Declaration, v2Declaration);

  console.log("Breaking Changes:", breakingChanges);

  return breakingChanges;
}

function detectBCsFromTestFile() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Please provide a directory path as an argument.");
    return;
  }

  const v1File = dir + "/v1.ts";
  const v2File = dir + "/v2.ts";

  const breakingChanges = detectBCsFiles(v1File, v2File);

  return breakingChanges;
}

detectBCsFromTestFile();
