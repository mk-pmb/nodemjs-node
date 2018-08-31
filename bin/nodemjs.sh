#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function nodemjs () {
  local PKGDIR="$(readlink -m "$BASH_SOURCE"/../..)"
  local ARG=
  local EXEC=( exec )
  if [ "$1" == -a ]; then
    EXEC+=( "$1" "$2" )
    shift 2
  fi
  local KEEP=() GRAB=()

  local NPM_BIN="$(type -p npm)"
  if [ -x "$NPM_BIN" ]; then
    local NPMCFG_PRELOAD="$(npm config get nodemjs-preload)"
    case "$NPMCFG_PRELOAD" in
      '' | undefined ) ;;
      * ) export NODEMJS_PRELOAD="$NPMCFG_PRELOAD $NODEMJS_PRELOAD";;
    esac
  fi

  while [ "$#" -ge 1 ]; do
    case "$1" in
      -r ) GRAB+=( "r:$2" ); shift 2;;
      -- ) break;;
      -* ) KEEP+=( "$1" ); shift;;
      * ) break;;
    esac
  done
  "${EXEC[@]}" nodejs "${KEEP[@]}" "$PKGDIR"/esldr.js "${GRAB[@]}" : "$@"
  return $?
}










nodemjs "$@"; exit $?
