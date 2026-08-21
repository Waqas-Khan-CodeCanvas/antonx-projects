# Fetch & Axios Student Lab

Plain HTML/CSS/JS + Express API for teaching **fetch**, **axios**, HTTP methods, and **protected routes**.

## Quick start

```bash
npm install
npm start
```

Open **http://localhost:3000** (recommended — same server for CSS, pages, and API).

| Script | Purpose |
|--------|---------|
| `npm start` | Run the server |
| `npm run dev` | Auto-restart on file changes (`node --watch`) |

**Do not rely on Live Server alone.** If you only open `frontend/index.html` on port 5500, styles worked after relative-path fixes, but you still need `npm start` so API calls hit Express on port 3000 (`config.js` sets `API_BASE` automatically when not on port 3000).

## Lesson order

| # | Page | Time | Focus |
|---|------|------|--------|
| 1 | [/lessons/01-fetch-get.html](frontend/lessons/01-fetch-get.html) | ~25 min | GET, async/await, `res.ok`, `res.json()` |
| 2 | [/lessons/02-fetch-crud.html](frontend/lessons/02-fetch-crud.html) | ~35 min | POST / PUT / PATCH / DELETE with fetch |
| 3 | [/lessons/03-axios-crud.html](frontend/lessons/03-axios-crud.html) | ~25 min | Same CRUD with axios CDN |
| 4 | [/lessons/04-auth-protected.html](frontend/lessons/04-auth-protected.html) | ~35 min | Login, Bearer token, 401 vs 403 |
| ★ | [/playground.html](frontend/playground.html) | open | Free request builder (fetch \| axios) |

For every lesson: open **DevTools → Network → Fetch/XHR**.

## Demo accounts

| Username | Password | Role |
|----------|----------|------|
| `student` | `1234` | user |
| `admin` | `1234` | admin |

Tokens look like `token-1-user` or `token-2-admin` (teaching fakes, not JWT).

## API reference

All success bodies: `{ "data": ... }`  
All error bodies: `{ "error": "message" }`

### Public products

| Method | Path | Body |
|--------|------|------|
| GET | `/api/products` | — |
| GET | `/api/products/:id` | — |
| POST | `/api/products` | `{ "name": "Pen", "price": 2 }` |
| PUT | `/api/products/:id` | `{ "name": "Pen", "price": 3 }` |
| PATCH | `/api/products/:id` | `{ "price": 3 }` |
| DELETE | `/api/products/:id` | — |

### Auth & protected

| Method | Path | Auth | Body |
|--------|------|------|------|
| POST | `/api/auth/login` | public | `{ "username", "password" }` |
| GET | `/api/me` | Bearer | — |
| POST | `/api/orders` | Bearer | `{ "productId", "quantity" }` |
| GET | `/api/admin/stats` | Bearer + admin | — |
| GET | `/api/error` | public | always 500 |
| GET | `/api/health` | public | health check |

Header format:

```http
Authorization: Bearer token-1-user
```

Data is **in-memory** and resets when you restart the server. Requests are delayed ~300ms so loading UI is visible.

## fetch vs axios

| Topic | fetch | axios |
|-------|--------|--------|
| Availability | Built into the browser | CDN or npm |
| JSON body | `JSON.stringify` + `Content-Type` | Plain object |
| Parse response | `await res.json()` | `response.data` |
| HTTP 404 / 500 | Does **not** throw — check `res.ok` | Throws — use `try/catch` |
| Auth header | Manual on each call | Manual, defaults, or interceptors |

### Minimal examples

**fetch**

```js
const res = await fetch("/api/products");
if (!res.ok) throw new Error((await res.json()).error);
const { data } = await res.json();
```

**axios**

```js
const { data } = await axios.get("/api/products");
// data is already { data: [...] }
```

## Student exercises

1. With **fetch** only, render the product list into a `<ul>` on a blank page.
2. Build a form that **POSTs** a product and then reloads the list.
3. Delete a product by id, then confirm with GET list.
4. Repeat 1–3 using **axios**.
5. Login as `student`, save the token, call `/api/me`.
6. Call `/api/admin/stats` as student (expect **403**), then as admin (expect **200**).
7. Challenge: write a small helper `request(path, options)` that always checks `ok` for fetch.

## Teacher notes

- **Critical misconception:** students expect `fetch` to reject on 404. Lesson 1’s “missing id” button proves it does not.
- Demo **Network** tab: method, status, request headers, response JSON.
- Compare **401** (no/invalid token) vs **403** (valid token, wrong role).
- Tokens are intentionally simple so students can read `token-<id>-<role>` without JWT noise. Later you can swap for real JWT without changing the client “Bearer” pattern.
- Same origin: Express serves `frontend/` so beginners avoid CORS traps. `cors` is still enabled if they open HTML another way.

## Project layout

```text
├── package.json
├── README.md
├── backend/
│   ├── server.js
│   ├── data.js
│   ├── middleware/auth.js
│   └── routes/
│       ├── products.js
│       ├── auth.js
│       └── protected.js
└── frontend/
    ├── index.html
    ├── playground.html
    ├── css/styles.css
    ├── js/config.js
    └── lessons/
        ├── 01-fetch-get.html
        ├── 02-fetch-crud.html
        ├── 03-axios-crud.html
        └── 04-auth-protected.html
```

## License

MIT — free to use in classrooms.
