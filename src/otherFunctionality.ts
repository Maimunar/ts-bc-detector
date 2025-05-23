//function detectBCsOfAllDirs(debug: boolean = false) {
//  const dir = process.argv[2];
//  if (!dir) {
//    console.error("Please provide a directory path as an argument.");
//    return;
//  }
//
//  const directories = getLeafDirectories(dir);
//
//  const progressBar = getProgressBar();
//
//  if (debug) {
//    console.log("Directories To Test:", directories);
//  }
//  progressBar.start(directories.length, 0);
//
//  const breakingChanges: BreakingChange[] = [];
//
//  for (const directory of directories) {
//    const v1File = directory + "/v1.ts";
//    const v2File = directory + "/v2.ts";
//
//    progressBar.increment();
//
//    if (!fs.existsSync(v1File) || !fs.existsSync(v2File)) {
//      console.error(`Missing v1.ts or v2.ts in ${directory}`);
//      continue;
//    }
//
//    breakingChanges.push(...detectBCsFiles(v1File, v2File, debug));
//  }
//
//  progressBar.stop();
//
//  console.log("Breaking Changes:", breakingChanges);
//  console.log("Total Breaking Changes Found:", breakingChanges.length);
//
//  return breakingChanges;
//}
//detectBCsOfAllDirs();
