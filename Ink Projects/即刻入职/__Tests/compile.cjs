'use strict';

const fs = require('fs');
const path = require('path');
const { Compiler } = require('inkjs/compiler/Compiler');
const { CompilerOptions } = require('inkjs/compiler/CompilerOptions');

const ENTRY = path.resolve(__dirname, '..', '即刻入职.ink');
const EXPECTED_INCLUDE_COUNT = 47;

function readIncludeTargets(file) {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*INCLUDE\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match) => match[1]);
}

function compileStory() {
  const entryDir = path.dirname(ENTRY);
  const includeTargets = readIncludeTargets(ENTRY);
  const missingFiles = includeTargets
    .map((target) => path.resolve(entryDir, target))
    .filter((file) => !fs.existsSync(file));

  const resolvedFiles = [];
  const fileHandler = {
    ResolveInkFilename(filename, sourceFilename) {
      const baseDir = sourceFilename ? path.dirname(sourceFilename) : entryDir;
      const fullPath = path.resolve(baseDir, filename);
      if (fullPath !== ENTRY) resolvedFiles.push(fullPath);
      return fullPath;
    },
    LoadInkFileContents(filename) {
      return fs.readFileSync(filename, 'utf8');
    },
  };

  const compiler = new Compiler(
    fs.readFileSync(ENTRY, 'utf8'),
    new CompilerOptions(ENTRY, [], false, null, fileHandler),
  );

  let json = null;
  let thrown = null;
  try {
    json = compiler.Compile().ToJson();
  } catch (error) {
    thrown = error;
  }

  const errors = compiler.errors.slice();
  if (thrown) errors.push(thrown.message);

  const uniqueResolved = [...new Set(resolvedFiles)];
  const includesOk =
    includeTargets.length === EXPECTED_INCLUDE_COUNT &&
    missingFiles.length === 0 &&
    uniqueResolved.length === EXPECTED_INCLUDE_COUNT &&
    resolvedFiles.length === EXPECTED_INCLUDE_COUNT;

  return {
    json,
    errors,
    warnings: compiler.warnings.slice(),
    includeTargets,
    missingFiles,
    resolvedFiles: uniqueResolved,
    includesOk,
  };
}

function isOk(result) {
  return result.includesOk && result.errors.length === 0 && result.warnings.length === 0;
}

function printReport(result) {
  const lines = [
    '即刻入职 / compile',
    `  entry               ${path.relative(process.cwd(), ENTRY)}`,
    `  INCLUDE statements  ${result.includeTargets.length} (expected ${EXPECTED_INCLUDE_COUNT})`,
    `  INCLUDE resolved    ${result.resolvedFiles.length}/${result.includeTargets.length}`,
    `  errors              ${result.errors.length}`,
    `  warnings            ${result.warnings.length}`,
    `  result              ${isOk(result) ? 'OK' : 'FAILED'}`,
  ];

  for (const file of result.missingFiles) {
    lines.push(`  missing file        ${path.relative(process.cwd(), file)}`);
  }
  for (const error of result.errors) {
    lines.push(`  error               ${error.replace(/\n/g, '\n                      ')}`);
  }
  for (const warning of result.warnings) {
    lines.push(`  warning             ${warning.replace(/\n/g, '\n                      ')}`);
  }

  console.log(lines.join('\n'));
}

module.exports = {
  ENTRY,
  EXPECTED_INCLUDE_COUNT,
  compileStory,
  isOk,
  printReport,
};

if (require.main === module) {
  const result = compileStory();
  printReport(result);
  if (!isOk(result)) process.exitCode = 1;
}
