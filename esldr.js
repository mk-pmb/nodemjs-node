/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var mjsFile, mjsMod, loaderArgs, pathLib = require('path'), esmRqr, imported;

(function parseLoaderArgs() {
  var pa = process.argv, idx = pa.indexOf(':');
  if (idx < 0) { throw new Error('Invocation failure: missing arg ":"'); }
  loaderArgs = pa.splice(1, idx).slice(1, -1);
  mjsFile = pathLib.resolve(pa[1]);
  pa[1] = mjsFile;
}());
esmRqr = require('esmod-pmb')(module, { reexport: false });

(function envPreload() {
  var pre = process.env.NODEMJS_PRELOAD;
  if (!pre) { return; }
  pre.match(/\S+/g).forEach(esmRqr);
}());

require('./src/ld-args.js')(loaderArgs, esmRqr);
esmRqr(mjsFile);
