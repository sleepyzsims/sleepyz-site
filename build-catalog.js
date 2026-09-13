const fs = require('fs');
const path = require('path');

const ccDir = path.join(__dirname, 'content', 'cc');
const outputFile = path.join(__dirname, 'content', 'cc.json');

const files = fs
  .readdirSync(ccDir)
  .filter(file => file.toLowerCase().endsWith('.json'))
  .sort((a, b) => a.localeCompare(b));

const items = files.map(file => {
  const filePath = path.join(ccDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return data;
});

fs.writeFileSync(
  outputFile,
  JSON.stringify({ items }, null, 2) + '\n'
);

console.log(`Built catalog from ${items.length} CC files.`);
