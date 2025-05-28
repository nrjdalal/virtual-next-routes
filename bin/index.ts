#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"
import { parseArgs } from "node:util"
import { template } from "@/template"
import { author, name, version } from "~/package.json"
import chokidar from "chokidar"
import { glob } from "tinyglobby"

const helpMessage = `Version:
  ${name}@${version}

Usage:
  $ ${name} [options]

Options:
  -o, --output <path>  destination directory for json files (default: "./public/r")
  -c, --cwd <cwd>      the working directory (default: "./")
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
        output: { type: "string", short: "o", default: "routes.ts" },
        cwd: { type: "string", short: "c" },
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

    const watchDir = path.resolve(cwd, "src/routes")

    chokidar.watch(watchDir).on("all", async (filePath) => {
      const files = await glob("**/*.tsx", { cwd: watchDir })
      // write template(files) to output file
      const outputPath = path.resolve(cwd, values.output as string)
      const content = template(JSON.stringify(files, null, 2))
      await fs.writeFile(outputPath, content, "utf8")
    })
  } catch (err: any) {
    console.error(helpMessage)
    console.error(`\n${err.message}\n`)
    process.exit(1)
  }
}

main()
