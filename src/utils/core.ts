import fs from "node:fs/promises"
import path from "node:path"
import { template } from "@/utils/template"
import chokidar from "chokidar"
import { glob } from "tinyglobby"

export interface VirtualNextRoutesOptions {
  cwd?: string
  output?: string
  watch?: boolean
  debug?: boolean
}

export async function virtualNextRoutes({
  cwd = process.cwd(),
  output = "routes.ts",
  watch = false,
  debug = false,
}: VirtualNextRoutesOptions) {
  const root = path.resolve(cwd)
  const outFile = path.resolve(root, output)

  let watchDir = path.resolve(root, "src/routes")

  // TODO: Read from vite.config.ts instead
  try {
    await fs.access(watchDir)
  } catch {
    watchDir = path.resolve(root, "src/app")
    await fs.access(watchDir)
  }

  async function generate() {
    const files = await glob("**/*.tsx", { cwd: watchDir })
    const content = template(files)
    await fs.writeFile(outFile, content, "utf8")
    console.log(`🔥 Routes generated at ${outFile}`)
  }

  await generate()

  if (watch) {
    let scheduled = false

    const scheduleGenerate = () => {
      if (scheduled) return

      scheduled = true

      setTimeout(async () => {
        scheduled = false
        await generate()
      }, 0)
    }

    chokidar
      .watch(watchDir, { ignoreInitial: true })
      .on("add", (f) => {
        if (debug) console.log(`+  ${f}`)
        scheduleGenerate()
      })
      .on("unlink", (f) => {
        if (debug) console.log(`-  ${f}`)
        scheduleGenerate()
      })
  }
}
