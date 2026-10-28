#!/usr/bin/env python3
"""Compile and test with an installed Inky; all generated files stay temporary."""
import argparse
import json
from pathlib import Path
import shlex
import shutil
import struct
import subprocess
import sys
import tempfile


class Asar:
    """Read only explicitly requested packed files, without invoking Electron."""

    def __init__(self, archive):
        self.archive = archive
        self.size = archive.stat().st_size
        with archive.open('rb') as stream:
            prefix = stream.read(16)
            if len(prefix) != 16:
                raise ValueError('ASAR header is truncated')
            marker, header_size, pickle_size, json_size = struct.unpack('<4I', prefix)
            if (marker != 4 or header_size != pickle_size + 4
                    or not 0 < json_size <= pickle_size - 4
                    or pickle_size - 4 - json_size > 3
                    or header_size > 32 * 1024 * 1024
                    or 8 + header_size > self.size):
                raise ValueError('ASAR header sizes are invalid')
            self.data_start = 8 + header_size
            self.header = json.loads(stream.read(json_size).decode('utf-8'))
        if not isinstance(self.header, dict) or not isinstance(self.header.get('files'), dict):
            raise ValueError('ASAR file table is missing')

    def read(self, name, limit=10 * 1024 * 1024):
        entry = self.header
        for part in name.split('/'):
            if not part or part in ('.', '..'):
                raise ValueError('invalid ASAR entry path')
            entry = entry['files'][part]
        if not isinstance(entry, dict):
            raise ValueError(f'invalid ASAR file table entry: {name}')
        if 'link' in entry or entry.get('unpacked'):
            raise ValueError(f'expected a packed regular ASAR entry: {name}')
        size, offset = entry.get('size'), entry.get('offset')
        if (type(size) is not int or not 0 <= size <= limit
                or not isinstance(offset, str) or not offset.isdigit()):
            raise ValueError(f'invalid ASAR entry metadata: {name}')
        start = self.data_start + int(offset)
        if start + size > self.size:
            raise ValueError(f'ASAR entry exceeds archive: {name}')
        with self.archive.open('rb') as stream:
            stream.seek(start)
            content = stream.read(size)
        if len(content) != size:
            raise ValueError(f'truncated ASAR entry: {name}')
        return content


def run(command, cwd):
    print('+ ' + shlex.join([str(arg) for arg in command]), flush=True)
    result = subprocess.run([str(arg) for arg in command], cwd=cwd, check=False)
    print(f'Exit code: {result.returncode}', flush=True)
    return result.returncode


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inky', type=Path, default=Path('/Applications/Inky.app'),
                        help='installed Inky application (default: /Applications/Inky.app)')
    parser.add_argument('--node', default='node', help='Node.js executable name or path')
    args = parser.parse_args()
    node = shutil.which(args.node)
    if node is None:
        parser.error(f'Node.js executable not found: {args.node}')
    resources = args.inky.expanduser().resolve() / 'Contents' / 'Resources'
    archive_path = resources / 'app.asar'
    compiler_dir = resources / 'app.asar.unpacked' / 'main-process' / 'ink'
    compilers = [('native', compiler_dir / 'inklecate_mac'),
                 ('inkjs-compatible', compiler_dir / 'inkjs-compatible' / 'inklecate_mac')]
    for required in [archive_path] + [compiler for _, compiler in compilers]:
        if not required.is_file():
            parser.error(f'Inky installation file not found: {required}')
    project = Path(__file__).resolve().parent.parent
    story = project / f'{project.name}.ink'
    regression = Path(__file__).resolve().parent / 'regression.cjs'
    if not story.is_file() or not regression.is_file():
        parser.error('story entry or regression.cjs is missing beside this test directory')
    archive = Asar(archive_path)
    app = json.loads(archive.read('package.json', 1024 * 1024))
    runtime = json.loads(archive.read('node_modules/inkjs/package.json', 1024 * 1024))
    if not isinstance(app, dict) or not isinstance(runtime, dict) or runtime.get('name') != 'inkjs':
        raise ValueError('Inky or inkjs package metadata is invalid')
    print(f'Inky: {app.get("productName")} {app.get("version")} ({args.inky})', flush=True)
    print(f'Runtime package: {runtime.get("name")} {runtime.get("version")}', flush=True)
    print(f'Source: {story}', flush=True)
    for label, compiler in compilers:
        version_path = compiler.parent / 'version.txt'
        version = version_path.read_text().strip() if version_path.is_file() else '(version.txt absent)'
        print(f'Compiler {label}: {version}', flush=True)
    node_version = run([node, '--version'], project)
    if node_version:
        return node_version
    status = 0
    with tempfile.TemporaryDirectory(prefix='leihu-ink-regression-') as temporary:
        temporary = Path(temporary)
        runtime_path = temporary / 'ink.js'
        runtime_path.write_bytes(archive.read('node_modules/inkjs/dist/ink.js'))
        for label, compiler in compilers:
            output = temporary / f'{label}.json'
            compiled = run([compiler, '-o', output, story], project)
            if compiled:
                status = status or compiled
                continue
            tested = run([node, regression, output, runtime_path], project)
            status = status or tested
    print('Temporary compiler output and runtime copy removed.', flush=True)
    return status


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, ValueError, KeyError, TypeError) as error:
        print(f'Cannot run Ink regression: {error}', file=sys.stderr)
        sys.exit(1)
