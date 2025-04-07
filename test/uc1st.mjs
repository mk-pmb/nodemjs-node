#!/usr/bin/env nodemjs
// -*- coding: utf-8, tab-width: 2 -*-

import uc1st from 'lodash.upperfirst';

import demo from './uc1st.demo.mjs';


async function main(...input) {
  if (!input.length) { return main(...demo.dummyInput); }
  const prs = input.map(async s => uc1st(s));
  const arr = await Promise.all(prs);
  console.log('uc1st:', arr);
}

export default { nodemjsCliMain: main };
