// -*- coding: utf-8, tab-width: 2 -*-

import repl from 'repl';
import pEachSeries from 'p-each-series-cjs';
import pEval from 'p-eval';

import makeImporterWithLegacyFallback from './importWithLegacyFallback';
import meta from '../meta';


const importWithLegacyFallback = makeImporterWithLegacyFallback();


function startRepl() {
  const r = repl.start();
  Object.assign(r.context, {
    import: importWithLegacyFallback,
    imp0rt: importWithLegacyFallback,
    require: meta.esmRqr,
  });
}

async function stage2(legacyRequire, loaderArgs, mjsFile) {
  importWithLegacyFallback.legacyResolve = legacyRequire.resolve;
  await pEachSeries(loaderArgs, stage2.handleLoaderArg);
  if (mjsFile === null) { return startRepl(); }
  if (mjsFile === undefined) { return startRepl(); }

  const mainMod = await importWithLegacyFallback(mjsFile);
  const mainProp = 'nodemjsCliMain';
  const cliMain = (mainMod[mainProp]
    || (mainMod.default || false)[mainProp]);
  if (typeof cliMain === 'function') {
    try {
      return await cliMain.apply(meta, meta.cliArgs);
    } catch (err) {
      setImmediate(() => { throw err; });
    }
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
