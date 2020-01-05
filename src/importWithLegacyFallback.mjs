// -*- coding: utf-8, tab-width: 2 -*-

import findImportErrorLegacyPath from './findImportErrorLegacyPath';

function makeImporter() {
  const imp = async function importWithLegacyFallback(spec) {
    try {
      return await import(spec);
    } catch (err) {
      const legDetect = findImportErrorLegacyPath(err);
      if (legDetect) {
        const legVerify = imp.legacyResolve(spec);
        if (legDetect === legVerify) {
          // the import failure was for spec itself
          return import(legDetect);
        }
        err.message = `Submodule import error while trying to import ${
          spec}: ${err.message}`;
      }
      const origMsg = String(err.message || '');
      if (origMsg.startsWith('Cannot load module from .mjs:')) {
        if (origMsg.endsWith('.js')) {
          err.message += ' (Should that file be named *.mjs?)';
        }
      }
      err.stack += '\n' + (new Error('via nodemjs import failure')).stack;
      throw err;
    }
  };
  return imp;
}

export default makeImporter;
