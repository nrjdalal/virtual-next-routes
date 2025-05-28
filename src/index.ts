import { virtualNextRoutes } from "@/src/utils/core"
import type { Plugin } from "vite"

export default function virtualNextRoutesPlugin(): Plugin {
  let started = false
  return {
    name: "virtual-next-routes",
    enforce: "pre",
    async buildStart() {
      if (started) return
      started = true
      // @ts-ignore: 'this' has 'command' property in Vite plugin context
      console.log(this.command)
      // @ts-ignore: 'this' has 'command' property in Vite plugin context
      await virtualNextRoutes({ watch: this.command === "serve" })
    },
    handleHotUpdate(ctx) {
      if (ctx.file === "routes.ts") {
        return []
      }
    },
  }
}
