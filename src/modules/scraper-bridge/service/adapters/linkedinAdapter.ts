import { Page } from "puppeteer";
import { ScraperAdapter, LinkedInProfile } from "../../types/scraper.types";

class LinkedInAdapter implements ScraperAdapter {
    validate(url: string): boolean {
        return url.includes("linkedin.com/in/");
    }

    async scrape(url: string, page: Page): Promise<LinkedInProfile> {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        // Wait for profile to load
        // Note: LinkedIn scraping is hard without login. This is a best-effort structure.
        // In a real scenario, we'd need cookies or a login flow.
        // We'll try to wait for something generic or just proceed.
        try {
            await page.waitForSelector("h1", { timeout: 5000 });
        } catch (e) {
            // Ignore timeout, might be a different page structure or login wall
        }

        const profile: LinkedInProfile = {
            name: "",
            headline: "",
            location: "",
            about: "",
            experience: [],
            education: [],
            skills: [],
            connections: "",
        };

        // Extract name
        try {
            profile.name = await page.$eval("h1", (el) => el.textContent?.trim() || "");
        } catch (e) {
            // console.error("Failed to extract name");
        }

        // Extract headline
        try {
            profile.headline = await page.$eval(
                ".text-body-medium",
                (el) => el.textContent?.trim() || ""
            );
        } catch (e) {
            // console.error("Failed to extract headline");
        }

        // Extract location
        try {
            profile.location = await page.$eval(
                ".text-body-small.inline",
                (el) => el.textContent?.trim() || ""
            );
        } catch (e) {
            // console.error("Failed to extract location");
        }

        // Extract about section
        try {
            const aboutSection = await page.$(".pv-about-section");
            if (aboutSection) {
                profile.about = await aboutSection.$eval(
                    ".pv-about__summary-text",
                    (el) => el.textContent?.trim() || ""
                );
            }
        } catch (e) {
            // console.error("Failed to extract about");
        }

        // Extract experience
        try {
            const experienceItems = await page.$$(".pv-profile-section__list-item");
            for (const item of experienceItems.slice(0, 5)) {
                const title = await item.$eval("h3", (el) => el.textContent?.trim() || "").catch(() => "");
                const company = await item.$eval(".pv-entity__secondary-title", (el) => el.textContent?.trim() || "").catch(() => "");
                const duration = await item.$eval(".pv-entity__date-range", (el) => el.textContent?.trim() || "").catch(() => "");

                if (title) {
                    profile.experience.push({
                        title,
                        company,
                        duration,
                        description: "",
                    });
                }
            }
        } catch (e) {
            // console.error("Failed to extract experience");
        }

        // Extract skills
        try {
            const skillElements = await page.$$(".pv-skill-category-entity__name");
            for (const el of skillElements.slice(0, 10)) {
                const skill = await el.evaluate((node) => node.textContent?.trim() || "");
                if (skill) profile.skills.push(skill);
            }
        } catch (e) {
            // console.error("Failed to extract skills");
        }

        return profile;
    }
}

export const linkedinAdapter = new LinkedInAdapter();
