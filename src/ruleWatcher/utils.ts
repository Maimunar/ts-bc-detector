import { BreakingChange } from "../model/bcs";

export const createBC =
  (file: string) =>
  (declaration: string) =>
  (description: string, warning?: boolean): BreakingChange => {
    const bc: BreakingChange = { file, declaration, description };
    if (warning) bc.warning = true;

    return bc;
  };

export type BCCreateType = (
  description: string,
  warning?: boolean,
) => BreakingChange;
