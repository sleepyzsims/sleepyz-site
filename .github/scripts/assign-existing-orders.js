const fs = require('fs');
const path = require('path');

const ccDir = path.join(__dirname, '..', '..', 'content', 'cc');

const assignedOrders = {
  "Strawberry Shortcake Outfit": 370,
  "Orange Blossom Outfit": 371,
  "Angel Cake Outfits": 372,
  "Blueberry Muffin Outfit": 373,
  "Angel Hair": 374,
  "Izac Hair": 375,
  "Ginger Snap Outfit": 376,
  "Rainbow Sherbet Outfit": 377,
  "Tea Blossom Outfit": 378,
  "Huckleberry Pie Outfit": 379,
  "Apple Dumplin Dress": 380,
  "Malcolm Hair": 381,
  "Wolfgang Hair": 382,
  "Lapis Lazuli Hair": 383
};

const files = fs
  .readdirSync(ccDir)
  .filter(file => file.toLowerCase().endsWith('.json'));

for (const file of files) {
  const filePath = path.join(ccDir, file);

  const data = JSON.parse(
    fs.readFileSync(filePath, 'utf8')
  );

  const order = assignedOrders[data.name];

  if (order === undefined) {
    continue;
  }

  data._order = order;

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2) + '\n'
  );

  console.log(
    `${data.name} -> _order ${order}`
  );
}

console.log('Finished assigning existing CC orders.');
