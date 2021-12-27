import { CutchaResponse, Puzzle, Solution, SubmissionRequest } from './interfaces';
import { Logger } from './logging';

let currentPuzzle: Puzzle | null = null;
let currentSolution: Solution | null = null;

const API_URL = 'https://cutcha.herokuapp.com/api';

function setSolution({ solution }: SubmissionRequest): void {
  currentSolution = {
    x0: solution[0][0],
    y0: solution[0][1],
    x1: solution[1][0],
    y1: solution[1][1],
    x2: solution[2][0],
    y2: solution[2][1],
  };
}
function setPuzzle({ captcha_question, captcha_token }: CutchaResponse): void {
  currentPuzzle = {
    id: captcha_question as string,
    token: captcha_token as string,
  };
}
function submit(): void {
  if (currentPuzzle !== null && currentSolution !== null) {
    Logger.log('Sending solution');
    const blob = new Blob(
      [
        JSON.stringify({
          ...currentSolution,
          ...currentPuzzle,
          extension: __EXTENSION_KEY__,
        }),
      ],
      { type: 'application/json; charset=UTF-8' }
    );
    navigator.sendBeacon(`${API_URL}/puzzle/submit`, blob);
  }
}

export const Cutcha = {
  setSolution,
  setPuzzle,
  submit,
  VALIDATE_URL: `${API_URL}/token/validate`,
};
