import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Exercise the real handler with a local provider spy. No email or network calls.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const loadedModule = { exports: {} };
const javascript = ts.transpileModule(readFileSync(path.join(root, "lib/contact.ts"), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
new Function("require", "module", "exports", javascript)(require, loadedModule, loadedModule.exports);
const { parseContactPayload, escapeHtml, createContactHandler } = loadedModule.exports;

const valid = {
  name: "Ada Developer",
  email: "ada@example.test",
  mobileNumber: "+234 800 000 0000",
  message: "I would like to discuss a project.\nAre you available next week?",
};
const owner = "owner@example.test";
const sender = "Portfolio <portfolio@example.test>";
function harness({ apiKey = () => "mock-api-key", results = [] } = {}) {
  const sent = [];
  const handler = createContactHandler({
    apiKey,
    from: sender,
    to: owner,
    send: async (options) => {
      sent.push(options);
      const result = results[sent.length - 1];
      if (result instanceof Error) throw result;
      return result ?? { data: { id: `mock-${sent.length}` }, error: null };
    },
  });
  return { sent, handler };
}
const request = (payload) => new Request("http://localhost/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
async function assertRejected(payload) {
  const { handler, sent } = harness();
  assert.equal((await handler(request(payload))).status, 400);
  assert.equal(sent.length, 0, "Invalid input must never reach the provider");
}

assert.deepEqual(parseContactPayload({
  name: `  ${valid.name}  `,
  email: `  ${valid.email}  `,
  mobileNumber: `  ${valid.mobileNumber}  `,
  message: `  ${valid.message}  `,
}), valid);
assert.equal(parseContactPayload({ ...valid, mobileNumber: undefined }).mobileNumber, "");
assert.equal(parseContactPayload({ ...valid, mobileNumber: "   " }).mobileNumber, "");
for (const payload of [null, [], "a string", 123, true, {}, { ...valid, name: [] },
  { ...valid, email: {} }, { ...valid, mobileNumber: 123 }, { ...valid, message: [] },
  { ...valid, name: " \n " }, { ...valid, email: " " }, { ...valid, message: "\t\n" },
  { ...valid, email: "not-an-email" }, { ...valid, email: "ada@" },
  { ...valid, email: "ada @example.test" }, { ...valid, email: "ada@example" },
  { ...valid, name: "a".repeat(101) }, { ...valid, email: `${"a".repeat(242)}@example.test` },
  { ...valid, mobileNumber: "1".repeat(41) }, { ...valid, message: "a".repeat(5001) },
]) {
  assert.equal(parseContactPayload(payload), null);
  await assertRejected(payload);
}
const maximum = { name: "a".repeat(100), email: `${"a".repeat(241)}@example.test`, mobileNumber: "1".repeat(40), message: "a".repeat(5000) };
assert.equal(maximum.email.length, 254);
assert.deepEqual(parseContactPayload(maximum), maximum);

{
  const { handler, sent } = harness();
  const malformed = new Request("http://localhost/api/contact", { method: "POST", body: "{" });
  assert.equal((await handler(malformed)).status, 400);
  assert.equal(sent.length, 0);
}
{
  const { handler, sent } = harness({ apiKey: () => undefined });
  assert.equal((await handler(request(valid))).status, 503);
  assert.equal(sent.length, 0, "Missing credentials must not attempt delivery");
  assert.equal((await handler(request({ ...valid, message: " " }))).status, 400, "Validate before checking credentials");
}
{
  const { handler, sent } = harness();
  const response = await handler(request(valid));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(sent.length, 2, "Send the owner submission and visitor acknowledgement");
  assert.equal(sent[0].from, sender);
  assert.equal(sent[0].to, owner);
  assert.equal(sent[0].replyTo, valid.email);
  assert.ok(sent[0].subject.includes(valid.name));
  assert.ok(sent[0].text.includes(valid.message), "Keep the message's real newlines in the plain-text alternative");
  assert.match(sent[0].html, /<br\s*\/?>|white-space:\s*pre-(?:line|wrap)/i, "Keep real message line breaks readable in HTML");
  assert.equal(sent[1].to, valid.email);
  for (const email of sent) {
    assert.equal(typeof email.html, "string");
    assert.equal(typeof email.text, "string");
    assert.ok(email.html && email.text);
  }
}
for (const failure of [
  { data: null, error: { message: "Provider rejected the request" } },
  { data: { id: "unusable" }, error: { message: "Provider returned an error with data" } },
  { data: null, error: null },
  new Error("Mock connection failed"),
]) {
  const { handler, sent } = harness({ results: [failure] });
  assert.equal((await handler(request(valid))).status, 502);
  assert.equal(sent.length, 1, "Do not acknowledge a primary delivery that failed");
}
for (const failure of [{ data: null, error: { message: "Acknowledgement rejected" } }, new Error("Mock acknowledgement failed")]) {
  const { handler, sent } = harness({ results: [{ data: { id: "delivered" }, error: null }, failure] });
  const response = await handler(request(valid));
  assert.equal(response.status, 200, "An acknowledgement failure must not encourage resending an already delivered submission");
  assert.equal((await response.json()).success, true);
  assert.equal(sent.length, 2);
}
{
  const hostile = {
    name: '<script>alert("name")</script>',
    email: valid.email,
    mobileNumber: '<img src=x onerror="alert(1)">',
    message: '<a href="javascript:alert(1)">Click & "quote"</a>\nSecond line\n\'single quotes\'',
  };
  const { handler, sent } = harness();
  assert.equal((await handler(request(hostile))).status, 200);
  assert.equal(escapeHtml('<>&"\''), "&lt;&gt;&amp;&quot;&#39;");
  for (const email of sent) {
    assert.ok(!email.html.includes(hostile.name));
    assert.ok(!email.html.includes(hostile.mobileNumber));
    assert.ok(!email.html.includes(hostile.message));
    assert.ok(!email.html.includes("<script>") && !email.html.includes("<img src=x") && !email.html.includes('<a href="javascript:'));
  }
  assert.ok(sent[0].html.includes("&lt;script&gt;"));
  assert.ok(sent[0].html.includes("&lt;img"));
  assert.ok(sent[0].html.includes("&amp;") && sent[0].html.includes("&quot;") && sent[0].html.includes("&#39;"));
  assert.ok(sent[0].text.includes(hostile.message), "Escape the HTML view, preserving the original plain-text message");
}
{
  const { handler, sent } = harness();
  assert.equal((await handler(request({ ...valid, name: "Ada\r\nDeveloper" }))).status, 200);
  assert.ok(!/[\r\n]/.test(sent[0].subject), "User-supplied line breaks cannot become subject headers");
}

console.log("Contact checks passed: normalized and bounded input, malformed JSON, missing credentials, mocked delivery success/failure, acknowledgement recovery, reply-to and HTML escaping. No real email was sent.");
