/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

const pathLib = require('path');

const makeEsmRqr = require('esmod-pmb');

const meta = require('./meta.js');

const loaderArgs = (function parseLoaderArgs() {
  const pa = process.argv;
  const idx = pa.indexOf(':')
  if (idx < 0) { throw new Error('Invocation failure: missing arg ":"'); }

  const evicted = pa.splice(1, idx); /* Modify process.argv inplace in order
    to evict [loaderFileName, ...loaderArgs, colon]. */
  evicted.shift(); // Discard the loaderFileName.
  evicted.pop(); // Discard the colon.

  meta.mainPath = (pa[1] || null);
  meta.cliArgs = pa.slice(2);
  meta.invokedAs = process.argv0;

  if (meta.mainPath) {
    meta.mainPath = pathLib.resolve(meta.mainPath);
    pa[1] = meta.mainPath;
  }
  return evicted;
}());

const esmRqr = makeEsmRqr(module, { reexport: false });
meta.esmRqr = esmRqr;
meta.process = process;

(function envPreload() {
  const pre = process.env.NODEMJS_PRELOAD;
  if (!pre) { return; }
  pre.match(/\S+/g).forEach(esmRqr);
}());

const stage2 = esmRqr('./src/stage2.mjs').default;

function rethrowSoon(err) {
  // Define function separate from setImmediate to keep the code snippet
  // in node.js's error message simple and minimalistic.
  function rethrowNow() { throw err; }
  setImmediate(rethrowNow);
}
stage2(require, loaderArgs).then(null, rethrowSoon);
