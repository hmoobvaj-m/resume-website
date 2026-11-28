import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { applyContentSecurityPolicy } from "../../scripts/generate-csp.mjs";

function createHtml(head = "", body = "") {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">${head}</head><body>${body}</body></html>`;
}

function getHash(source) {
    return `'sha256-${createHash("sha256").update(source, "utf8").digest("base64")}'`;
}

function getDirective(policy, name) {
    return policy.split(";")
        .map((directive) => directive.trim())
        .find((directive) => directive.startsWith(`${name} `));
}

test("generates the correct SHA-256 hash for an inline script", () => {
    const result = applyContentSecurityPolicy(createHtml("<script>abc</script>"));

    assert.equal(result.hashCount, 1);
    assert.ok(result.policy.includes("'sha256-ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='"));
});

test("preserves script whitespace when generating hashes", () => {
    const source = "\n    console.log('example');\n";

    const result = applyContentSecurityPolicy(createHtml(`<script>${source}</script>`));

    assert.ok(result.policy.includes(getHash(source)));
    assert.notEqual(getHash(source), getHash(source.trim()));
});

test("normalizes HTML line endings consistently with browser parsing", () => {
    const source = "console.log('first');\r\nconsole.log('second');";

    const result = applyContentSecurityPolicy(createHtml(`<script>${source}</script>`));

    assert.ok(result.policy.includes(getHash(source.replaceAll("\r\n", "\n"))));
});

test("generates deterministic policies", () => {
    const html = createHtml(
        "<script>console.log('first')</script>",
        "<script>console.log('second')</script>"
    );

    assert.deepEqual(
        applyContentSecurityPolicy(html),
        applyContentSecurityPolicy(html)
    );
});

test("deduplicates identical inline scripts", () => {
    const script = "<script>console.log('duplicate')</script>";

    const result = applyContentSecurityPolicy(createHtml(script, script));

    assert.equal(result.hashCount, 1);
});

test("isolates document-specific script hashes", () => {
    const first = "console.log('first page')";
    const second = "console.log('second page')";

    const firstResult = applyContentSecurityPolicy(createHtml(`<script>${first}</script>`));
    const secondResult = applyContentSecurityPolicy(createHtml(`<script>${second}</script>`));

    assert.ok(firstResult.policy.includes(getHash(first)));
    assert.ok(!firstResult.policy.includes(getHash(second)));

    assert.ok(secondResult.policy.includes(getHash(second)));
    assert.ok(!secondResult.policy.includes(getHash(first)));
});

test("inserts the CSP immediately after the charset declaration", () => {
    const html = createHtml(
        '<link rel="preload" href="/example.js" as="script"><script>abc</script>'
    );

    const result = applyContentSecurityPolicy(html);

    const meta = `<meta http-equiv="Content-Security-Policy" content="${result.policy}">`;

    assert.ok(result.html.includes(`<meta charset="utf-8">${meta}`));
    assert.ok(result.html.indexOf(meta) < result.html.indexOf("<script>"));
});

test("preserves the original HTML apart from the inserted policy", () => {
    const html = createHtml(
        "<script>console.log('unchanged')</script>",
        '<main id="content">Example &amp; content</main>'
    );

    const result = applyContentSecurityPolicy(html);

    const meta = `<meta http-equiv="Content-Security-Policy" content="${result.policy}">`;

    assert.equal(result.html.replace(meta, ""), html);
});

test("does not permit unsafe inline JavaScript or unsafe evaluation", () => {
    const { policy } = applyContentSecurityPolicy(createHtml());

    const scriptDirective = getDirective(policy, "script-src");

    assert.ok(scriptDirective);
    assert.ok(!scriptDirective.includes("'unsafe-inline'"));
    assert.ok(!scriptDirective.includes("'unsafe-eval'"));

    assert.equal(getDirective(policy, "script-src-attr"), "script-src-attr 'none'");
});

test("contains the required resource restrictions", () => {
    const { policy } = applyContentSecurityPolicy(createHtml());

    const directives = [
        "default-src 'self'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
        "frame-src https://challenges.cloudflare.com",
        "connect-src 'self' https://challenges.cloudflare.com",
    ];

    for (const directive of directives) {
        assert.ok(policy.split(";").map((value) => value.trim()).includes(directive));
    }
});

test("accepts generated Next.js script paths", () => {
    const sources = [
        "/_next/static/chunks/example.js",
        "/_next/static/chunks/app/page.js",
        "/_next/static/chunks/turbopack-2u1d16houkiyo.js",
        "/_next/static/chunks/0cw5_5z13o-p4.js",
    ];

    for (const source of sources) {
        const result = applyContentSecurityPolicy(
            createHtml(`<script src="${source}"></script>`)
        );

        assert.equal(result.hashCount, 0);
    }
});

for (const source of [
    "https://example.com/script.js",
    "//example.com/script.js",
    "data:text/javascript,alert(1)",
    "/unexpected/script.js",
    "",
    "/_next/static/../example.js",
    "/_next/static/./example.js",
    "/_next/static/%2e%2e/example.js",
    "/_next/static/chunks%2fexample.js",
    "/_next/static/..\\example.js",
    "/_next/static//example.js",
    "/_next/static/example.js?v=1",
    "/_next/static/example.js#fragment",
    "/_next/static/example file.js",
    "/_next/static/example\t.js",
    "/_next/static/example.css",
    "/_next/static/example.js\n",
]) {
    test(`rejects unexpected external script source ${JSON.stringify(source)}`, () => {
        assert.throws(
            () => applyContentSecurityPolicy(
                createHtml(`<script src="${source}"></script>`)
            ),
            /Unexpected external script/
        );
    });
}

test("rejects duplicate CSP generation", () => {
    const result = applyContentSecurityPolicy(createHtml());

    assert.throws(
        () => applyContentSecurityPolicy(result.html),
        /Document already contains a CSP meta element/
    );
});

test("rejects existing report-only CSP meta elements", () => {
    assert.throws(
        () => applyContentSecurityPolicy(
            createHtml('<meta http-equiv="Content-Security-Policy-Report-Only" content="">')
        ),
        /Document already contains a CSP meta element/
    );
});

test("rejects base elements", () => {
    assert.throws(
        () => applyContentSecurityPolicy(createHtml('<base href="https://example.com/">')),
        /Base elements are prohibited/
    );
});

test("rejects inline event handlers", () => {
    assert.throws(
        () => applyContentSecurityPolicy(
            createHtml("", '<button onclick="alert(1)">Example</button>')
        ),
        /Inline event handler detected/
    );
});

test("rejects documents without an explicit head element", () => {
    assert.throws(
        () => applyContentSecurityPolicy("<html><body>Example</body></html>"),
        /Document does not contain an explicit head element/
    );
});

test("rejects documents without an initial UTF-8 charset declaration", () => {
    assert.throws(
        () => applyContentSecurityPolicy(
            "<html><head><title>Example</title></head><body></body></html>"
        ),
        /Expected a UTF-8 charset declaration/
    );
});