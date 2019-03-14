
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


Setup
-----

1. `npm install --global nodemjs`
1. Make sure you have a node.js (compatible) binary available as the
   `nodejs` command. If you use sane package sources, you probably do.
   If you don't, just make a symlink `nodejs` to `node` or whatever
   it's called on your system.
   <br><small>(If you'd like to argue the supremacy of the more generic `node`
   command name, file an issue, ideally after you've renamed the
   Node.js foundation to Node foundation.)</small>
   <br><small>As of 0.1.7, you can configure your favorite `nodejs` replacement
   via the `NODEJS_CMD` env var.</small>



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

* __REPL:__
  The REPL isn't upgraded to ESM because `esm` currently
  [cannot expose its REPL in a clean and easy way][esm-issue-592].

* The `invokedAs` context property for `nodemjsCliMain` doesn't work.

* Needs more/better __tests and docs__.




&nbsp;

  [esm-issue-592]: https://github.com/standard-things/esm/issues/592


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
