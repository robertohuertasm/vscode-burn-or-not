// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'node:path';
import { spawn, exec } from 'node:child_process';
import * as util from 'node:util';

const execPromise = util.promisify(exec);

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "burn-or-not" is now active!');
  vscode.window.showInformationMessage('Burn or not is active!');

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'burn-or-not.helloWorld',
      () => {
        vscode.window.showInformationMessage('Hello World from burn-or-not!');
        executeBinary();
      },
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

function isDebugMode(): boolean {
  return process.env.VSCODE_DEBUG_MODE === 'true';
}

function executeBinary() {
  const bin = getBurnBinaryPath();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const p = spawn(bin, { env: { NAME: 'burn-or-not' } });

  p.stdout.on('data', (data: any) => {
    console.log(`Burn logs: ${data}`);
  });

  p.on('close', (code: any) => {
    console.log(`Binary process exited with code ${code}`);
  });
}


function getBurnBinaryPath(): string {
  const platform = process.platform;
  const binName = platform === 'win32' ? 'random-binary.exe' : 'random-binary';

  if (isDebugMode()) {
    return path.join(
      __dirname,
      '..',
      'random-binary',
      'target',
      'release',
      binName,
    );
  } else {
    let prodPath = path.join(__dirname, '..', 'bins', 'burn');
    if (platform === 'darwin') {
      prodPath = path.join(prodPath, 'mac');
    }
    return path.join(prodPath, binName);
  }
}
