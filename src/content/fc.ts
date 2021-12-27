import { Cutcha } from '../cutcha';
import { Logger } from '../logging';

const input = document.querySelector('input#cap_token');
const form = document.querySelector<HTMLFormElement>('form#cform');

async function run() {
  if (input === null || form === null) {
    return;
  }
  Logger.log('Cutcha detected, solving...');
  const response = await fetch(Cutcha.VALIDATE_URL, {
    headers: {
      apiKey: __API_KEY__,
    },
  });

  const { token, message } = await response.json();

  if (token !== undefined) {
    input.setAttribute('value', token);
    form.submit();
  } else {
    Logger.error(message);
  }
}
run();
