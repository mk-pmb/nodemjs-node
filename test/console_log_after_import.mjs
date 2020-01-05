// -*- coding: utf-8, tab-width: 2 -*-

// import urlLib from 'url';

console.log(process.pid);
setTimeout(String, 5e4);

console.log(11);
console.log({ foo: 'bar' });
// ^-- 2019-03-13: Fails with
//    > TypeError: Cannot read property 'options' of null
//    >     at formatValue (util.js:399:38)
//    >     at inspect (util.js:293:10)
//    >     at format (util.js:160:12)
//    >     at Object.log (console.js:130:21)
//    when using esm@3.2.12 … esm@3.2.16
//    upstream issue: https://github.com/standard-things/esm/issues/748

console.log(22);

String('ignore', typeof urlLib);
