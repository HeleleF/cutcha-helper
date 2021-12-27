/**
 * Injects given function into the page, allowing it to
 * "escape" the extension sandbox. Without this, it would
 * not be possible to manipulate the page.
 *
 * Note that `inlineFunction` can not reference any variables etc
 * outside of its body, e.g. in the following example, `nope` is undefined when the script
 * runs. Typescript will not complain (even when compiling), since it does
 * not know the function will run in another context (the browser).
 *
 * ```ts
 * const nope = "extension scope";
 *
 * injectScript(() => {
 *  // ✅
 *  const sure = "browser scope";
 *  console.log(sure);
 *
 *  // ❌
 *  console.log(nope);
 *
 *  // ✅
 *  const okay = window.PAGE_GLOBAL;
 *  console.log(okay);
 * });
 * ```
 */
export function injectScript(inlineFunction: () => void): void {
  const iife = `(${inlineFunction.toString()})();`;

  const scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.textContent = iife;
  (document.head ?? document.documentElement).appendChild(scr);
}
