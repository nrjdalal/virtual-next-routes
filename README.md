# Next.js like routing with TanStack Start

Just install `virtual-next-routes` plugin and add it to your Vite config.

```sh
npm i --save-dev virtual-next-routes
```

```diff
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
+ import virtualNextRoutes from "virtual-next-routes"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
+     virtualNextRoutes(),
    tanstackStart({
      tsr: {
        // This is the directory where TanStack Router will look for your routes.
        routesDirectory: "src/app",
+         virtualRouteConfig: "./routes",
      },
    }),
  ],
})
```

## Compatibility

https://nextjs.org/docs/app/getting-started/project-structure

Routing Files

- [x] root layout
- [ ] layout
- [x] page

Nested routes

- [x] folder
- [x] nested/folder

Dynamic routes

- [x] [slug]
- [ ] [...slug]
- [ ] [[...slug]]

Route Groups and private folders

- [x] (group)
- [ ] \_folder
