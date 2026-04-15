#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-

function libtest_test_sourced_file () {
  local FILE="$1"
  local TODO=( $(
    grep -oPe '^function testcase_\S+' -- "$FILE" | cut -d ' ' -sf 2-
    # We can't just `declare -pf | grep …` because there the functions
    # are in seemingly-random order, which may give confusing results.
    ) )
  local FUNC= EXPECTED= ACTUAL= FILTERED=
  local COMPAT_SED='
    s~^xx(Error) \[ERR_MODULE_NOT_FOUND\](: Cannot find )(module|package|$\
      )( \S+)( imported from .*|)$~\1:\2module\2~
    s~^dynamicMap: import failed for: (\S+)$|$\
      ~&\nError: Cannot find module \x27\1\x27~
    s~^( +code: \x27)ERR_~\1~
    /^ +code: \x27/s~\x27$~&,~
    '
  local N_PASS=0 N_FAIL=0
  for FUNC in "${TODO[@]}"; do
    echo "==== $FUNC ===="
    EXPECTED="$(libtest_find_expectation)"
    ACTUAL="$("$FUNC" 2>&1)"
    FILTERED="$ACTUAL"
    case "${EXPECTED:0:1}" in
      : )
        FILTERED="$(echo "$FILTERED" |
          sed -rf <(echo "$COMPAT_SED") |
          grep -xFe "${EXPECTED:1}" | uniq)";;
    esac
    if [ "$FILTERED" == "${EXPECTED:1}" ]; then
      echo '+OK'
      (( N_PASS += 1 ))
    else
      diff -sU 9009009 --label expected <(echo "${EXPECTED:1}"
        ) --label 'actual | compatibility filter' <(echo "$FILTERED")
      (( N_FAIL += 1 ))
    fi
  done
  echo "==== result ===="
  if [ "$N_FAIL" == 0 ]; then
    echo D: "All $N_PASS tests passed." >&2
    return 0
  fi
  echo E: "$N_FAIL tests failed! ($N_PASS passed.)" >&2
  return 4
}


function libtest_find_expectation () {
  sed -nre "/^function $FUNC /,/^\}$/p" -- "$FILE" |
    sed -nre 's~^\s+#([=:]) ~\1~p' | sed -re '1!s~^[=:]~~'
}







return 0
