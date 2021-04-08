Set project references for TypeScript
=====================================

[![Project is](https://img.shields.io/badge/Project%20is-fantastic-ff69b4.svg)](https://github.com/Bessonov/set-project-references)
[![Build Status](https://api.travis-ci.org/Bessonov/set-project-references.svg?branch=master)](https://travis-ci.org/Bessonov/set-project-references)
[![License](http://img.shields.io/:license-MIT-blue.svg)](https://raw.githubusercontent.com/Bessonov/set-project-references/master/LICENSE)

This cli module try to resolve the problem of syncing [TypeScript project references](https://www.typescriptlang.org/docs/handbook/project-references.html) with local modules in a monorepo.

Set project references supports following monorepos:
- [pnpm workspaces](https://pnpm.js.org/en/workspaces)

Support for [yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) was removed due rewrite in version 0.0.4. Try [workspaces-to-typescript-project-references](https://github.com/azu/monorepo-utils/tree/master/packages/@monorepo-utils/workspaces-to-typescript-project-references) instead.


Installation
------------

You can run it without an installation:
```bash
pnpx @bessonovs/set-project-references
npx @bessonovs/set-project-references
```

Or install with one of your favourite package manager:

```bash
pnpm install -g @bessonovs/set-project-references
npm install -g @bessonovs/set-project-references
yarn global add @bessonovs/set-project-references
```

Usage
-----
```bash
# show help
set-project-references -h

# show current state
set-project-references
# save changes
set-project-references --save
# change project root
set-project-references --root mypath/
```

Or add it as shortcut:
```json
"scripts": {
  "spr": "set-project-references",
  "postinstall": "set-project-references --save",
  "postuninstall": "set-project-references --save"
},
```

Then you can run it with:
```bash
pnpm run spr
yarn spr
```

ToDo
----
Currently, it's an alpha version. It's missing:
- Tests
- Access through API

License
-------

The MIT License (MIT)

Copyright (c) 2019, Anton Bessonov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.