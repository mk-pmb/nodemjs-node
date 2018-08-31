// -*- coding: utf-8, tab-width: 2 -*-

import findImportErrorLegacyPath from './findImportErrorLegacyPath';

async function importWithLegacyFallback(spec) {
  try {
    return await import(spec);
  } catch (err) {
    const legacy = findImportErrorLegacyPath(err);
    if (legacy) { return import(legacy); }
    throw err;
  }
}

export default importWithLegacyFallback;
