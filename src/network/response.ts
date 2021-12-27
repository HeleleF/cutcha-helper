import { CutchaResponse, CutchaResponseType, Obj } from '../interfaces';
import { Timer } from '../timer';

function getType(data: CutchaResponse): CutchaResponseType {
  if (data.succ !== true) {
    return CutchaResponseType.FAILED;
  }

  if (typeof data.timer === 'object' && Object.prototype.hasOwnProperty.call(data.timer, 'key')) {
    Timer.set((data.timer as Obj).key);
    return CutchaResponseType.NEW_TIMER_KEY;
  }

  if (typeof data.captcha_question === 'string' && typeof data.captcha_token === 'string') {
    return CutchaResponseType.NEW_PUZZLE;
  }

  return data.correct === true
    ? CutchaResponseType.SUBMISSION_CORRECT
    : CutchaResponseType.SUBMISSION_WRONG;
}

function parse(data: unknown): CutchaResponse | null {
  if (typeof data !== 'string') return null;

  try {
    return JSON.parse(data);
  } catch (_) {
    return null;
  }
}

export const Response = {
  getType,
  parse,
};
