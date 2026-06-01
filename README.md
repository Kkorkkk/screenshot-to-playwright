# Screenshot To Playwright

[![CI](https://github.com/Kkorkkk/screenshot-to-playwright/actions/workflows/ci.yml/badge.svg)](https://github.com/Kkorkkk/screenshot-to-playwright/actions/workflows/ci.yml)

Turn screenshot annotations into a Playwright test starter.

Important: this tool does not perform OCR or computer vision. It expects a small annotation JSON file created by you or another vision/OCR step, then generates a readable Playwright starter spec.

## Install

```bash
npx screenshot-to-playwright examples/login-screen.annotations.json
npm install -g screenshot-to-playwright
screenshot-to-playwright examples/login-screen.annotations.json
```

## Quick start

```bash
npm install
npm test
node src/index.js examples/login-screen.annotations.json > login.spec.ts
```

## Annotation shape

```json
{
  "url": "http://localhost:3000/login",
  "name": "login flow",
  "elements": [
    { "role": "textbox", "name": "Email", "value": "demo@example.com" },
    { "role": "button", "name": "Sign in", "action": "click" }
  ]
}
```

## Limits

Use this as an annotation-to-test bridge. It validates missing roles/names and unsupported shapes, but it will not inspect screenshots or infer selectors by itself.

## Output

The generated file is a starter spec. Review selectors and assertions before committing it:

```ts
await page.getByRole("textbox", { name: "Email" }).fill("demo@example.com");
await page.getByRole("button", { name: "Sign in" }).click();
```

## Status

Experimental 0.1 CLI. The tool is small on purpose, with no runtime dependencies. Review generated commands, code, and reports before using them in production workflows.
