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
+     virtualNextRoutes(),
    tanstackStart({
      tsr: {
        // This is the directory where TanStack Router will look for your routes.
        routesDirectory: "app",
+         virtualRouteConfig: "./routes",
      },
    }),
  ],
})
```

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

| Path                       | URL pattern | Description                  |
| -------------------------- | ----------- | ---------------------------- |
| `src/routes/layout.tsx`    | —           | Root layout wraps all routes |
| `src/routes/page.tsx`      | `/`         | Public route                 |
| `src/routes/blog/page.tsx` | `/blog`     | Public route                 |

### Dynamic Routes

Dynamic segments can be created by wrapping a folder's name in square brackets: `[folderName]`.

| Path                                   | URL pattern                               |
| -------------------------------------- | ----------------------------------------- |
| `src/routes/blog/[slug]/page.tsx`      | `/blog/my-first-post`                     |
| `src/routes/shop/[...slug]/page.tsx`   | `/shop/clothing`, `/shop/clothing/shirts` |
| `src/routes/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`        |

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
│   ├── about/
│   │   └── page.tsx                    # /about
│   └── blog/
│       ├── [slug]/
│       │   └── page.tsx                # /blog/:slug
│       └── page.tsx                    # /blog
├── (shop)/                             # Route Group (pathless)
│   ├── layout.tsx                      # Shop Layout (wraps account & cart)
│   ├── account/
│   │   └── page.tsx                    # /account
│   └── cart/
│       └── page.tsx                    # /cart
├── api/
│   └── users/
│       └── route.ts                    # /api/users
└── _components/                        # Private Folder
    └── Button.tsx                      # (Ignored)
```

### Route Tree Output

This structure generates a route tree equivalent to:

- **Root** (`/`)
  - **Index** (`/`)
  - **Marketing Group** (Pathless)
    - **About** (`/about`)
    - **Blog** (`/blog`)
      - **Post** (`/blog/$slug`)
  - **Shop Group** (Pathless)
    - **Layout**
    - **Account** (`/account`)
    - **Cart** (`/cart`)
  - **API** (`/api`)
    - **Users** (`/api/users`)

## Organizing Your Project

`virtual-next-routes` is unopinionated about how you organize your project files, but supports:

- **Colocation**: Store project files inside route segments (safe as long as they don't match routing file conventions).
- **Private Folders**: Use `_folderName` to explicitly opt-out of routing.
- **Route Groups**: Use `(groupName)` to organize routes without affecting the URL path.
