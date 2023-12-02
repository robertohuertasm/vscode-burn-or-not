# burn-or-not README

This is a test extension. Don't install it.

## Utils

In order to create big binaries, use [fastest.fish](https://fastest.fish/generate-file)


## Test in Linux

Check this [VS Code documentation](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).

First start the process:

```bash
/usr/bin/Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 & echo ">>> Started xvfb"
```

Then run the tests with the following environment variable:

`DISPLAY=':99.0' npm run test`

We can also add this env variable to wherever we need to. For instance, in the `.vscode-test.mjs` file:
  
  ```js
import { defineConfig } from '@vscode/test-cli';

export default defineConfig([
  {
    env: {
      DISPLAY: ':99.0',
    },
    // Required: Glob of files to load (can be an array and include absolute paths).
    files: 'out/test/**/*.test.js',
    mocha: {
      timeout: 20000,
    },
  }
]);

  ```
