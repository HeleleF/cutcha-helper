import { Cutcha } from '../cutcha';
import { CutchaResponseType } from '../interfaces';
import { Logger } from '../logging';
import { Request } from '../network/request';
import { Response } from '../network/response';
import { Timer } from '../timer';

class Wrapper extends XMLHttpRequest {
  send(body: XMLHttpRequestBodyInit) {
    if (typeof body !== 'string') {
      return super.send(body);
    }

    const data = Response.parse(body);
    if (Request.isSubmissionRequest(data)) {
      Cutcha.setSolution(data);
    }

    super.addEventListener(
      'load',
      () => {
        const data = Response.parse(super.response);
        if (data === null) return;

        switch (Response.getType(data)) {
          case CutchaResponseType.NEW_PUZZLE:
            Cutcha.setPuzzle(data);
            break;
          case CutchaResponseType.SUBMISSION_CORRECT:
            Cutcha.submit();

            break;
          default:
            return;
        }
      },
      { once: true }
    );

    const queryParams = new URLSearchParams(body);
    const timerKey = Timer.get();

    if (Request.needsTimerKey(queryParams) && timerKey !== null) {
      queryParams.append('tk', timerKey);
      return super.send(queryParams);
    }

    return super.send(body);
  }
}

window.XMLHttpRequest = Wrapper;
Logger.log('Intercepting cutcha requests');
