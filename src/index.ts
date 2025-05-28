// src/index.ts
import { virtualNextRoutes } from "@/utils/core"
import type { Plugin, ResolvedConfig } from "vite"

export default function virtualNextRoutesPlugin(): Plugin {
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
      await virtualNextRoutes({ watch })
    },

    // 3️⃣ swallow HMR on your generated file so Vite doesn’t restart forever
    handleHotUpdate(ctx) {
      console.log("Virtual Next Routes: HMR update for", ctx.file)
      if (ctx.file.endsWith("/routes.ts")) {
        return []
      }
    },
  }
}
