const fs = require('fs');
const p = 'prisma/schema.prisma';
let b = fs.readFileSync(p);
let s = b.toString('utf8');
const matches = s.match(/""/g) || [];
const before = matches.length;
if (before === 0) {
  console.log('no double-quote sequences found');
  process.exit(0);
}
s = s.replace(/""/g, '"');
fs.writeFileSync(p, s, 'utf8');
console.log('replaced double-quotes count:', before);
