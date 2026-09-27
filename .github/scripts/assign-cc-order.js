const fs = require('fs');
const path = require('path');

const ccDir = path.join(__dirname, '..', '..', 'content', 'cc');

const files = fs
  .readdirSync(ccDir)
  .filter(file => file.toLowerCase().endsWith('.json'));

let maxOrder = 383;

// Find the highest existing numeric order.
for (const file of files) {
  const filePath = path.join(ccDir, file);

  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  if (
    typeof data._order === 'number' &&
    data._order > maxOrder
  ) {
    maxOrder = data._order;
  }
}

// Find entries that still need an order.
const unassigned = [];

for (const file of files) {
  const filePath = path.join(ccDir, file);

  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  if (typeof data._order !== 'number') {
    unassigned.push({
      file,
      filePath,
      data
    });
  }
}

// Give new entries the next available numbers.
unassigned.sort((a, b) =>
  a.file.localeCompare(b.file)
);

for (const entry of unassigned) {
  maxOrder += 1;

  entry.data._order = maxOrder;

  fs.writeFileSync(
    entry.filePath,
    JSON.stringify(entry.data, null, 2) + '\n'
  );

  console.log(
    `${entry.data.name} -> _order ${maxOrder}`
  );
}

if (unassigned.length === 0) {
  console.log('No CC entries need an _order.');
} else {
  console.log(
    `Assigned orders through ${maxOrder}.`
  );
}
