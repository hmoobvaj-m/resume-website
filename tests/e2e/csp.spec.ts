import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

const UNAUTHORIZED_ORIGIN = "https://unauthorized.example.invalid";
const UNAUTHORIZED_SCRIPT = `${UNAUTHORIZED_ORIGIN}/script.js`;

type CSPViolation = {
    effectiveDirective: string;
    blockedURI: string;
    disposition: string;
};

declare global {
    interface Window {
        cspViolations?: CSPViolation[];
    }
}

test.use({
    bypassCSP: false,
    serviceWorkers: "block",
});

async function monitorViolations(page: Page) {
    await page.addInitScript(() => {
        const violations: CSPViolation[] = [];

        window.cspViolations = violations;

        document.addEventListener("securitypolicyviolation", (event) => {
            violations.push({
                effectiveDirective: event.effectiveDirective,
                blockedURI: event.blockedURI,
                disposition: event.disposition,
            });
        });
    });
}

async function getViolations(page: Page) {
    return page.evaluate(() => {
        if (!window.cspViolations) throw new Error("CSP violation monitor is not initialized.");

        return window.cspViolations;
    });
}

async function expectPolicy(page: Page) {
    const policy = page.locator('head meta[http-equiv="Content-Security-Policy"]');

    await expect(policy).toHaveCount(1);
    await expect(policy).toHaveAttribute("content", /script-src-attr 'none'/);
}

test("legitimate application interactions produce no CSP violations", async ({ page }) => {
    await monitorViolations(page);

    await page.goto("/");

    await expectPolicy(page);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.getByRole("link", { name: "View Resume", exact: true }).click();

    const dialog = page.getByRole("dialog", { name: "Resume", exact: true });

    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", { name: "Close dialog" }).click();

    await expect(dialog).not.toBeVisible();

    expect(await getViolations(page)).toEqual([]);

    await page.goto("/resume");

    await expectPolicy(page);

    await expect(
        page.getByRole("heading", { name: "Education", exact: true })
    ).toBeVisible();

    expect(await getViolations(page)).toEqual([]);
});

test("CSP blocks unauthorized inline JavaScript", async ({ page }) => {
    await monitorViolations(page);

    await page.goto("/");

    await expectPolicy(page);

    await page.evaluate(() => {
        const script = document.createElement("script");

        script.textContent = "document.documentElement.dataset.cspProbe = 'executed'";

        document.head.appendChild(script);
    });

    await expect.poll(() => getViolations(page)).toContainEqual({
        effectiveDirective: "script-src-elem",
        blockedURI: "inline",
        disposition: "enforce",
    });

    await expect(page.locator("html")).not.toHaveAttribute(
        "data-csp-probe",
        "executed"
    );
});

test("CSP blocks unauthorized external JavaScript", async ({ page }) => {
    await monitorViolations(page);

    let requests = 0;

    await page.route(UNAUTHORIZED_SCRIPT, async (route) => {
        requests++;

        await route.fulfill({
            status: 200,
            contentType: "application/javascript",
            body: "document.documentElement.dataset.cspProbe = 'executed'",
        });
    });

    await page.goto("/");

    await expectPolicy(page);

    await page.evaluate((source) => {
        const script = document.createElement("script");

        script.src = source;

        document.head.appendChild(script);
    }, UNAUTHORIZED_SCRIPT);

    await expect.poll(() => getViolations(page)).toContainEqual(
        expect.objectContaining({
            effectiveDirective: "script-src-elem",
            blockedURI: expect.stringContaining(UNAUTHORIZED_ORIGIN),
            disposition: "enforce",
        })
    );

    await expect(page.locator("html")).not.toHaveAttribute(
        "data-csp-probe",
        "executed"
    );

    expect(requests).toBe(0);
});