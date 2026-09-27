const fs = require('fs');
const path = require('path');

const ccDir = path.join(__dirname, 'content', 'cc');
const outputFile = path.join(__dirname, 'content', 'cc.json');

const files = fs
  .readdirSync(ccDir)
  .filter(file => file.toLowerCase().endsWith('.json'));

const items = files.map(file => {
  const filePath = path.join(ccDir, file);

  return JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );
});

items.sort((a, b) => {
  // "All in One Download" is always first.
  if (a.name === 'All in One Download') return -1;
  if (b.name === 'All in One Download') return 1;

  // Higher _order means newer.
  return b._order - a._order;
});

// Remove internal fields from the public catalog.
const publicItems = items.map(item => {
  const copy = { ...item };

  delete copy._order;
  delete copy.date_added;

  return copy;
});

fs.writeFileSync(
  outputFile,
  JSON.stringify({ items: publicItems }, null, 2) + '\n'
);

console.log(
  `Built catalog from ${publicItems.length} CC files.`
);
