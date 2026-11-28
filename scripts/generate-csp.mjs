import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "parse5";

const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
const STATIC_ASSET_PREFIX = "/_next/static/";

function* walkElements(node) {
    if (node.tagName) yield node;

    for (const child of node.childNodes ?? []) {
        yield* walkElements(child);
    }

    if (node.content) yield* walkElements(node.content);
}

function getAttribute(element, name) {
    return element.attrs?.find((attribute) => attribute.name === name)?.value;
}

function hashScript(source) {
    const hash = createHash("sha256").update(source, "utf8").digest("base64");

    return `'sha256-${hash}'`;
}

function generatePolicy(hashes) {
    return [
        "default-src 'self'",
        ["script-src", "'self'", TURNSTILE_ORIGIN, ...hashes].join(" "),
        "script-src-attr 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        `connect-src 'self' ${TURNSTILE_ORIGIN}`,
        `frame-src ${TURNSTILE_ORIGIN}`,
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'self'",
    ].join("; ") + ";";
}

function validateExternalScript(source) {
    const segments = source.slice(STATIC_ASSET_PREFIX.length).split("/");

    const validSegments = segments.every((segment) =>
        segment.length > 0 &&
        !segment.startsWith(".") &&
        !/[^A-Za-z0-9._-]/.test(segment)
    );

    if (!source.startsWith(STATIC_ASSET_PREFIX) || !source.endsWith(".js") || !validSegments) {
        throw new Error(`Unexpected external script: ${source}`);
    }
}

export function applyContentSecurityPolicy(html) {
    const document = parse(html, { sourceCodeLocationInfo: true });
    const elements = [...walkElements(document)];

    const head = elements.find((element) => element.tagName === "head");

    if (!head?.sourceCodeLocation?.startTag) {
        throw new Error("Document does not contain an explicit head element.");
    }

    const firstHeadElement = head.childNodes.find((node) => node.tagName);

    if (
        firstHeadElement?.tagName !== "meta" ||
        getAttribute(firstHeadElement, "charset")?.toLowerCase() !== "utf-8" ||
        !firstHeadElement.sourceCodeLocation
    ) {
        throw new Error("Expected a UTF-8 charset declaration before other head elements.");
    }

    const hashes = new Set();

    for (const element of elements) {
        if (element.tagName === "meta") {
            const directive = getAttribute(element, "http-equiv")?.toLowerCase();

            if (
                directive === "content-security-policy" ||
                directive === "content-security-policy-report-only"
            ) {
                throw new Error("Document already contains a CSP meta element.");
            }
        }

        if (element.tagName === "base") {
            throw new Error("Base elements are prohibited by the CSP.");
        }

        for (const attribute of element.attrs ?? []) {
            if (attribute.name.startsWith("on")) {
                throw new Error(`Inline event handler detected: ${attribute.name}`);
            }
        }

        if (element.tagName !== "script") continue;

        const source = getAttribute(element, "src");

        if (source !== undefined) {
            validateExternalScript(source);
            continue;
        }

        const script = (element.childNodes ?? [])
            .map((child) => child.value ?? "")
            .join("");

        hashes.add(hashScript(script));
    }

    const policy = generatePolicy([...hashes].sort());
    const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
    const insertionOffset = firstHeadElement.sourceCodeLocation.endOffset;

    return {
        html: html.slice(0, insertionOffset) + meta + html.slice(insertionOffset),
        policy,
        hashCount: hashes.size,
    };
}

function* findHtmlFiles(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);

        if (entry.isSymbolicLink()) {
            throw new Error(`Unexpected symbolic link: ${path}`);
        }

        if (entry.isDirectory()) {
            yield* findHtmlFiles(path);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            yield path;
        }
    }
}

function generatePolicies(directory) {
    const paths = [...findHtmlFiles(directory)].sort();

    if (paths.length === 0) {
        throw new Error("No exported HTML documents were found.");
    }

    const documents = paths.map((path) => ({
        path,
        ...applyContentSecurityPolicy(readFileSync(path, "utf8")),
    }));

    for (const document of documents) {
        writeFileSync(document.path, document.html, "utf8");

        console.log(
            `CSP generated: ${document.path} (${document.hashCount} unique script hashes)`
        );
    }

    console.log(`Generated CSP for ${documents.length} HTML documents.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        generatePolicies(resolve(process.argv[2] ?? "out"));
    } catch (error) {
        console.error(`CSP generation failed: ${error.message}`);
        process.exitCode = 1;
    }
}