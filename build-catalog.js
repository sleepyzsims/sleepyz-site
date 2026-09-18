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

  const aHasDate = Boolean(a.date_added);
  const bHasDate = Boolean(b.date_added);

  // New entries with a date go before the old entries.
  if (aHasDate && !bHasDate) return -1;
  if (!aHasDate && bHasDate) return 1;

  // Both new entries: newest first.
  if (aHasDate && bHasDate) {
    return String(b.date_added).localeCompare(
      String(a.date_added)
    );
  }

  // Old entries: preserve their original _order.
  const aOrder =
    typeof a._order === 'number'
      ? a._order
      : Number.MAX_SAFE_INTEGER;

  const bOrder =
    typeof b._order === 'number'
      ? b._order
      : Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return String(a.name || '').localeCompare(
    String(b.name || '')
  );
});

// Remove internal ordering fields from the public catalog.
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

console.log(`Built catalog from ${publicItems.length} CC files.`);