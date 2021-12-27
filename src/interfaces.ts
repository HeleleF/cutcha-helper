export type CutchaResponse = Record<string, unknown>;
export type Obj = Record<string, string>;

export interface SubmissionRequest {
  readonly captcha_token: string;
  readonly api_key: string;
  readonly papi: string;
  readonly solution: number[][];
}

/**
 * Each cutcha is defined by its unique id.
 * The token can be used to validate this (and only this) puzzle.
 */
export interface Puzzle {
  readonly id: string;
  readonly token: string;
}

/**
 * A cutcha solution consists of three
 * coordinate pairs.
 */
export interface Solution {
  readonly x0: number;
  readonly x1: number;
  readonly x2: number;
  readonly y0: number;
  readonly y1: number;
  readonly y2: number;
}

/**
 * This is not exhaustive, but it fulfills
 * our needs (for now).
 *
 * Basically we only need `NEW_PUZZLE` and
 * `SUBMISSION_CORRECT`
 */
export enum CutchaResponseType {
  FAILED,
  NEW_TIMER_KEY,
  NEW_PUZZLE,
  SUBMISSION_CORRECT,
  SUBMISSION_WRONG,
}
