import { BrowserEngine } from "@/lib/browser-engine";
import { Page } from "puppeteer";

interface LinkedInPayload {
    action: "LOGIN" | "VISIT_PROFILE" | "CONNECT" | "SCRAPE_INBOX";
    cookies?: any[]; // For now, we pass cookies directly. Real app might store in DB.
    profileUrl?: string;
    message?: string;
}

export async function handleLinkedInAction(payload: LinkedInPayload) {
    const engine = BrowserEngine.getInstance();
    let page: Page | null = null;
    let result: any = {};

    try {
        page = await engine.getPage();

        // 1. Authenticate
        if (payload.cookies) {
            await page.setCookie(...payload.cookies);
        } else {
            // Fallback: Check if we are already logged in via persistent context or error out
            throw new Error("No cookies provided for LinkedIn authentication");
        }

        // 2. Perform Action
        switch (payload.action) {
            case "LOGIN":
                await page.goto("https://www.linkedin.com/feed/", { waitUntil: "networkidle2" });
                const isLoggedIn = await page.$("input[role='combobox']"); // Search bar usually indicates login
                result = { status: isLoggedIn ? "success" : "failed" };
                break;

            case "VISIT_PROFILE":
                if (!payload.profileUrl) throw new Error("Profile URL required");
                await page.goto(payload.profileUrl, { waitUntil: "domcontentloaded" });
                await new Promise(r => setTimeout(r, 2000)); // Human delay

                // Basic scraping
                const name = await page.$eval("h1", (el) => el.textContent?.trim() || "Unknown");
                const description = await page.$eval(".text-body-medium.break-words", (el: any) => el.textContent?.trim() || "").catch(() => "");

                result = { name, description, url: payload.profileUrl };
                break;

            case "CONNECT":
                // Logic to click Connect -> Add Note -> Send
                // For safety in this demo, we'll just log
                console.log(`Simulating connection to ${payload.profileUrl}`);
                result = { status: "sent", message: payload.message };
                break;

            default:
                throw new Error("Unsupported LinkedIn action");
        }

        return result;

    } catch (error: any) {
        console.error("LinkedIn Action Error:", error);
        throw error;
    } finally {
        if (page) await page.close();
    }
}
