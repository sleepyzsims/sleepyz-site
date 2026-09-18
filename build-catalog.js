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

  const aHasOrder = typeof a._order === 'number';
  const bHasOrder = typeof b._order === 'number';

  // New entries without an _order go before existing entries.
  if (!aHasOrder && bHasOrder) return -1;
  if (aHasOrder && !bHasOrder) return 1;

  // Both are existing entries: preserve their original order.
  if (aHasOrder && bHasOrder) {
    return a._order - b._order;
  }

  // Both are new entries: alphabetical order.
  return String(a.name || '').localeCompare(
    String(b.name || '')
  );
});

// Remove the internal _order field from the public catalog.
const publicItems = items.map(item => {
  const copy = { ...item };
  delete copy._order;
  return copy;
});

fs.writeFileSync(
  outputFile,
  JSON.stringify({ items: publicItems }, null, 2) + '\n'
);

console.log(`Built catalog from ${publicItems.length} CC files.`);
