let USER_TOKEN = null;
let API_URL = "http://localhost:3000/api/extension";

chrome.runtime.onInstalled.addListener(() => {
    console.log("ConvoSpan LinkedIn Extension Installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "SET_TOKEN") {
        USER_TOKEN = msg.token;
        chrome.storage.local.set({ userToken: msg.token }, () => {
            sendResponse({ ok: true });
        });
        return true; // Keep channel open for async response
    }

    if (msg.type === "GET_TOKEN") {
        chrome.storage.local.get("userToken", (data) => {
            USER_TOKEN = data.userToken;
            sendResponse({ token: USER_TOKEN });
        });
        return true;
    }

    if (msg.type === "SCRAPE_PROFILE") {
        // Ensure token is loaded
        chrome.storage.local.get("userToken", async (data) => {
            const token = data.userToken || USER_TOKEN;
            if (!token) {
                sendResponse({ ok: false, error: "No token found" });
                return;
            }

            try {
                const response = await fetch(`${API_URL}/push`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    body: JSON.stringify(msg.data)
                });
                const result = await response.json();
                sendResponse(result);
            } catch (error) {
                sendResponse({ ok: false, error: error.message });
            }
        });
        return true;
    }

    if (msg.type === "EXEC_ACTION") {
        chrome.storage.local.get("userToken", async (data) => {
            const token = data.userToken || USER_TOKEN;
            try {
                const response = await fetch(`${API_URL}/action`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    },
                    body: JSON.stringify(msg.data)
                });
                const result = await response.json();
                sendResponse(result);
            } catch (error) {
                sendResponse({ ok: false, error: error.message });
            }
        });
        return true;
    }
});
