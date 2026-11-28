import { test, expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const LOCAL_ORIGIN = "http://127.0.0.1:4173";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TEST_TOKEN = "mock-turnstile-token";

const CONTACT_DATA = {
    name: "Test Visitor",
    email: "visitor@example.com",
    message: "This is an automated contact form regression test.",
};

type MockResponse = 200 | 429 | 503 | "network-error";

type ContactRequest = {
    method: string;
    contentType: string | undefined;
    body: unknown;
};

const turnstileMock = `
    (() => {
        const widgets = new Map();
        let nextId = 0;

        window.turnstile = {
            render(container, options) {
                const id = String(++nextId);
                const button = document.createElement("button");

                button.type = "button";
                button.textContent = "Complete security verification";

                button.addEventListener("click", () => {
                    button.disabled = true;
                    options.callback("${TEST_TOKEN}");
                });

                container.appendChild(button);
                widgets.set(id, button);

                return id;
            },

            reset(id) {
                const button = widgets.get(id);

                if (button) button.disabled = false;
            },

            remove(id) {
                widgets.get(id)?.remove();
                widgets.delete(id);
            },
        };
    })();
`;

test.use({ serviceWorkers: "block" });

async function mockContactServices(page: Page, response: MockResponse = 200) {
    const requests: ContactRequest[] = [];

    await page.context().route("**/*", async (route) => {
        const request = route.request();
        const url = new URL(request.url());

        if (url.href === TURNSTILE_SCRIPT) {
            await route.fulfill({
                status: 200,
                contentType: "application/javascript",
                body: turnstileMock,
            });

            return;
        }

        if (url.origin !== LOCAL_ORIGIN) {
            await route.abort("blockedbyclient");
            return;
        }

        if (url.pathname !== "/api/contact") {
            await route.continue();
            return;
        }

        requests.push({
            method: request.method(),
            contentType: request.headers()["content-type"],
            body: request.postDataJSON(),
        });

        if (response === "network-error") {
            await route.abort("failed");
            return;
        }

        await route.fulfill({
            status: response,
            json: { ok: response === 200 },
        });
    });

    return requests;
}

async function openContactDialog(page: Page) {
    await page.goto("/");

    await page.getByRole("button", { name: "Contact", exact: true }).click();

    const dialog = page.getByRole("dialog", { name: "Contact Me", exact: true });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Complete security verification" })).toBeVisible();

    return dialog;
}

async function fillContactForm(dialog: Locator) {
    await dialog.getByLabel("Name", { exact: true }).fill(CONTACT_DATA.name);
    await dialog.getByLabel("Email Address", { exact: true }).fill(CONTACT_DATA.email);
    await dialog.getByLabel("Message", { exact: true }).fill(CONTACT_DATA.message);
}

async function completeVerification(dialog: Locator) {
    await dialog.getByRole("button", { name: "Complete security verification" }).click();

    await expect(dialog.getByRole("button", { name: "Send Message", exact: true })).toBeEnabled();
}

async function expectVerificationReset(dialog: Locator) {
    await expect(dialog.getByRole("button", { name: "Send Message", exact: true })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: "Complete security verification" })).toBeEnabled();
}

test("contact form requires verification and valid input", async ({ page }) => {
    const requests = await mockContactServices(page);
    const dialog = await openContactDialog(page);
    const submit = dialog.getByRole("button", { name: "Send Message", exact: true });

    await fillContactForm(dialog);

    await expect(submit).toBeDisabled();

    await completeVerification(dialog);

    const email = dialog.getByLabel("Email Address", { exact: true });

    await email.fill("invalid-email");
    await submit.click();

    await expect(dialog.locator('input[name="email"]:invalid')).toBeVisible();
    await expect(email).toBeFocused();

    expect(requests).toHaveLength(0);
});

test("contact form submits the expected payload and resets after success", async ({ page }) => {
    const requests = await mockContactServices(page);
    const dialog = await openContactDialog(page);

    await fillContactForm(dialog);
    await completeVerification(dialog);

    await dialog.getByRole("button", { name: "Send Message", exact: true }).click();

    await expect(dialog.getByRole("status")).toHaveText(
        "Your message has been submitted successfully."
    );

    expect(requests).toEqual([
        {
            method: "POST",
            contentType: "application/json",
            body: {
                ...CONTACT_DATA,
                website: "",
                token: TEST_TOKEN,
            },
        },
    ]);

    await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue("");
    await expect(dialog.getByLabel("Email Address", { exact: true })).toHaveValue("");
    await expect(dialog.getByLabel("Message", { exact: true })).toHaveValue("");

    await expectVerificationReset(dialog);
});

const failureCases = [
    {
        name: "rate limiting",
        response: 429,
        message: "Too many requests. Please wait a minute before trying again.",
    },
    {
        name: "service unavailability",
        response: 503,
        message: "Your message could not be submitted. Please retry or use LinkedIn.",
    },
    {
        name: "network failure",
        response: "network-error",
        message: "Submission could not be confirmed. Please try again later or use LinkedIn.",
    },
] satisfies {
    name: string;
    response: MockResponse;
    message: string;
}[];

for (const scenario of failureCases) {
    test(`contact form handles ${scenario.name}`, async ({ page }) => {
        const requests = await mockContactServices(page, scenario.response);
        const dialog = await openContactDialog(page);

        await fillContactForm(dialog);
        await completeVerification(dialog);

        await dialog.getByRole("button", { name: "Send Message", exact: true }).click();

        await expect(dialog.getByRole("alert")).toHaveText(scenario.message);

        expect(requests).toHaveLength(1);

        await expect(dialog.getByLabel("Name", { exact: true })).toHaveValue(CONTACT_DATA.name);
        await expect(dialog.getByLabel("Email Address", { exact: true })).toHaveValue(CONTACT_DATA.email);
        await expect(dialog.getByLabel("Message", { exact: true })).toHaveValue(CONTACT_DATA.message);

        await expectVerificationReset(dialog);
    });
}