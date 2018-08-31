/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var findImportErrorLegacyPath = require('./findImportErrorLegacyPath');


function handleLoaderArgs(args, esmRqr) {

  function legacyFallbackRequire(spec) {
    var legacyPath;
    try {
      return esmRqr(spec);
    } catch (err) {
      legacyPath = findImportErrorLegacyPath(err);
      if (legacyPath) { return esmRqr(legacyPath); }
      throw err;
    }
  }

  args.forEach(function (arg) {
    if (arg.startsWith('r:')) { return legacyFallbackRequire(arg.slice(2)); }
    throw new Error('Unsupported loader argument: ' + arg);
  });
}




module.exports = handleLoaderArgs;
