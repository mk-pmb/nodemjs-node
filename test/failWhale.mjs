#!/usr/bin/env nodemjs
// -*- coding: utf-8, tab-width: 2 -*-

import 'p-fatal';

async function failWhale() {
  const [, , ...args] = process.argv;
  throw new Error(args.join(' ') || '☠');
}

failWhale();
