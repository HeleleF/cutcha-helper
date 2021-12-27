const ID = 'CUTCHA_TK';

let timerKey = localStorage.getItem(ID);

function get(): string | null {
  return timerKey;
}

function set(tk: string): void {
  timerKey = tk;
  localStorage.setItem(ID, tk);
}

export const Timer = {
  get,
  set,
};
