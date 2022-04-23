#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function nodemjs () {
  [ -n "$NODEJS_CMD" ] || local NODEJS_CMD='nodejs'

  local SELFFILE="$(readlink -f -- "$BASH_SOURCE")"
  # ^-- Use -f because that usually works even with crippled versions of
  #     readlink like on MacOS X or busybox.
  local PKGDIR="$(dirname -- "$(dirname -- "$SELFFILE")")"

  local ARG=
  local EXEC_AS="$0"
  case "$#:$1" in
    1:--report-path=bin ) echo "$SELFFILE"; return $?;;
    1:--report-path=pkg ) echo "$PKGDIR"; return $?;;
    *:-a )
      EXEC_AS="$2"
      shift 2;;
  esac

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
      -e | -r | -p ) GRAB+=( "${1#-}:$2" ); shift 2;;
      -- ) break;;
      -* ) KEEP+=( "$1" ); shift;;
      * ) break;;
    esac
  done
  local NODE_CMD=(
    exec -a "$EXEC_AS"
    "$NODEJS_CMD"
    "${KEEP[@]}"
    "$PKGDIR"/esldr.js
    "${GRAB[@]}" :
    "$@" )
  "${NODE_CMD[@]}"; return $?
}










nodemjs "$@"; exit $?
