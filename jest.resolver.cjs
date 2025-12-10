// ✅ Jest 30+ compatible custom resolver
let defaultResolver;

// Try both modern (Jest 30+) and legacy paths for safety
try {
  // Jest 30+ (ESM default)
  defaultResolver = require('jest-resolve').defaultResolver;
} catch {
  // Older versions fallback
  defaultResolver = require('jest-resolve/build/defaultResolver').default;
}

module.exports = (request, options) => {
  // Handle ESM packages that need import conditions
  if (request.endsWith('.js')) {
    try {
      return defaultResolver(request, {
        ...options,
        conditions: ['import', 'require', 'default'],
      });
    } catch {
      return defaultResolver(request, options);
    }
  }

  return defaultResolver(request, options);
};
