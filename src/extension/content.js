function scrapeProfileData() {
    const name = document.querySelector(".pv-text-details__left-panel h1")?.innerText?.trim();
    const headline = document.querySelector(".pv-text-details__left-panel .text-body-medium")?.innerText?.trim();
    const about = document.querySelector(".inline-show-more-text")?.innerText?.trim();
    const location = document.querySelector(".pv-text-details__left-panel .text-body-small")?.innerText?.trim();

    return { name, headline, about, location, url: window.location.href };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SCRAPE_NOW") {
        const profile = scrapeProfileData();
        sendResponse(profile);
    }

    if (msg.type === "LIKE_POST") {
        const likeBtn = document.querySelector("button[aria-label*='Like']");
        if (likeBtn) {
            likeBtn.click();
            sendResponse({ ok: true });
        } else {
            sendResponse({ ok: false, error: "Like button not found" });
        }
    }

    if (msg.type === "COMMENT") {
        let box = document.querySelector("div.comments-comment-box__content-editable");
        if (box) {
            box.innerText = msg.text;
            // Simulate input event
            box.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                document.querySelector("button.comments-comment-box__submit-button")?.click();
                sendResponse({ ok: true });
            }, 500);
        } else {
            sendResponse({ ok: false, error: "Comment box not found" });
        }
    }
    return true; // Keep channel open
});
