import { virtualNextRoutes } from "@/src/utils/core"
import type { Plugin } from "vite"

export default function virtualNextRoutesPlugin(): Plugin {
  let started = false
  return {
    name: "virtual-next-routes",
    async buildStart() {
      if (started) return
      started = true
      // @ts-ignore: 'this' has 'command' property in Vite plugin context
      await virtualNextRoutes({ watch: this.command === "serve" })
    },
  }
}
