/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var mjsFile, mjsMod, loaderArgs,
  pathLib = require('path'),
  meta = require('./meta'),
  esmRqr, stage2;

(function parseLoaderArgs() {
  var pa = process.argv, idx = pa.indexOf(':');
  if (idx < 0) { throw new Error('Invocation failure: missing arg ":"'); }
  loaderArgs = pa.splice(1, idx).slice(1, -1);
  mjsFile = (pa[1] || null);
  if (mjsFile) { mjsFile = pathLib.resolve(mjsFile); }
  pa[1] = mjsFile;
}());

esmRqr = require('esmod-pmb')(module, { reexport: false });
Object.assign(meta, {
  cliArgs: process.argv.slice(2),
  esmRqr: esmRqr,
  invokedAs: process.argv0,
  mainPath: mjsFile,
  process: process,
});

(function envPreload() {
  var pre = process.env.NODEMJS_PRELOAD;
  if (!pre) { return; }
  pre.match(/\S+/g).forEach(esmRqr);
}());

stage2 = esmRqr('./src/stage2').default;

function rethrowSoon(err) {
  function rethrowNow() { throw err; }
  setImmediate(rethrowNow);
}
stage2(require, loaderArgs, mjsFile).then(null, rethrowSoon);
