import fsSync from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"
import { template } from "@/lib/template"
import chokidar from "chokidar"
import { glob } from "tinyglobby"

export interface VirtualNextRoutesOptions {
  cwd: string
  output: string
  watch: boolean
  debug?: boolean
}

function findFilesSync(dir: string, baseDir: string = dir): string[] {
  const entries = fsSync.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findFilesSync(fullPath, baseDir))
    } else if (entry.isFile() && /\.(tsx|ts)$/.test(entry.name)) {
      files.push(path.relative(baseDir, fullPath).replace(/\\/g, "/"))
    }
  }
  return files
}

export function virtualNextRoutesSync({
  cwd,
  output,
  debug = false,
}: Omit<VirtualNextRoutesOptions, "watch">) {
  const root = path.resolve(cwd)
  const outFile = path.resolve(root, output)

  let watchDir = path.resolve(root, "src/routes")

  try {
    fsSync.accessSync(watchDir)
  } catch {
    watchDir = path.resolve(root, "src/app")
    try {
      fsSync.accessSync(watchDir)
    } catch {
      // if neither exists, maybe return or just fail gracefully?
      // For now, let's assume one exists or empty list
    }
  }

  try {
    const files = findFilesSync(watchDir)
    const content = template(files)
    fsSync.writeFileSync(outFile, content, "utf8")
    // console.log(`🔥 Routes generated at ${outFile}`)
    // Commented out to reduce noise during factory execution
  } catch (e) {
    if (debug) console.error("Sync generation failed:", e)
  }
}

export async function virtualNextRoutes({
  cwd,
  output,
  watch,
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
    const files = await glob("**/*.{tsx,ts}", { cwd: watchDir })
    const content = template(files)
    await fs.writeFile(outFile, content, "utf8")
    console.log(`🔥 Routes generated at ${outFile}`)
  }

  // Initial generation is handled by Sync version in factory,
  // but if called from CLI, we might want it.
  // We can skip initial generate if we assume sync ran?
  // But CLI uses this too.
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
