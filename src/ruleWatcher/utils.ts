import { BreakingChange } from "../model/bcs";

export const createBC =
  (file: string) =>
  (declaration: string) =>
  (description: string): BreakingChange => {
    return {
      file,
      declaration,
      description,
    };
  };

export type BCCreateType = (description: string) => BreakingChange;
