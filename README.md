# typescript-breaking-change-detector

A tool that detects Breaking changes between 2 versions of a Typescript project

The rules at `rules.md` given are based on the defined BCs in https://github.com/Maimunar/typescript-breaking-changes

## How to run

1. Build the project - `pnpm build`
2. Link it - `npm link` while in the directory
3. Run `bc-detector <INPUT>` where INPUT is a directory that holds folders v1 and v2 resembling the 2 repository versions you want to test.

### CLI Options
- `-i` - Ignore specific directories
- `-d` - Run in debug mode - mostly useful for tool development and troubleshooting

## Implementation

The `src` folder holds the whole structure:
- `model` takes care of the modeled AST of TS based on `parser`
- `rules` handles all language requirements, based on the BCs repository linked above and done per API element. A summary of the rules can be found in `rules`

`detectionEvaluation` handles an academic accuracy evaluation.
