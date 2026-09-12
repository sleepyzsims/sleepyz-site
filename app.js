const state = {
  age: 'all',
  item: 'all',
  type: 'all',
  hair: []
};

// Keep the built-in labels here. If you add a new category in the CMS config,
// the public filter will also discover any option that appears in the catalog.
const labels = {
  age: {
    adult: 'Adult',
    child: 'Child',
    toddler: 'Toddler',
    infant: 'Infant'
  },
  item: {
    hair: 'Hair',
    clothes: 'Clothes',
    shoes: 'Shoes',
    accessory: 'Accessory'
  },
  type: {
    conversion: 'Conversion',
    new: 'New Mesh',
    recolor: 'Recolor'
  },
  hair: {
    straight: 'Straight',
    'curly/wavy': 'Curly/Wavy',
    updo: 'Updo',
    'braids/twists': 'Braids/Twists'
  }
};

function norm(v) {
  return String(v ?? '').toLowerCase().trim();
}

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v === undefined || v === null || v === '') return [];
  return [v];
}

function labelFor(group, value) {
  const key = norm(value);
  return labels[group]?.[key] || String(value);
}

function filterValues(group) {
  const found = [];

  const add = v => {
    const k = norm(v);
    if (k && !found.includes(k)) found.push(k);
  };

  (window.catalog || []).forEach(item => {
    const values =
      group === 'item'
        ? asArray(item.item)
        : group === 'age'
          ? asArray(item.ages)
          : group === 'type'
            ? asArray(item.types)
            : asArray(item.hair_type);

    values.forEach(add);
  });

  Object.keys(labels[group] || {}).forEach(add);

  return found;
}

function makeFilterRow(key, container) {
  const row = document.createElement('div');
  row.className = 'filter-row';

  const label = document.createElement('div');
  label.className = 'filter-label';
  label.textContent =
    key === 'hair'
      ? 'Hair Type'
      : key[0].toUpperCase() + key.slice(1);

  row.append(label);

  const all = document.createElement('button');
  all.className = 'filter-btn';

  if (
    key === 'hair'
      ? state.hair.length === 0
      : state[key] === 'all'
  ) {
    all.classList.add('selected');
  }

  all.textContent = 'All';

  all.onclick = () => {
    if (key === 'hair') {
      state.hair = [];
    } else {
      state[key] = 'all';
    }

    render();
    rebuildFilters();
  };

  row.append(all);

  filterValues(key).forEach(value => {
    const b = document.createElement('button');
    b.className = 'filter-btn';

    if (key === 'hair') {
      if (state.hair.includes(value)) {
        b.classList.add('selected');
      }

      b.onclick = () => {
        if (state.hair.includes(value)) {
          state.hair = state.hair.filter(x => x !== value);
        } else {
          state.hair.push(value);
        }

        render();
        rebuildFilters();
      };
    } else {
      if (state[key] === value) {
        b.classList.add('selected');
      }

      b.onclick = () => {
        state[key] = value;

        render();
        rebuildFilters();
      };
    }

    b.textContent = labelFor(key, value);
    row.append(b);
  });

  container.append(row);
}

function rebuildFilters() {
  const box = document.querySelector('#filters');

  if (!box) return;

  box.innerHTML = '';

  ['age', 'item', 'type', 'hair'].forEach(k =>
    makeFilterRow(k, box)
  );
}

