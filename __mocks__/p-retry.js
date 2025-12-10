// ✅ Mock for p-retry to bypass ESM import issues during Jest tests

const mockPRetry = async (fn, options = {}) => {
  try {
    return await fn();
  } catch (error) {
    if (options.onFailedAttempt) {
      options.onFailedAttempt({ attemptNumber: 1, retriesLeft: 0, error });
    }
    throw error;
  }
};

module.exports = mockPRetry;
module.exports.default = mockPRetry;
