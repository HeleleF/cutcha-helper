# Cutcha Helper extension
This extensions was created to do two things.

Most importantly, if a fc site has a cutcha on it, it will be bypassed 😎.

If the bypass failed, the extension prevents having to wait for multiple countdown timer. So instead of having to wait for each cutcha to load, you only would need to wait once. 

Additionally, if you solve a cutcha correctly, the solution will be sent to the cutcha database, which in turn increases the possibility for cutchas to be bypassed. 😉

Also, I was able to learn more about webpack and its plugin system with this project. 👌

### How to build

1. Clone repo
2. Copy `.example.env` to `.env` and set necessary secrets
3. `npm i` to install dependencies
4. `npm run build` to create the extension bundle

### Use extension in chrome

1. Go to `chrome://extensions/`
2. Check the checkbox in upper-right corner
3. Click "Load unpacked extension" in top-left corner
4. Choose the `build` directory created by the build step above
5. ???
6. Profit 🚀

### Why are there secrets?

I assume that you know what to enter for the two urls, otherwise you probably would not be here. 🧐

The keys are needed to talk to the cutcha api. ✌

As solved cutchas will be stored without extra validation in the cutcha db, the server needs to be
able to "trust" the source that the solution was indeed correct. 👀 Therefore, the `EXTENSION_KEY` needs to be specified. 

The `API_KEY` is used to control the access to the token endpoint, which generates valid tokens used for bypassing the cutcha.

For their usage on the backend side, see the backend directory of the [cutcha repository](https://github.com/HeleleF/cutchas).

### Structure

The extension is written in normal typescript.
[Webpack](https://webpack.js.org/guides/getting-started) is used to bundle everything into javascript.

[Eslint](https://eslint.org/docs/user-guide/getting-started) and [prettier](https://prettier.io/docs/en/index.html) are used for consistency (works nice with the corresponding VS Code extensions).

If you were to add another content script, following steps would need to be done:
1. Create a new `.ts` file under `src/content`
2. If you depend on `.env` secrets, declare them in `env.d.ts` and add them to the `DEFINE_PLUGIN`.
3. Adapt the manifest in `src/static` to specify where (and when) your script should run
4. Rebuild and reload in chrome

Webpack will automatically create a javascript file for each `.ts` file in `src/content`.

👀 **IMPORTANT**: The javascript content is wrapped in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and put inside a script tag. See [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#content_script_environment) why this is necessary.

To achieve this, a custom webpack plugin is used. (I was not able to find a better way, but it works for me, so...🤷‍♂️)

The clean typescript is included in `src/inject.ts`. The main takeaway is: you dont have to do it yourself, as its guaranteed that everything inside of src/content will run in the browser context.

### Tests

As usual, there are no tests. 😢

