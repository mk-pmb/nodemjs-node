#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function all_tests_cli_init () {
  export LANG{,UAGE}=en_US.UTF-8  # make error messages search engine-friendly
  local SELFFILE="$(readlink -m -- "$BASH_SOURCE")"
  local SELFPATH="$(readlink -m -- "$BASH_SOURCE"/..)"
  cd -- "$SELFPATH" || return $?
  source -- lib_test.sh || return $?
  cd .. || return $?
  [ -n "$JS_INTERP" ] || JS_INTERP='nodemjs'
  libtest_test_sourced_file "$SELFFILE" || return $?
}


function testcase_uc1st_no_args () {
  $JS_INTERP test/uc1st.mjs
  #= uc1st: [ 'Using dummy input', 'Because there were', 'No CLI args' ]
}


function testcase_uc1st_with_args () {
  $JS_INTERP test/uc1st.mjs foo bar qux
  #= uc1st: [ 'Foo', 'Bar', 'Qux' ]
}


function testcase_dynamicmap_rot13 () {
  $JS_INTERP test/dynamicMap.mjs rot-13 '' foo bar qux ; echo rv=$?
  #= [ 'sbb', 'one', 'dhk' ]
  #= rv=0
}


function testcase_dynamicmap_rot14 () {
  # For packages not installed (or typo in args) we expect failure:
  $JS_INTERP test/dynamicMap.mjs rot-14 '' foo bar qux ; echo rv=$?
  #: dynamicMap: import failed for: rot-14
  #: Error: Cannot find module 'rot-14'
  #: Error: via nodemjs import failure
  #:   code: 'MODULE_NOT_FOUND',
  #: rv=1
}








all_tests_cli_init "$@"; exit $?
