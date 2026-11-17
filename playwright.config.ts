import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 30 * 1000, //30000 ms(30 secs)
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalSetup:"./utils/globalSetup.ts",
  reporter: [
    ["list"], // Detailed console output
    //['line'],                         // One-line progress output
    //['dot'],                          // Minimal console output
    ["html", { open: "never", outputFolder: "reports" }], // HTML Report
    //['json', { outputFile: 'reports/results.json' }], // JSON Report
    ["junit", { outputFile: "reports/results.xml" }], // JUnit XML Report
    ["./utils/CustomReporter.ts"], // Custom reporter
    ["allure-playwright", { outputFolder: "allure-results" }], // Allure Report
  ],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: false,
    viewport: null, // Use the full browser window (maximized, see launchOptions below)
    ignoreHTTPSErrors: true, // Ignore SSL errors if necessary
    permissions: ["geolocation"], // Set necessary permissions for geolocation-based tests
  },
  grep: /@master/,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: null, // Desktop Chrome sets a fixed viewport; null lets the window size apply
        deviceScaleFactor: undefined, // Not allowed together with viewport: null
        launchOptions: { args: ["--start-maximized"] }, // Maximize the browser
      },
    },
    /*
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
    */
  ],
});