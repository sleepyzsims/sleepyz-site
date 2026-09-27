const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ccDir = path.join(__dirname, '..', '..', 'content', 'cc');

const START_ORDER = 370;

const files = fs
  .readdirSync(ccDir)
  .filter(file => file.toLowerCase().endsWith('.json'));

const entries = files.map(file => {
  const filePath = path.join(ccDir, file);
  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  return {
    file,
    filePath,
    data
  };
});

// Find the highest existing _order.
let highestOrder = START_ORDER - 1;

for (const entry of entries) {
  if (
    typeof entry.data._order === 'number' &&
    Number.isFinite(entry.data._order)
  ) {
    highestOrder = Math.max(
      highestOrder,
      entry.data._order
    );
  }
}

// Find entries that do not have an _order yet.
const missingOrder = entries.filter(entry =>
  typeof entry.data._order !== 'number'
);

// Determine when each new file was committed.
// This lets the one-time cleanup preserve the order
// in which newer CC was added.
function commitTimestamp(file) {
  try {
    const timestamp = execFileSync(
      'git',
      [
        'log',
        '-1',
        '--format=%ct',
        '--',
        `content/cc/${file}`
      ],
      { encoding: 'utf8' }
    ).trim();

    const number = Number(timestamp);

    return Number.isFinite(number)
      ? number
      : 0;
  } catch {
    return 0;
  }
}

missingOrder.sort((a, b) => {
  const aTime = commitTimestamp(a.file);
  const bTime = commitTimestamp(b.file);

  if (aTime !== bTime) {
    return aTime - bTime;
  }

  return a.file.localeCompare(b.file);
});

// Assign the next available number to each new entry.
for (const entry of missingOrder) {
  highestOrder += 1;

  entry.data._order = highestOrder;

  fs.writeFileSync(
    entry.filePath,
    JSON.stringify(entry.data, null, 2) + '\n'
  );

  console.log(
    `Assigned _order ${highestOrder} to ${entry.data.name || entry.file}`
  );
}

console.log(
  `Processed ${missingOrder.length} CC entries without _order.`
);
