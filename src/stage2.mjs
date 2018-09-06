// -*- coding: utf-8, tab-width: 2 -*-

import repl from 'repl';
import pEachSeries from 'p-each-series';
import pEval from 'p-eval';

import importWithLegacyFallback from './importWithLegacyFallback';
import meta from '../meta';


function startRepl() {
  const r = repl.start();
  Object.assign(r.context, {
    import: importWithLegacyFallback,
    imp0rt: importWithLegacyFallback,
    require: meta.esmRqr,
  });
}

async function stage2(loaderArgs, mjsFile) {
  await pEachSeries(loaderArgs, stage2.handleLoaderArg);
  if (mjsFile === null) { return startRepl(); }
  if (mjsFile === undefined) { return startRepl(); }

  const mainMod = await importWithLegacyFallback(mjsFile);
  const cliMain = (mainMod.nodemjsCliMain || mainMod.default.nodemjsCliMain);
  if (typeof cliMain === 'function') {
    return cliMain.apply(meta, meta.cliArgs);
  }
}

const colonCmds = {
  r(spec) { return importWithLegacyFallback(spec); },
  e: pEval,
  async p(code) { console.dir(await pEval(code)); },
};

stage2.handleLoaderArg = (arg) => {
  const colon = /^(\w+):/.exec(arg);
  if (colon) {
    const [, cmd] = colon;
    const param = arg.slice(colon[0].length);
    const func = colonCmds[cmd];
    if (func) { return func(param); }
  }
  throw new Error('Unsupported loader argument: ' + arg);
};


export default stage2;
