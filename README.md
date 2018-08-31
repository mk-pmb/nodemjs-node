
<!--#echo json="package.json" key="name" underline="=" -->
nodemjs
=======
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Run .mjs files from your command line, with all the tweaks from esmod-pmb.
<!--/#echo -->

Added features:

* Legacy-resolves module names passed with `-r` if they would otherwise
  yield the `ERR_MODULE_RESOLUTION_LEGACY` error.
* Pre-imports all modules listed in env var `NODEMJS_PRELOAD` and
  npm setting `nodemjs-preload` (see caveats below).
  Multiple module specs can be separated with spaces.
  They will be loaded even before the `-r` pre-imports.



API
---

No.



CLI
---

```text
$ nodemjs test/uc1st.mjs
{ scriptFile: '/mnt/…/nodemjs/test/uc1st.mjs' }
uc1st: [ 'Using dummy input', 'Because there were', 'No CLI args' ]

$ ./test/uc1st.mjs foo bar qux
{ scriptFile: '/mnt/…/nodemjs/test/uc1st.mjs' }
uc1st: [ 'Foo', 'Bar', 'Qux' ]

$ ./test/dynamicMap.mjs rot-13 '' foo bar qux ; echo rv=$?
dynamicMap: import failed for: rot-13
(node:11549) UnhandledPromiseRejectionWarning: Error: Cannot find module 'rot-13'
    at […]
(node:11549) [DEP0018] DeprecationWarning: Unhandled promise rejections are
    deprecated. In the future, promise rejections […] terminate […] Node.js […]
rv=0

# Fortunately, you can just pre-import the future with -r:
$ nodemjs -r p-fatal test/dynamicMap.mjs rot-13 '' foo bar qux ; echo rv=$?
dynamicMap: import failed for: rot-13
Error: Cannot find module 'rot-13'
    at […]
rv=1

# … or via the env var:
$ export NODEMJS_PRELOAD='p-fatal'
$ ./test/dynamicMap.mjs rot-13 '' foo bar qux ; echo rv=$?
dynamicMap: import failed for: rot-13
Error: Cannot find module 'rot-13'
    at […]
rv=1

# and once you've installed it…
$ ./test/dynamicMap.mjs rot-13 '' foo bar qux
[ 'sbb', 'one', 'dhk' ]
```




<!--#toc stop="scan" -->



Known issues
------------

* Currently no support for setting __`process.mainModule`__, see the
  [upstream bug ticket](https://github.com/standard-things/esm/issues/320).

* __npm config caveat:__
  The `nodemjs-preload` npm setting
  is currently ignored if its value as a string is literally `undefined`.
  If you want to pre-load a module with that name and nothing else,
  put it in twice, with a space between.
  See also: Duplicate pre-imports.

* __Duplicate pre-imports:__
  `nodemjs` currently does not check whether a module you're trying to
  pre-import had already been imported before.
  Usually node's module cache voids all non-first import attempts
  per module, so this won't matter
  — unless you use cache-busting modules, in which case you're on your own.

* Needs more/better __tests and docs__.




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
