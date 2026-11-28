import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    forbidOnly: Boolean(process.env.CI),
    retries: 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: "list",
    timeout: 30000,

    use: {
        baseURL,
        trace: "retain-on-failure",
        screenshot: "only-on-failure",
    },

    projects: [
        {
            name: "desktop-chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "mobile-chromium",
            use: { ...devices["Pixel 7"] },
        },
    ],

    webServer: {
        command: "pnpm serve:test",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 30000,
    },
});