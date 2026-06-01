# Screenshot To Playwright

Turn screenshot annotations into a Playwright test starter.

Important: this tool does not perform OCR or computer vision. It expects a small annotation JSON file created by you or another vision/OCR step, then generates a readable Playwright starter spec.

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
