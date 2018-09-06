#!/usr/bin/env nodemjs
// -*- coding: utf-8, tab-width: 2 -*-

import uc1st from 'lodash.upperfirst';

async function main(...input) {
  if (!input.length) {
    const demo = 'using dummy input because there were no CLI args';
    return main(...demo.match(/\S+(?:\s+\S+){0,2}/g));
  }
  const prs = input.map(async s => uc1st(s));
  const arr = await Promise.all(prs);
  console.log('uc1st:', arr);
}

export default { nodemjsCliMain: main };
