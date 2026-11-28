import { test, expect } from "@playwright/test";

test("homepage renders without runtime or static asset errors", async ({ page }) => {
    const runtimeErrors: string[] = [];
    const assetErrors: string[] = [];

    page.on("pageerror", (error) => runtimeErrors.push(error.message));

    page.on("response", (response) => {
        const resourceType = response.request().resourceType();

        if (["script", "stylesheet"].includes(resourceType) && response.status() >= 400) {
            assetErrors.push(`${response.status()} ${response.url()}`);
        }
    });

    page.on("requestfailed", (request) => {
        if (["script", "stylesheet"].includes(request.resourceType())) {
            assetErrors.push(`${request.failure()?.errorText} ${request.url()}`);
        }
    });

    const response = await page.goto("/");

    expect(response?.status()).toBe(200);

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();

    expect(runtimeErrors).toEqual([]);
    expect(assetErrors).toEqual([]);
});

test("navigation links target existing homepage sections", async ({ page }) => {
    await page.goto("/");

    const navigation = page.getByRole("navigation", { name: "Main navigation" });

    const sections = [
        { label: "About", id: "about" },
        { label: "Experience", id: "resume" },
        { label: "Achievements", id: "achievements" },
        { label: "Projects", id: "projects" },
        { label: "Skills", id: "skills" },
    ];

    for (const section of sections) {
        const link = navigation.getByRole("link", { name: section.label, exact: true });

        await expect(link).toHaveAttribute("href", `#${section.id}`);
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${section.id}$`));
        await expect(page.locator(`#${section.id}`)).toBeVisible();
    }
});

test("homepage has no horizontal page overflow", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => { await document.fonts.ready; });

    const dimensions = await page.evaluate(() => ({
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});