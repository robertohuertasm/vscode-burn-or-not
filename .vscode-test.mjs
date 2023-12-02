import { defineConfig } from '@vscode/test-cli';

export default defineConfig([
  {
    env: {
      DISPLAY: ':99.0',
    },
    // Required: Glob of files to load (can be an array and include absolute paths).
    files: 'out/test/**/*.test.js',
    // Optional: Version to use, same as the API above, defaults to stable
    // version: 'insiders',
    // Optional: Root path of your extension, same as the API above, defaults
    // to the directory this config file is in
    // extensionDevelopmentPath: __dirname,
    // Optional: sample workspace to open
    // workspaceFolder: `${__dirname}/sampleWorkspace`,
    // Optional: additional mocha options to use:
    mocha: {
      // preload: `./out/test-utils.js`,
      timeout: 20000,
    },
  },
  // you can specify additional test configurations if necessary
]);
