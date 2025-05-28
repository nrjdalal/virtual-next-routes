import path from "node:path"
import { virtualNextRoutes as core } from "@/utils/core"
import type { Plugin, ResolvedConfig } from "vite"

export default function virtualNextRoutes({
  cwd = process.cwd(),
  output = "routes.ts",
  debug = false,
}): Plugin {
  let started = false
  let watch = false

  return {
    name: "virtual-next-routes",
    enforce: "pre",

    // 1️⃣ capture whether we're in 'serve' (dev) or 'build' mode
    configResolved(config: ResolvedConfig) {
      watch = config.command === "serve"
    },

    // 2️⃣ run your generator once, and in dev mode keep watching
    async buildStart() {
      if (started) return
      started = true
      await core({
        cwd,
        output,
        watch,
        debug,
      })
    },

    // 3️⃣ swallow HMR on your generated file so Vite doesn’t restart forever
    // handleHotUpdate(ctx) {
    //   if (path.resolve(ctx.file) === path.resolve("routes.ts")) {
    //     console.log(
    //       "[virtual-next-routes] HMR triggered, but not restarting Vite.",
    //     )
    //     return []
    //   }
    // },
  }
}
