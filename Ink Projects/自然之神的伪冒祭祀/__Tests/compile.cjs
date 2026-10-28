'use strict';

const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENTRY_PATH = path.join(PROJECT_ROOT, '自然之神的伪冒祭祀.ink');

function loadInkjsFull() {
  const candidates = ['inkjs/full'];
  const installed = path.join(__dirname, 'node_modules', 'inkjs', 'dist', 'ink-full.js');
  candidates.push(installed);

  const failures = [];
  for (const candidate of candidates) {
    try {
      const entryFile = require.resolve(candidate);
      const inkjs = require(entryFile);
      if (
        typeof inkjs.Compiler !== 'function' ||
        typeof inkjs.CompilerOptions !== 'function' ||
        typeof inkjs.Story !== 'function'
      ) {
        failures.push(`${candidate}: resolved to ${entryFile} but Compiler/CompilerOptions/Story are missing`);
        continue;
      }
      const root = path.dirname(path.dirname(entryFile));
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      return { inkjs, root, entryFile, version: pkg.version };
    } catch (error) {
      failures.push(`${candidate}: ${error.message}`);
    }
  }

  // The package "exports" map does not expose ./dist/* here, so require('inkjs/dist/ink-full.js')
  // fails even though the file exists; loading is resolved from 'inkjs/full' / an absolute path.
  throw new Error(`Unable to load the inkjs compiler/runtime.\n${failures.join('\n')}`);
}

function compileStory({ entry = ENTRY_PATH, root = PROJECT_ROOT } = {}) {
  const { inkjs, root: inkjsRoot, entryFile, version } = loadInkjsFull();
  const { PosixFileHandler } = require(path.join(inkjsRoot, 'compiler', 'FileHandler', 'PosixFileHandler.js'));

  const source = fs.readFileSync(entry, 'utf8');
  const options = new inkjs.CompilerOptions();
  options.sourceFilename = path.relative(root, entry);
  options.fileHandler = new PosixFileHandler(root);

  const compiler = new inkjs.Compiler(source, options);
  let story = null;
  let thrown = null;
  try {
    story = compiler.Compile();
  } catch (error) {
    thrown = error;
  }

  const errors = compiler.errors.map(String);
  const warnings = compiler.warnings.map(String);
  const authorMessages = compiler.authorMessages.map(String);
  const json = errors.length === 0 && story ? story.ToJson() : null;

  return {
    inkjs,
    inkjsRoot,
    inkjsVersion: version,
    inkjsEntryFile: entryFile,
    entryPath: entry,
    compiler,
    story,
    json,
    jsonBytes: json === null ? 0 : Buffer.byteLength(json, 'utf8'),
    errors,
    warnings,
    authorMessages,
    thrown,
    ok: errors.length === 0 && json !== null,
  };
}

function report(result) {
  const lines = [];
  lines.push(`inkjs ${result.inkjsVersion} (${result.inkjsEntryFile})`);
  lines.push(`entry: ${result.entryPath}`);
  lines.push(`compile: ${result.ok ? 'OK' : 'FAILED'}`);
  if (result.ok) {
    lines.push(`json bytes: ${result.jsonBytes}`);
  } else if (result.thrown) {
    lines.push(`compiler exception: ${result.thrown.message}`);
  }
  lines.push(`errors: ${result.errors.length}`);
  for (const message of result.errors) lines.push(`  ERROR: ${message}`);
  lines.push(`warnings: ${result.warnings.length}`);
  for (const message of result.warnings) lines.push(`  WARNING: ${message}`);
  lines.push(`author diagnostics (TODO): ${result.authorMessages.length}`);
  for (const message of result.authorMessages) lines.push(`  ${message}`);
  return lines.join('\n');
}

if (require.main === module) {
  const entry = process.argv[2] ? path.resolve(process.argv[2]) : ENTRY_PATH;
  const result = compileStory({ entry });
  console.log(report(result));
  process.exit(result.ok ? 0 : 1);
}

module.exports = {
  PROJECT_ROOT,
  ENTRY_PATH,
  loadInkjsFull,
  compileStory,
  report,
};
