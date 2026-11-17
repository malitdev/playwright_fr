// Minimal FakeStore API mock for CI (no dependencies). Run: node mock-api/server.js
// Seed data is read-only: POST/PUT/DELETE echo FakeStore-style responses without changing it,
// so parallel tests that use fixed ids (1) never interfere with each other.
const http = require('http');

const PORT = Number(process.env.MOCK_API_PORT || 3000);

const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];

const products = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Product ${i + 1}`,
  price: Number((10 + i * 7.5).toFixed(2)),
  description: `Description of product ${i + 1}`,
  category: categories[i % categories.length],
  image: `https://fakestoreapi.com/img/${i + 1}.jpg`,
  rating: { rate: 3.5, count: 100 + i },
}));

const users = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  email: `user${i + 1}@example.com`,
  username: i === 0 ? 'mor_2314' : `user_${i + 1}`,
  password: i === 0 ? '83r5^_' : `pass_${i + 1}`,
  name: { firstname: `First${i + 1}`, lastname: `Last${i + 1}` },
  address: {
    city: 'Kilcoole',
    street: 'New road',
    number: i + 1,
    zipcode: '12926-3874',
    geolocation: { lat: '-37.3159', long: '81.1496' },
  },
  phone: `1-570-236-700${i}`,
  __v: 0,
}));

const carts = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  userId: (i % 5) + 1,
  date: new Date(Date.UTC(2020, i, 3)).toISOString(),
  products: [
    { productId: i + 1, quantity: 2 },
    { productId: i + 2, quantity: 1 },
  ],
  __v: 0,
}));

const collections = { products, users, carts };

function send(res, status, body) {
  const isText = typeof body === 'string';
  res.writeHead(status, { 'Content-Type': isText ? 'text/plain' : 'application/json' });
  res.end(isText ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

function list(items, q) {
  let out = [...items];
  if (q.get('sort') === 'desc') out.sort((a, b) => b.id - a.id);
  else out.sort((a, b) => a.id - b.id);
  const limit = Number(q.get('limit'));
  if (limit > 0) out = out.slice(0, limit);
  return out;
}

let nextId = { products: 21, users: 11, carts: 8 };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const q = url.searchParams;
  const method = req.method;

  if (parts[0] === 'auth' && parts[1] === 'login' && method === 'POST') {
    const { username, password } = await readBody(req);
    const ok = users.some((u) => u.username === username && u.password === password);
    return ok ? send(res, 201, { token: `mock.${Buffer.from(String(username)).toString('base64')}.token` })
              : send(res, 401, 'username or password is incorrect');
  }

  const name = parts[0];
  const items = collections[name];
  if (!items) return send(res, 404, { error: 'Not found' });

  // /products/categories, /products/category/:c
  if (name === 'products' && method === 'GET') {
    if (parts[1] === 'categories') return send(res, 200, categories);
    if (parts[1] === 'category') {
      return send(res, 200, list(items.filter((p) => p.category === decodeURIComponent(parts[2] || '')), q));
    }
  }

  // /carts/user/:id
  if (name === 'carts' && parts[1] === 'user' && method === 'GET') {
    return send(res, 200, items.filter((c) => c.userId === Number(parts[2])));
  }

  const id = parts[1] !== undefined ? Number(parts[1]) : undefined;

  if (method === 'GET') {
    if (id === undefined) {
      let result = items;
      if (name === 'carts' && (q.get('startdate') || q.get('enddate'))) {
        const start = q.get('startdate') ? new Date(q.get('startdate')).getTime() : -Infinity;
        const end = q.get('enddate') ? new Date(q.get('enddate')).getTime() : Infinity;
        result = items.filter((c) => { const t = new Date(c.date).getTime(); return t >= start && t <= end; });
      }
      return send(res, 200, list(result, q));
    }
    const item = items.find((i) => i.id === id);
    return item ? send(res, 200, item) : send(res, 404, { error: 'Not found' });
  }

  if (method === 'POST') {
    const body = await readBody(req);
    const created = nextId[name]++;
    // Like FakeStore, a new user returns only its id
    return send(res, 201, name === 'users' ? { id: created } : { id: created, ...body });
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody(req);
    const existing = items.find((i) => i.id === id) || {};
    return send(res, 200, { ...existing, ...body, id });
  }

  if (method === 'DELETE') {
    const existing = items.find((i) => i.id === id);
    return send(res, 200, existing || { id });
  }

  return send(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`));
