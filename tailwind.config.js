/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                "neo": "var(--neo-shadow)",
                "neo-glow": "var(--neo-glow)",
            }
        },
    },
    plugins: [],
};
