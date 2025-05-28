#!/usr/bin/env node
import path from "node:path"
import { parseArgs } from "node:util"
import { virtualNextRoutes } from "@/lib/core"
import { author, name, version } from "../package.json"

const helpMessage = `Version:
  ${name}@${version}

Usage:
  $ ${name} [options]

Options:
  -c, --cwd <cwd>      the working directory (default: current directory)
  -o, --output <path>  destination directory (default: routes.ts)
  -w, --watch          watch for changes (default: true)
  -d, --debug          enable debug mode (default: false)
  -v, --version        display version
  -h, --help           display help

Author:
  ${author.name} <${author.email}> (${author.url})`

const parse: typeof parseArgs = (config) => {
  try {
    return parseArgs(config)
  } catch (err: any) {
    throw new Error(`Error parsing arguments: ${err.message}`)
  }
}

const main = async () => {
  try {
    const { positionals, values } = parse({
      allowPositionals: true,
      options: {
        cwd: { type: "string", short: "c" },
        output: { type: "string", short: "o", default: "routes.ts" },
        watch: { type: "boolean", short: "w", default: true },
        debug: { type: "boolean", short: "d", default: false },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
    })

    if (!positionals.length) {
      if (values.version) {
        console.log(`${name}@${version}`)
        process.exit(0)
      }
      if (values.help) {
        console.log(helpMessage)
        process.exit(0)
      }
    }

    const cwd = path.resolve(values.cwd ?? process.cwd())
    const output = path.resolve(cwd, values.output)

    await virtualNextRoutes({
      cwd,
      output,
      watch: values.watch,
      debug: values.debug,
    })
  } catch (err: any) {
    console.error(helpMessage)
    console.error(`\n${err.message}\n`)
    process.exit(1)
  }
}

main()
