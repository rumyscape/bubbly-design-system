import { mkdir, copyFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const workspaceRoot = resolve(root, '..', '..');
const tokensCssPath = resolve(root, '..', 'design-tokens', 'build', 'css', 'tokens.css');
const distDir = resolve(root, 'dist');
const distFile = resolve(distDir, 'tokens.css');

async function run(command, args, options = {}) {
  await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    });
    child.on('close', code => {
      if (code === 0) {
        resolvePromise();
      } else {
        rejectPromise(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function buildDesignTokens() {
  await run('pnpm', ['--filter', '@bubbly-design-system/design-tokens', 'build'], {
    cwd: workspaceRoot,
  });
}

async function ensureTokensBuilt() {
  try {
    await stat(tokensCssPath);
  } catch {
    console.log('tokens.css not found, building design tokens first...');
    await buildDesignTokens();
    await stat(tokensCssPath);
  }
}

async function build() {
  await ensureTokensBuilt();
  await mkdir(distDir, { recursive: true });
  await copyFile(tokensCssPath, distFile);
  console.log(`Copied tokens CSS to ${distFile}`);
}

build().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
