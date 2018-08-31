/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

function findImportErrorLegacyPath(err) {
  if (!err) { return false; }
  if (err.code !== 'ERR_MODULE_RESOLUTION_LEGACY') { return false; }
  return (String(err).split(/ would have found it at /)[1] || false);
}

module.exports = findImportErrorLegacyPath;
