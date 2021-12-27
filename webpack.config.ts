import { resolve, parse } from 'path';
import { readdir } from 'fs/promises';
import { Compilation, Compiler, Configuration, DefinePlugin, EntryObject, sources } from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';

import { config as loadEnv } from 'dotenv';

loadEnv();

function createEntries() {
  return async () => {
    const files = await readdir('./src/content/');

    return files.reduce((entries, file) => {
      const { name } = parse(file);
      entries[name] = `./src/content/${file}`;
      return entries;
    }, {} as EntryObject);
  };
}

class ContentScriptPlugin {
  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap('ContentScriptPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'ContentScriptPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        () => {
          compilation.getAssets().forEach(({ name, source }) => {
            if (name.endsWith('.content.js')) {
              const old = source.source().toString();

              compilation.updateAsset(
                name,
                new sources.ConcatSource(
                  'const iife = `(${',
                  old.slice(1, -4),
                  "})()`;const scr=document.createElement('script');scr.type='text/javascript';scr.textContent=iife;(document.head ?? document.documentElement).appendChild(scr);"
                )
              );
            }
          });
        }
      );
    });
  }
}

const buildDir = resolve(__dirname, 'build');

const webpackConfig: Configuration = {
  mode: 'production',
  entry: createEntries(),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    path: buildDir,
    filename: '[name].content.js',
    clean: true,
  },
  plugins: [
    new DefinePlugin({
      __API_KEY__: JSON.stringify(process.env.__API_KEY__),
      __EXTENSION_KEY__: JSON.stringify(process.env.__EXTENSION_KEY__),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/static/manifest.json',
          to: buildDir,
          transform(content) {
            const manifestContent = content.toString('utf8');

            return Buffer.from(
              manifestContent
                .replace('__CUTCHA_SITE__', process.env.__CUTCHA_SITE__ ?? '')
                .replace('__FC_SITE__', process.env.__FC_SITE__ ?? ''),
              'utf8'
            );
          },
        },
      ],
    }),
    new ContentScriptPlugin(),
  ],
};

export default webpackConfig;
