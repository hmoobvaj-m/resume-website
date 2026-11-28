import { test, expect } from "@playwright/test";

test("resume preview opens and closes correctly", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("link", { name: "View Resume", exact: true });

    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Resume", exact: true });

    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Education", exact: true })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Download PDF" })).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Full Page" })).toHaveAttribute("href", "/resume");

    await dialog.getByRole("button", { name: "Close dialog" }).click();

    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
});

test("dedicated resume page renders and supports navigation", async ({ page }) => {
    const response = await page.goto("/resume");

    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { name: "Resume", level: 1 })).toBeAttached();

    for (const section of ["Summary", "Education", "Work Experience", "Technical Projects", "Technical Skills"]) {
        await expect(page.getByRole("heading", { name: section, exact: true })).toBeVisible();
    }

    await expect(page.getByRole("link", { name: "Download PDF" })).toHaveAttribute("href", "/resume.pdf");

    await page.getByRole("link", { name: "Back to Home" }).click();

    await expect(page).toHaveURL("/");
});

test("resume PDF is valid and downloadable", async ({ page, request }) => {
    const response = await request.get("/resume.pdf");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");

    const body = await response.body();

    expect(body.subarray(0, 5).toString("ascii")).toBe("%PDF-");

    await page.goto("/resume");

    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("link", { name: "Download PDF" }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("resume.pdf");
    expect(await download.failure()).toBeNull();
});