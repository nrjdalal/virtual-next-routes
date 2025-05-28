## Clone this template

```bash
npx gitpick@latest nrjdalal/the-typescript-starter
```

## If you wish to run a server

```bash
npm i -D concurrently nodemon
npx fx '({
  ...this,
  scripts: {
    ...this.scripts,
    "dev": "tsup && concurrently \"tsup --watch\" \"nodemon dist/index.js\""
  }
})' package.json >package.tmp.json && mv package.tmp.json package.json
```
