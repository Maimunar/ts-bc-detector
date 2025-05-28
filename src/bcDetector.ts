import { BreakingChange } from "./model/bcs";
import { parseFile } from "./parser/parser";
import { watchForBCs } from "./ruleWatcher/ruleWatcher";
import fs from "fs";
import * as path from "path";
import cliProgress, { Presets } from "cli-progress";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

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

function findChangedFiles(
  v1Root: string,
  v2Root: string,
  ignoredDirs: string[],
): string[] {
  const changedFiles: string[] = [];
  const absV1Root = path.resolve(v1Root);
  const absV2Root = path.resolve(v2Root);

  ignoredDirs.push("node_modules");

  function walkV1(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoredDirs.includes(entry.name)) continue;

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

function outputBreakingChanges(
  breakingChanges: BreakingChange[],
  dir: string,
  debug: boolean,
) {
  if (debug) console.log("Breaking Changes:", breakingChanges);

  // Save the breaking changes to a file
  // filter out any occurrences of ../ in dir
  const safeDir = dir.replace(/\.\.\//g, "");
  const fileDir = path.join("output", safeDir);
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir, { recursive: true });
  }
  const bcs: BreakingChange[] = [];
  const warnings: BreakingChange[] = [];

  for (const bc of breakingChanges) {
    if (bc.warning) warnings.push(bc);
    else bcs.push(bc);
  }

  const bcsOutput = path.join(fileDir, "breakingChanges.json");
  const warningsOutput = path.join(fileDir, "warnings.json");
  fs.writeFileSync(bcsOutput, JSON.stringify(bcs, null, 2));
  fs.writeFileSync(
    warningsOutput,
    JSON.stringify(
      warnings.map((w) => ({
        file: w.file,
        declaration: w.declaration,
        description: w.description,
      })),
      null,
      2,
    ),
  );

  console.log("Total Breaking Changes:", bcs.length);
  console.log(`Breaking changes saved to: ${bcsOutput}`);
  console.log("Total Warnings:", warnings.length);
  console.log(`Warnings saved to: ${warningsOutput}`);
}

function detectBCs() {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Please provide a directory path as an argument.");
    return;
  }
  const v1Dir = path.join(dir, "v1");
  const v2Dir = path.join(dir, "v2");

  const argv = yargs(hideBin(process.argv))
    .option("ignoreDirs", {
      alias: "i",
      type: "array",
      description: "List of directories to ignore",
      default: [],
    })
    .option("debug", {
      alias: "d",
      type: "boolean",
      description: "Enable debug mode",
      default: false,
    })
    .parseSync();

  const changedFiles = findChangedFiles(
    v1Dir,
    v2Dir,
    argv.ignoreDirs as string[],
  );

  if (argv.debug) console.log("Changed files:", changedFiles);

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

    breakingChanges.push(...detectBCsFiles(v1File, v2File, argv.debug));

    progressBar.increment();
  }
  progressBar.stop();

  outputBreakingChanges(breakingChanges, dir, argv.debug);

  return breakingChanges;
}
detectBCs();
