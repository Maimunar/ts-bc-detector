import { BreakingChange } from "./model/bcs";
import { parseFile } from "./parser/parser";
import { watchForBCs } from "./ruleWatcher/ruleWatcher";
import fs from "fs";

export function detectBCsFiles(v1File: string, v2File: string, debug: boolean) {
  const v1Declaration = {
    file: v1File,
    ...parseFile(v1File, debug),
  };

  const v2Declaration = {
    file: v2File,
    ...parseFile(v2File, debug),
  };

  const breakingChanges = watchForBCs(v1Declaration, v2Declaration);

  return breakingChanges;
}

function detectBCsFromTestFile(debug: boolean = false) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Please provide a directory path as an argument.");
    return;
  }

  const v1File = dir + "/v1.ts";
  const v2File = dir + "/v2.ts";

  const breakingChanges = detectBCsFiles(v1File, v2File, debug);

  console.log("Breaking Changes:", breakingChanges);
  return breakingChanges;
}

function detectBCsOfAllDirsInDir(debug: boolean = false) {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Please provide a directory path as an argument.");
    return;
  }

  // Get all directories in the specified directory
  const directories = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dir + "/" + dirent.name);
  console.log("Directories To Test:", directories);

  const breakingChanges: BreakingChange[] = [];

  for (const directory of directories) {
    const v1File = directory + "/v1.ts";
    const v2File = directory + "/v2.ts";

    if (!fs.existsSync(v1File) || !fs.existsSync(v2File)) {
      console.error(`Missing v1.ts or v2.ts in ${directory}`);
      continue;
    }

    breakingChanges.push(...detectBCsFiles(v1File, v2File, debug));
  }

  console.log("Breaking Changes:", breakingChanges);
  return breakingChanges;
}

//detectBCsFromTestFile();
detectBCsOfAllDirsInDir();
