import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Browser, Page } from "puppeteer";

puppeteer.use(StealthPlugin());

export class BrowserEngine {
    private static instance: BrowserEngine;
    private browser: Browser | null = null;

    private constructor() { }

    public static getInstance(): BrowserEngine {
        if (!BrowserEngine.instance) {
            BrowserEngine.instance = new BrowserEngine();
        }
        return BrowserEngine.instance;
    }

    /**
     * Launches or retrieves the existing browser instance.
     */
    public async getBrowser(): Promise<Browser> {
        if (!this.browser || !this.browser.isConnected()) {
            console.log("🚀 Launching new browser instance...");
            this.browser = await puppeteer.launch({
                headless: true, // Set to false for debugging
                args: [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-accelerated-2d-canvas",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                ],
            });

            // Handle disconnect
            this.browser.on("disconnected", () => {
                console.log("❌ Browser disconnected.");
                this.browser = null;
            });
        }
        return this.browser;
    }

    /**
     * Creates a new page and ensures context is clean.
     */
    public async getPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        // Anti-detection overrides (Double check, although stealth plugin handles most)
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => false,
            });
        });

        // Set viewport
        await page.setViewport({ width: 1366, height: 768 });

        return page;
    }

    /**
     * Closes the browser instance.
     */
    public async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
