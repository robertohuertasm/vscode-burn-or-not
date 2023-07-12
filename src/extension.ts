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

  context.subscriptions.push(
    disposable,
    vscode.commands.registerCommand('burn-or-not.staticAnalysis', () => {
      startStaticServer();
    }),
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

async function startStaticServer(): Promise<void> {
  const bin = await getStaticBinaryPath('datadog-static-analyzer-server');

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const p = spawn(bin, { env: { ROCKET_PORT: '9999' } });

  p.stdout.on('data', (data: any) => {
    console.log(`Server logs: ${data}`);
  });

  p.on('close', (code: any) => {
    console.log(`Server process exited with code ${code}`);
  });
}

async function getStaticBinaryPath(name: string): Promise<string> {
  const platform = process.platform;
  const binName = platform === 'win32' ? `${name}.exe` : name;

  let prodPath = path.join(__dirname, '..', 'bins', 'static');
  if (platform === 'darwin') {
    prodPath = path.join(prodPath, 'mac');
    // we have to give permissions to this binary
    // xattr -dr com.apple.quarantine datadog-static-analyzer
    const { stdout, stderr } = await execPromise(
      `"xattr" -dr com.apple.quarantine ${path.join(prodPath, binName)}`,
    );
    console.log('xattr log:', stdout);
    console.error('xattr err:', stderr);
  }
  return path.join(prodPath, binName);
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
