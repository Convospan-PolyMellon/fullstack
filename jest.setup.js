process.env.NODE_ENV = "test";

jest.setTimeout(30000);

// Silence noisy warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning|Deprecation/i.test(args[0] || "")) return;
  originalError(...args);
};

// Mock ESM packages safely
jest.unstable_mockModule("p-retry", () => ({
  default: async (fn, opts = {}) => {
    try { return await fn(); }
    catch (err) {
      if (opts.onFailedAttempt) {
        opts.onFailedAttempt({ attemptNumber: 1, retriesLeft: 0, error: err });
      }
      throw err;
    }
  },
}));
