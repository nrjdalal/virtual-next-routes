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
        routesDirectory: "src/app",
+         virtualRouteConfig: "./routes",
      },
    }),
  ],
})
```

## Features & Routing Conventions

`virtual-next-routes` supports the following Next.js App Router conventions:

### Basic Routing

| File                | URL        | Description                 |
| ------------------- | ---------- | --------------------------- |
| `page.tsx`          | `/`        | Index route                 |
| `about/page.tsx`    | `/about`   | Nested route                |
| `contact/index.tsx` | `/contact` | Alternative index file name |

### Dynamic Routing

| File                        | URL                 | Description                |
| --------------------------- | ------------------- | -------------------------- |
| `blog/[slug]/page.tsx`      | `/blog/$slug`       | Dynamic segment            |
| `shop/[...slug]/page.tsx`   | `/shop/$`           | Catch-all segment          |
| `docs/[[...slug]]/page.tsx` | `/docs` & `/docs/$` | Optional catch-all segment |

### Layouts

A `layout.tsx` file wraps all routes in its directory and subdirectories.

- `src/routes/layout.tsx`: Root layout (wraps everything).
- `src/routes/dashboard/layout.tsx`: Wraps all `/dashboard/*` routes.

### Route Groups

Folders enclosed in parentheses `(group)` are treated as route groups. They allow you to organize files without affecting the URL path.

- `src/routes/(auth)/login/page.tsx` -> `/login`
- `src/routes/(app)/dashboard/page.tsx` -> `/dashboard`

### Private Folders

Folders starting with an underscore `_folder` are private and excluded from routing.

- `src/routes/_components/button.tsx` -> (Ignored)
- `src/routes/_utils/api.ts` -> (Ignored)

## Example Structure

Given the following file structure:

```
src/routes/
├── layout.tsx                  # Root Layout
├── page.tsx                    # /
├── about/
│   └── page.tsx                # /about
├── blog/
│   ├── layout.tsx              # Blog Layout
│   ├── [slug]/
│   │   └── page.tsx            # /blog/:slug
│   └── page.tsx                # /blog
├── (auth)/                     # Route Group (doesn't add to path)
│   ├── layout.tsx              # Auth Layout
│   ├── login/
│   │   └── page.tsx            # /login
│   └── register/
│       └── page.tsx            # /register
└── dashboard/
    ├── layout.tsx              # Dashboard Layout
    ├── settings/
    │   └── page.tsx            # /dashboard/settings
    └── page.tsx                # /dashboard
```

It generates a route tree equivalent to:

- **Root** (`/`)
  - **Index** (`/`)
  - **About** (`/about`)
  - **Blog** (`/blog`)
    - **Layout** (Wraps blog routes)
    - **Index** (`/blog`)
    - **Post** (`/blog/$slug`)
  - **Auth Group** (Pathless)
    - **Layout** (Wraps auth routes)
    - **Login** (`/login`)
    - **Register** (`/register`)
  - **Dashboard** (`/dashboard`)
    - **Layout** (Wraps dashboard routes)
    - **Index** (`/dashboard`)
    - **Settings** (`/dashboard/settings`)

## Compatibility Status

- [x] **Root Layout**: `layout.tsx` at root.
- [x] **Nested Layouts**: `layout.tsx` in subdirectories.
- [x] **Pages**: `page.tsx` or `index.tsx`.
- [x] **Dynamic Routes**: `[slug]`.
- [x] **Catch-all Routes**: `[...slug]`.
- [x] **Optional Catch-all Routes**: `[[...slug]]`.
- [x] **Route Groups**: `(group)`.
- [x] **Private Folders**: `_folder`.
