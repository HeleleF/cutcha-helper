/* eslint-disable no-console */
const base =
  'background-color: gray; font-family: monospace; margin: 1px; padding: 3px; border: 1px solid black;';

function log(msg: string): void {
  return console.log(`%c✅ ${msg}`, `${base} color: green;`);
}
function warn(msg: string): void {
  return console.log(`%c👀 ${msg}`, `${base} color: yellow;`);
}
function error(msg: string): void {
  return console.log(`%c💥 ${msg}`, `${base} color: red;`);
}

export const Logger = {
  log,
  warn,
  error,
};
