import test from "node:test";
import assert from "node:assert/strict";
import { generatePlaywrightSpec, validateAnnotation } from "../src/index.js";

test("generates fill and click actions", () => {
  const spec = generatePlaywrightSpec({
    url: "http://localhost:3000",
    elements: [
      { role: "textbox", name: "Email", value: "a@b.com" },
      { role: "button", name: "Sign in" },
      { selector: "[data-testid=remember]", action: "check" },
      { action: "screenshot", path: "after-login.png" }
    ],
    assertions: [{ text: "Dashboard" }]
  });
  assert.match(spec, /page.goto/);
  assert.match(spec, /getByRole\("textbox"/);
  assert.match(spec, /page.locator/);
  assert.match(spec, /page.screenshot/);
  assert.match(spec, /Dashboard/);
});

test("rejects incomplete annotation elements", () => {
  assert.throws(
    () => validateAnnotation({ elements: [{ role: "button" }] }),
    /needs a name or text/
  );
  assert.throws(
    () => validateAnnotation({ elements: [{ action: "click" }] }),
    /needs selector/
  );
});
