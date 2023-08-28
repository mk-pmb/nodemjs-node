// -*- coding: utf-8, tab-width: 2 -*-

import repl from 'repl';
import pEachSeries from 'p-each-series-cjs';
import pEval from 'p-eval';

import makeImporterWithLegacyFallback from './importWithLegacyFallback';
import meta from '../meta';


const importWithLegacyFallback = makeImporterWithLegacyFallback();

const hadColonCmds = {};


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
  if ((mjsFile === null) || (mjsFile === undefined)) {
    if (hadColonCmds.e) { return; }
    if (hadColonCmds.p) { return; }
    return startRepl();
  }

  const mainMod = await importWithLegacyFallback(mjsFile);
  const mainProp = 'nodemjsCliMain';
  const cliMain = (mainMod[mainProp]
    || (mainMod.default || false)[mainProp]);
  if (typeof cliMain === 'function') {
    try {
      await cliMain.apply(meta, meta.cliArgs);
    } catch (err) {
      /* We delay the failure in order to allow node.js to still print any
        console.debug() output that might have been enqueued just before
        the error was thrown. Promises rejections are to be treated async
        anyway, so there should be no (additional) harm in delaying it
        a tiny bit further.
      */
      setImmediate(() => stage2.cliMainFailed(err));
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
    hadColonCmds[cmd] = true;
    const param = arg.slice(colon[0].length);
    const func = colonCmds[cmd];
    if (func) { return func(param); }
  }
  throw new Error('Unsupported loader argument: ' + arg);
};


stage2.cliMainFailed = (err) => {
  // throw err;
  /* ^-- Originally, we had just rethrown, but in Node.js v16, this would
    clutter the error log (and especially a terminal) with useless spam like

      [Symbol(originalCallSite)]: [
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {}
      ],
      [Symbol(mutatedCallSite)]: [
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {},
        CallSite {}
      ]

    I tried to
      delete err[Symbol.for('originalCallSite');
      delete err[Symbol.for('mutatedCallSite');
    but that had no effect.
    Thus, for now, we'll have to print and then exit forcefully:
  */

  console.error(err.stack);
  process.exit(2);
};


export default stage2;
