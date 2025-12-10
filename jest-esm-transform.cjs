const { transformSync } = require('@swc/core');

module.exports = {
  process(src, filename) {
    const { code } = transformSync(src, {
      filename,
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: filename.endsWith('.tsx'),
          decorators: true,
        },
        transform: {
          decoratorMetadata: true,
        },
      },
      module: {
        type: 'commonjs',
      },
    });

    return { code };
  },
};
