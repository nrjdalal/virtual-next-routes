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

### API Routes

| File                      | URL              | Description  |
| ------------------------- | ---------------- | ------------ |
| `api/users/route.ts`      | `/api/users`     | API Endpoint |
| `api/posts/[id]/route.ts` | `/api/posts/$id` | Dynamic API  |

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

Given the following file structure (matches this repository's `src/routes`):

```
src/routes/
├── layout.tsx                              # Root Layout
├── page.tsx                                # /
├── (group)/
│   ├── [group-slug]/
│   │   └── page.tsx                        # /:group-slug
│   ├── group-page-one/
│   │   └── page.tsx                        # /group-page-one
│   └── group-page-two/
│       └── page.tsx                        # /group-page-two
├── [slug-a]/
│   └── [slug-b]/
│       └── page.tsx                        # /:slug-a/:slug-b
├── [slug]/
│   ├── nested/
│   │   └── page.tsx                        # /:slug/nested
│   └── page.tsx                            # /:slug
├── api/
│   ├── posts/
│   │   └── [slug]/
│   │       └── route.ts                    # /api/posts/:slug
│   ├── users/
│   │   └── route.ts                        # /api/users
│   └── route.ts                            # /api
├── auth/
│   ├── (private)/
│   │   └── dashboard/
│   │       └── page.tsx                    # /auth/dashboard
│   ├── (public)/
│   │   ├── login/
│   │   │   └── page.tsx                    # /auth/login
│   │   └── register/
│   │       └── page.tsx                    # /auth/register
│   └── layout.tsx                          # Auth Layout
├── blog/
│   └── [slug]/
│       ├── layout.tsx                      # Blog Post Layout
│       └── page.tsx                        # /blog/:slug
├── dashboard/
│   ├── analytics/
│   │   └── page.tsx                        # /dashboard/analytics
│   ├── layout.tsx                          # Dashboard Layout
│   └── page.tsx                            # /dashboard
├── features/
│   ├── (settings)/
│   │   ├── account/
│   │   │   └── page.tsx                    # /features/account
│   │   ├── layout.tsx                      # Settings Layout
│   │   └── profile/
│   │       └── page.tsx                    # /features/profile
│   └── page.tsx                            # /features
└── nested/
    ├── [slug]/
    │   └── page.tsx                        # /nested/:slug
    └── page.tsx                            # /nested
```

It generates a route tree equivalent to:

- **Root** (`/`)
  - **Index** (`/`)
  - **Group** (Pathless)
    - **Dynamic Group Slug** (`/$group-slug`)
    - **Group Page One** (`/group-page-one`)
    - **Group Page Two** (`/group-page-two`)
  - **Dynamic Slug A** (`/$slug-a`)
    - **Dynamic Slug B** (`/$slug-a/$slug-b`)
  - **Dynamic Slug** (`/$slug`)
    - **Index** (`/$slug`)
    - **Nested** (`/$slug/nested`)
  - **API** (`/api`)
    - **Index** (`/api`)
    - **Users** (`/api/users`)
    - **Posts** (`/api/posts/$slug`)
  - **Auth** (`/auth`)
    - **Layout**
    - **Private** (Pathless)
      - **Dashboard** (`/auth/dashboard`)
    - **Public** (Pathless)
      - **Login** (`/auth/login`)
      - **Register** (`/auth/register`)
  - **Blog** (`/blog`)
    - **Dynamic Post** (`/blog/$slug`)
      - **Layout**
  - **Dashboard** (`/dashboard`)
    - **Layout**
    - **Index** (`/dashboard`)
    - **Analytics** (`/dashboard/analytics`)
  - **Features** (`/features`)
    - **Index** (`/features`)
    - **Settings** (Pathless)
      - **Layout**
      - **Account** (`/features/account`)
      - **Profile** (`/features/profile`)
  - **Nested** (`/nested`)
    - **Index** (`/nested`)
    - **Dynamic Slug** (`/nested/$slug`)

## Compatibility Status

- [x] **Root Layout**: `layout.tsx` at root.
- [x] **Nested Layouts**: `layout.tsx` in subdirectories.
- [x] **Pages**: `page.tsx` or `index.tsx`.
- [x] **API Routes**: `route.ts`.
- [x] **Dynamic Routes**: `[slug]`.
- [x] **Catch-all Routes**: `[...slug]`.
- [x] **Optional Catch-all Routes**: `[[...slug]]`.
- [x] **Route Groups**: `(group)`.
- [x] **Private Folders**: `_folder`.
