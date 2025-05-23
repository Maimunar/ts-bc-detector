import { BreakingChange } from "./model/bcs";
import { parseFile } from "./parser/parser";
import { watchForBCs } from "./ruleWatcher/ruleWatcher";
import fs from "fs";
import * as path from "path";
import cliProgress, { Presets } from "cli-progress";

function detectBCsFiles(v1File: string, v2File: string, debug: boolean) {
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

const getProgressBar = () =>
  new cliProgress.SingleBar(
    {
      format: "Processing |{bar}| {percentage}% || {value}/{total} directories",
    },
    Presets.shades_classic,
  );

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function findChangedFiles(v1Root: string, v2Root: string): string[] {
  const changedFiles: string[] = [];
  const absV1Root = path.resolve(v1Root);
  const absV2Root = path.resolve(v2Root);

  function walkV1(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === "node_modules") continue;

      const v1Path = path.join(dir, entry.name);
      const relativePath = path.relative(absV1Root, v1Path);
      const v2Path = path.join(absV2Root, relativePath);

      if (entry.isDirectory()) {
        walkV1(v1Path);
      } else if (entry.isFile() && v1Path.endsWith(".ts")) {
        const v1Content = readFileSafe(v1Path);
        const v2Content = readFileSafe(v2Path);

        if (v2Content === null) {
          console.log(`Missing in v2: ${v2Path}`);
          changedFiles.push(relativePath);
        } else if (v1Content !== v2Content) {
          changedFiles.push(relativePath);
        }
      }
    }
  }

  walkV1(absV1Root);
  return changedFiles;
}

function detectBCs(debug: boolean = false) {
  const v1Dir = process.argv[2];
  const v2Dir = process.argv[3];
  if (!v1Dir || !v2Dir) {
    console.error("Please provide two directory paths as arguments.");
    return;
  }
  const changedFiles = findChangedFiles(v1Dir, v2Dir);
  if (debug) {
    console.log("Changed files:", changedFiles);
  }

  const progressBar = getProgressBar();

  progressBar.start(changedFiles.length, 0);

  const breakingChanges: BreakingChange[] = [];

  for (const file of changedFiles) {
    const v1File = path.join(v1Dir, file);
    const v2File = path.join(v2Dir, file);

    if (!fs.existsSync(v1File) || !fs.existsSync(v2File)) {
      console.error(`Files ${v1File} or ${v2File} do not exist.`);
      continue;
    }

    breakingChanges.push(...detectBCsFiles(v1File, v2File, debug));

    progressBar.increment();
  }
  progressBar.stop();

  console.log("Breaking Changes:", breakingChanges);
  console.log("Total Breaking Changes Found:", breakingChanges.length);

  return breakingChanges;
}
detectBCs();
