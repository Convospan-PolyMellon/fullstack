const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'node_modules/@prisma/client/index.d.ts');
console.log('Checking Prisma client index:', mainPath);
console.log('Exists:', fs.existsSync(mainPath));

const indexJsPath = path.join(__dirname, 'node_modules/@prisma/client/index.js');
console.log('index.js exists:', fs.existsSync(indexJsPath));

try {
  const pkg = require.cache[require.resolve('@prisma/client')];
  console.log('module cache:', !!pkg);
} catch (e) {
  console.log('cache check error:', e.message);
}
