#!/usr/bin/env nodemjs
// -*- coding: utf-8, tab-width: 2 -*-

import importWithLegacyFallback from '../src/importWithLegacyFallback';

async function main() {
  const [, , libSpec, funcName, ...args] = process.argv;
  if (!libSpec) {
    throw new Error('dynamicMap: no library spec given!');
  }
  let lib;
  try {
    lib = (await importWithLegacyFallback(libSpec)).default;
  } catch (err) {
    console.error('dynamicMap: import failed for:', libSpec);
    throw err;
  }
  const func = (funcName ? lib[funcName] : lib);
  console.dir(args.map(func));
}

main();
