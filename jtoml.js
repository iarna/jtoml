#!/usr/bin/env node
'use strict'
require('@iarna/cli')(main)
const TOML = require('@iarna/toml')
const fs = require('fs')
const fun = require('funstream')
const util = require('util')

async function main (opts, ...args) {
    const realStdin = fun(process.stdin)
    delete process.stdin
    process.stdin = realStdin.grab(_ => JSON.stringify(TOML.parse(_.join(''))))
    process.stdin.isTTY = realStdin.isTTY

    const realStderr = process.stderr
    let seenOutput = false
    delete process.stderr
    process.stderr = fun(out => out.map(_ => {
      if (!seenOutput) {
        seenOutput = true
       if (realStdin.isTTY)  realStdin.end()
      }
      return _
    }).pipe(realStderr))
    console.warn = function (...args) {
      process.stderr.write(args.map(_ => typeof _ === 'string' ? _ : util.inspect(_)).join(' ') + '\n')
    }
    const realStdout = process.stdout
    delete process.stdout
    process.stdout = fun(out => out.map(_ => {
      if (!seenOutput) {
        seenOutput = true
        if (realStdin.isTTY) realStdin.end()
      }
      return _
    }).map(_ => {
      try {
        return TOML.stringify(JSON.parse(_))
      } catch (ex) {
        try {
          return TOML.stringify.value(JSON.parse(_))
        } catch (ex) {
          return _
        }
      }
    }).pipe(realStdout))
    console.log = function (...args) {
      process.stdout.write(args.map(_ => typeof _ === 'string' ? _ : util.inspect(_)).join(' ') + '\n')
    }
//    process.stdout = fun(out => out.grab(_ => TOML.stringify(JSON.parse(_.join('')))).pipe(realStdout))
  return require('json').main(process.argv)
}
