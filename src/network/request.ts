import { SubmissionRequest } from '../interfaces';

function needsTimerKey(searchParams: URLSearchParams): boolean {
  const keys = [...searchParams.keys()];

  return keys.length === 3 && keys.includes('api_key') && keys.includes('i') && keys.includes('ts');
}

function isSubmissionRequest(data: unknown): data is SubmissionRequest {
  if (typeof data !== 'object' || data === null) return false;

  const maybe = data as SubmissionRequest;

  return (
    typeof maybe.api_key === 'string' &&
    typeof maybe.captcha_token === 'string' &&
    typeof maybe.papi === 'string' &&
    Array.isArray(maybe.solution) &&
    maybe.solution.every((elm) => elm.length === 3)
  );
}

export const Request = {
  needsTimerKey,
  isSubmissionRequest,
};