function titleLines(element, text) {
  element.innerHTML = '';

  const words = String(text || 'Untitled')
    .trim()
    .split(/\s+/);

  if (words.length <= 1) {
    element.textContent = text || 'Untitled';
    return;
  }

  const measure = document.createElement('span');
  measure.className = 'title-measure';
  element.append(measure);

  const width = element.clientWidth;

  const lines = [];
  let current = '';

  words.forEach(word => {
    const candidate = current
      ? current + ' ' + word
      : word;

    measure.textContent = candidate;

    if (current && measure.scrollWidth > width) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) lines.push(current);

  measure.remove();

  lines.forEach((line, i) => {
    const span = document.createElement('span');

    span.className =
      'title-line ' +
      (i % 2 ? 'purple' : 'gold');

    span.textContent = line;

    element.append(span);
  });
}

function card(item) {
  const c = document.createElement('article');
  c.className = 'card';

  const img = document.createElement('img');
  img.className = 'thumb';
  img.loading = 'lazy';
  img.src = item.image || '';
  img.alt = item.name || '';

  c.append(img);

  const h = document.createElement('div');
  h.className = 'card-title';

  c.append(h);

  titleLines(h, item.name);

  if (item.description) {
    const d = document.createElement('div');
    d.className = 'description';
    d.textContent = item.description;

    c.append(d);
  }

  const tags = document.createElement('div');
  tags.className = 'meta';

  asArray(item.ages)
    .filter(Boolean)
    .forEach(x => {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = labelFor('age', x);

      tags.append(t);
    });

  asArray(item.item)
    .filter(Boolean)
    .forEach(x => {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = labelFor('item', x);

      tags.append(t);
    });

  asArray(item.types)
    .filter(Boolean)
    .forEach(x => {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = labelFor('type', x);

      tags.append(t);
    });

  asArray(item.hair_type)
    .filter(Boolean)
    .forEach(x => {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = labelFor('hair', x);

      tags.append(t);
    });

  c.append(tags);

  const cr = document.createElement('div');
  cr.className = 'credit';

  if (item.creator) {
    cr.textContent = 'Original Creator: ';

    if (item.creator_url) {
      const a = document.createElement('a');

      a.href = item.creator_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = item.creator;

      cr.append(a);
    } else {
      cr.append(
        document.createTextNode(item.creator)
      );
    }
  }

  c.append(cr);

  if (item.download) {
    const a = document.createElement('a');

    a.className = 'download';
    a.href = item.download;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = 'Download';

    c.append(a);
  }

  return c;
}

async function load() {
  const r = await fetch(
    '/content/cc.json?' + Date.now()
  );

  const data = await r.json();

  window.catalog = data.items || [];

  rebuildFilters();
  render();
}

function render() {
  const root = document.querySelector('#catalog');

  if (!root) return;

  const f = window.catalog || [];

  const shown = f.filter(x =>
    (
      state.age === 'all' ||
      asArray(x.ages)
        .map(norm)
        .includes(norm(state.age))
    ) &&
    (
      state.item === 'all' ||
      asArray(x.item)
        .map(norm)
        .includes(norm(state.item))
    ) &&
    (
      state.type === 'all' ||
      asArray(x.types)
        .map(norm)
        .includes(norm(state.type))
    ) &&
    (
      state.hair.length === 0 ||
      state.hair.every(selected =>
        asArray(x.hair_type)
          .map(norm)
          .includes(norm(selected))
      )
    )
  );

  root.innerHTML = '';

  if (!shown.length) {
    root.innerHTML =
      '<div class="empty">No CC matches those filters.</div>';

    return;
  }

  shown.forEach(x => root.append(card(x)));
}

async function loadResources() {
  const root = document.querySelector('#resources');

  if (!root) return;

  const r = await fetch(
    '/content/resources.json?' + Date.now()
  );

  const data = await r.json();

  root.innerHTML = '';

  (data.items || []).forEach(x => {
    const a = document.createElement('article');
    a.className = 'resource';

    if (x.image) {
      const im = document.createElement('img');

      im.src = x.image;
      im.alt = '';

      a.append(im);
    }

    const h = document.createElement('h2');
    h.textContent = x.name;

    a.append(h);

    if (x.description) {
      const p = document.createElement('p');
      p.textContent = x.description;

      a.append(p);
    }

    if (x.link) {
      const l = document.createElement('a');

      l.href = x.link;
      l.target = '_blank';
      l.rel = 'noopener';
      l.textContent = 'Visit';

      a.append(l);
    }

    root.append(a);
  });

  if (!data.items?.length) {
    root.innerHTML =
      '<div class="empty">Resources will be added here.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  load();
  loadResources();
});
