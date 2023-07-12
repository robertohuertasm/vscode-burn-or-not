// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'node:path';
const { spawn } = require('node:child_process');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "burn-or-not" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'burn-or-not.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World from burn-or-not!');
      executeBinary();
    },
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function isDebugMode(): boolean {
  return process.env.VSCODE_DEBUG_MODE === 'true';
}

function getBinaryPath(): string {
  const platform = process.platform;
  const binName = platform === 'win32' ? 'random-binary.exe' : 'random-binary';

  if (isDebugMode()) {
    return path.join(
      __dirname,
      '..',
      'random-binary',
      'target',
      'debug',
      binName,
    );
  } else {
    let prodPath = path.join(__dirname, '..', 'bins');
    if (platform === 'darwin') {
      prodPath = path.join(prodPath, 'mac');
    }
    return path.join(prodPath, binName);
  }
}

function executeBinary() {
  const bin = getBinaryPath();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const p = spawn(bin, { env: { NAME: 'burn-or-not' } });

  p.stdout.on('data', (data: any) => {
    console.log(`stdout: ${data}`);
  });

  p.on('close', (code: any) => {
    console.log(`child process exited with code ${code}`);
  });
}
