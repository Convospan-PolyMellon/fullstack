// import fetch from "node-fetch"; // Native fetch is available in Node 18+

const API_URL = "http://localhost:3000/api/extension";

async function testPush() {
    console.log("Testing /push...");
    try {
        const res = await fetch(`${API_URL}/push`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User",
                headline: "Software Engineer at TechCorp",
                url: "https://linkedin.com/in/testuser"
            })
        });
        const data = await res.json();
        console.log("Push Result:", data);
    } catch (e) {
        console.error("Push Failed:", e);
    }
}

async function testAction() {
    console.log("Testing /action (Mock)...");
    // We won't actually run Puppeteer here to avoid opening browsers during automated test, 
    // but we can check if the endpoint responds.
    // To fully test, we'd need a valid LinkedIn URL and environment.
    try {
        const res = await fetch(`${API_URL}/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "CONNECT",
                url: "https://linkedin.com/in/testuser"
            })
        });
        // Expecting it to try and fail or succeed depending on Puppeteer env
        // Since we are just testing the endpoint reachability:
        console.log("Action Endpoint Status:", res.status);
    } catch (e) {
        console.error("Action Failed:", e);
    }
}

async function main() {
    await testPush();
    // await testAction(); // Uncomment to test Puppeteer launch (will open browser)
}

main();
