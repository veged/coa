# Changelog

## 4.0.0

### Breaking Changes

- **Node.js >= 20 required** — dropped support for older Node.js versions
- **Removed Q dependency** — all promises are now native `Promise`
- **Removed mocha/chai/nyc** — tests use native `node:test` and `node:assert/strict`

### Modernization

- Replaced `.hasOwnProperty()` with `Object.hasOwn()`
- Replaced `arguments` object with rest/spread parameters
- Replaced `require('util').format` with template literals
- Replaced `.substr()` with `.slice()`
- Replaced callback-based `fs.readFile` with `async`/`await` and `fs/promises`
- Replaced `var` with `const` throughout
- Added optional catch binding (`catch {}`)
- Added `'use strict'` to all files
- DRY: extracted shared `_saveVal()` to `CoaParam` base class

### Bug Fixes

- Fixed `completion.js`: `complete()` received `undefined` instead of `getOpts()` result
- Fixed `invoke()` argument juggling order
- Fixed type definitions: `Arg`/`Opt` as `export function`, `api` as `readonly`, `val()` returns `any`

### Tests

- Migrated from mocha/chai to native `node:test` runner
- Coverage: 95% lines, 96% branches, 95% functions
- Reduced devDependencies from 272 to 75 packages

### Documentation

- Removed dead CI badges (Travis, AppVeyor, Coveralls, David)
- Updated Q promise references to native Promise
