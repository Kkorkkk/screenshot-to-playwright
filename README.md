# Screenshot To Playwright

Turn screenshot annotations into a Playwright test starter.

This MVP is local and deterministic: provide OCR/vision annotations as JSON and it generates a readable test file.

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