#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

function quote(value) {
  return JSON.stringify(String(value ?? ""));
}

function escapeRegex(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("/", "\\/")
    .replaceAll(".", "\\.")
    .replaceAll("*", "\\*")
    .replaceAll("+", "\\+")
    .replaceAll("?", "\\?")
    .replaceAll("^", "\\^")
    .replaceAll("$", "\\$")
    .replaceAll("{", "\\{")
    .replaceAll("}", "\\}")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll("|", "\\|")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]");
}

export function validateAnnotation(annotation) {
  if (!annotation || typeof annotation !== "object" || Array.isArray(annotation)) {
    throw new Error("Annotation must be a JSON object.");
  }
  if (annotation.elements != null && !Array.isArray(annotation.elements)) {
    throw new Error("Annotation field 'elements' must be an array.");
  }
  if (annotation.assertions != null && !Array.isArray(annotation.assertions)) {
    throw new Error("Annotation field 'assertions' must be an array.");
  }
  for (const [index, element] of (annotation.elements || []).entries()) {
    if (!element.selector && !element.role && !element.text && element.action !== "screenshot") {
      throw new Error(`Element ${index + 1} needs selector, role, text, or screenshot action.`);
    }
    if (element.role && !(element.name || element.text)) {
      throw new Error(`Element ${index + 1} with role '${element.role}' needs a name or text.`);
    }
  }
  return annotation;
}

export function generatePlaywrightSpec(annotation) {
  validateAnnotation(annotation);
  const name = annotation.name || "generated screenshot flow";
  const url = annotation.url || "/";
  const lines = [
    "import { test, expect } from '@playwright/test';",
    "",
    `test(${quote(name)}, async ({ page }) => {`,
    `  await page.goto(${quote(url)});`
  ];
  for (const element of annotation.elements || []) {
    const locator = element.selector
      ? `page.locator(${quote(element.selector)})`
      : element.role
      ? `page.getByRole(${quote(element.role)}, { name: ${quote(element.name || element.text || "")} })`
      : `page.getByText(${quote(element.text || element.name || "")})`;
    if (element.action === "screenshot") {
      lines.push(`  await page.screenshot({ path: ${quote(element.path || "screenshot.png")} });`);
    } else if (element.action === "check") {
      lines.push(`  await ${locator}.check();`);
    } else if (element.value != null || element.action === "fill") {
      lines.push(`  await ${locator}.fill(${quote(element.value || "")});`);
    } else if (element.action === "press") {
      lines.push(`  await ${locator}.press(${quote(element.key || "Enter")});`);
    } else {
      lines.push(`  await ${locator}.click();`);
    }
    if (element.expectVisible) lines.push(`  await expect(${locator}).toBeVisible();`);
  }
  for (const assertion of annotation.assertions || []) {
    const text = assertion.text || assertion.name;
    if (text) lines.push(`  await expect(page.getByText(${quote(text)})).toBeVisible();`);
    if (assertion.urlContains) lines.push(`  await expect(page).toHaveURL(/${escapeRegex(assertion.urlContains)}/);`);
  }
  lines.push("});", "");
  return lines.join("\n");
}

export function parseCliArgs(args) {
  const file = args.find((arg) => !arg.startsWith("--"));
  if (!file) throw new Error("Usage: screenshot-to-playwright annotations.json");
  return { file };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { file } = parseCliArgs(process.argv.slice(2));
    console.log(generatePlaywrightSpec(JSON.parse(readFileSync(file, "utf8"))));
  } catch (error) {
    console.error(`screenshot-to-playwright: ${error.message}`);
    process.exit(2);
  }
}
