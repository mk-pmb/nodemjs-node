#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function nodemjs () {
  [ -n "$NODEJS_CMD" ] || local NODEJS_CMD='nodejs'

  # local PKGDIR="$(readlink -m "$BASH_SOURCE"/../..)"
  # ^-- 2019-03-14: doesn't work on MacOS as they use BSD readline, not GNU's
  local PKGDIR="$(BS="$BASH_SOURCE" nodejs -p '
    path.dirname(path.dirname(fs.realpathSync(process.env.BS)))')"

  local ARG=
  local EXEC_AS="$0"
  if [ "$1" == -a ]; then
    EXEC_AS="$2"
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
