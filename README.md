# Virtual Next Routes

Next.js App Router style file-system routing for TanStack Start (and TanStack Router).

## Installation

Install the plugin:

```sh
npm i --save-dev virtual-next-routes
```

Add it to your Vite config:

```diff
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
+ import virtualNextRoutes from "virtual-next-routes"
import { defineConfig } from "vite"
import tsConfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tsConfigPaths(),
+   virtualNextRoutes(),
    tanstackStart({
      router: {
        // Specifies the directory TanStack Router (default: "routes") uses for your routes.
+       routesDirectory: "app",
+       virtualRouteConfig: "./routes",
      },
    }),
  ],
})
```

Example project: https://github.com/nrjdalal/start-pro, the project uses this plugin to generate routes. And provides other useful insights like `drizzle`, `shadcn`, `better-auth`, `dark-mode` and a lot more.

## Folder and File Conventions

`virtual-next-routes` adopts the Next.js App Router conventions for file-system routing.

### Routing Files

The following files are used to define routes and layouts:

| File     | Extension | Description                                               |
| -------- | --------- | --------------------------------------------------------- |
| `layout` | `.tsx`    | Shared UI for a segment and its children                  |
| `page`   | `.tsx`    | Unique UI of a route and makes routes publicly accessible |
| `route`  | `.ts`     | Server-side API endpoint                                  |

### Nested Routes

Folders define URL segments. Nesting folders nests segments. Layouts at any level wrap their child segments.

| Path                         | URL pattern | Description                  |
| ---------------------------- | ----------- | ---------------------------- |
| `src/routes/layout.tsx`      | —           | Root layout wraps all routes |
| `src/routes/page.tsx`        | `/`         | Public route                 |
| `src/routes/blog/layout.tsx` | -           | Layout for blog routes       |
| `src/routes/blog/page.tsx`   | `/blog`     | Public route                 |

### Dynamic Routes

When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use Dynamic Segments that are filled in at request time or prerendered at build time.

#### Dynamic Segments

A Dynamic Segment can be created by wrapping a folder's name in square brackets: `[folderName]`. For example, `[id]` or `[slug]`.
This maps to a **Dynamic Route** path `$folderName` in TanStack Router.

| Route                             | Example URL | `params`        |
| --------------------------------- | ----------- | --------------- |
| `src/routes/blog/[slug]/page.tsx` | `/blog/a`   | `{ slug: 'a' }` |
| `src/routes/blog/[slug]/page.tsx` | `/blog/b`   | `{ slug: 'b' }` |
| `src/routes/blog/[slug]/page.tsx` | `/blog/c`   | `{ slug: 'c' }` |

#### Catch-all Segments

Dynamic Segments can be extended to **catch-all** subsequent segments by adding an ellipsis inside the brackets `[...folderName]`.
This maps to a **Splat Route** path `$` in TanStack Router. The parameter is accessed via `_splat` (string).

**Example:** `src/routes/shop/[...slug]/page.tsx`

| Route                                | Example URL   | `params`              |
| ------------------------------------ | ------------- | --------------------- |
| `src/routes/shop/[...slug]/page.tsx` | `/shop/a`     | `{ _splat: 'a' }`     |
| `src/routes/shop/[...slug]/page.tsx` | `/shop/a/b`   | `{ _splat: 'a/b' }`   |
| `src/routes/shop/[...slug]/page.tsx` | `/shop/a/b/c` | `{ _splat: 'a/b/c' }` |

#### Optional Catch-all Segments

Catch-all Segments can be made **optional** by including the parameter in double square brackets: `[[...folderName]]`.
This maps to both an **Index Route** (for the base path) and a **Splat Route** path `$`.

**Example:** `src/routes/docs/[[...slug]]/page.tsx`

The difference between **catch-all** and **optional catch-all** segments is that with optional, the route without the parameter is also matched (`/docs` in the example above).

| Route                                  | Example URL | `params`            |
| -------------------------------------- | ----------- | ------------------- |
| `src/routes/docs/[[...slug]]/page.tsx` | `/docs`     | `{}`                |
| `src/routes/docs/[[...slug]]/page.tsx` | `/docs/a`   | `{ _splat: 'a' }`   |
| `src/routes/docs/[[...slug]]/page.tsx` | `/docs/a/b` | `{ _splat: 'a/b' }` |

### Route Groups and Private Folders

You can organize your code without affecting the URL structure.

| Path                                | URL pattern | Notes                                     |
| ----------------------------------- | ----------- | ----------------------------------------- |
| `src/routes/(marketing)/page.tsx`   | `/`         | Group omitted from URL                    |
| `src/routes/(shop)/cart/page.tsx`   | `/cart`     | Share layouts within `(shop)`             |
| `src/routes/_components/Button.tsx` | —           | Not routable; safe place for UI utilities |
| `src/routes/_lib/utils.ts`          | —           | Not routable; safe place for utils        |

## Example Structure

The following example demonstrates a comprehensive project structure:

```
src/routes/
├── layout.tsx                          # Root Layout
├── page.tsx                            # /
├── (marketing)/                        # Route Group (pathless)
│   └── about/
│       └── page.tsx                    # /about
├── blog/
│   └── [slug]/
│       └── page.tsx                    # /blog/:slug
├── shop/
│   └── [...slug]/
│       └── page.tsx                    # /shop/* (Catch-all)
├── docs/
│   └── [[...slug]]/
│       └── page.tsx                    # /docs/* (Optional Catch-all)
├── api/
│   ├── auth/
│   │   └── [...all]/
│   │       └── route.ts                # /api/auth/* (Catch-all)
│   └── health/
│       └── route.ts                    # /api/health
└── _private/                           # Private Folder
    └── utils.ts                        # (Ignored)
```

### Route Tree Output

This structure generates a route tree equivalent to:

- **Root** (`/`)
  - **Index** (`/`)
  - **Marketing Group** (Pathless)
    - **About** (`/about`)
  - **Blog** (`/blog`)
    - **Post** (`/blog/$slug`)
  - **Shop** (`/shop`)
    - **Catch-all** (`/shop/$`) (Param: `_splat`)
  - **Docs** (`/docs`)
    - **Optional Catch-all** (`/docs/$` + Index) (Param: `_splat`)
  - **API** (`/api`)
    - **Auth Catch-all** (`/api/auth/$`) (Param: `_splat`)
    - **Health** (`/api/health`)

## Organizing Your Project

`virtual-next-routes` is unopinionated about how you organize your project files, but supports:

- **Colocation**: Store project files inside route segments (safe as long as they don't match routing file conventions).
- **Private Folders**: Use `_folderName` to explicitly opt-out of routing.
- **Route Groups**: Use `(groupName)` to organize routes without affecting the URL path.
