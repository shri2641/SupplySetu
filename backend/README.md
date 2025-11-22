# SupplySetu Backend (Express + MongoDB)

## Quick start

```bash
cd backend
npm install
cp env.example .env   # set real secrets here
npm run dev           # nodemon
# or
npm start
```

By default the API listens on `http://localhost:5002`.

## Environment variables

| Name | Description | Default |
| --- | --- | --- |
| `PORT` | Port for the Express server | `5002` |
| `MONGODB_URI` | Connection string for MongoDB | `mongodb://127.0.0.1:27017/supplysetu` |
| `JWT_SECRET` | Secret key for signing auth tokens | `dev_only_change_me` |
| `CORS_ORIGIN` | Comma separated list of allowed origins | `http://localhost:3000` |

You can duplicate `env.example` to `.env` to get started.

## API overview

- `GET /health` – health probe
- `GET /api/suppliers` – list suppliers with optional `location` & `pincode` filters
- `GET /api/suppliers/:id` – fetch supplier details
- `POST /api/suppliers` – create supplier `{ name, location, rating?, pincode?, phone?, specialties? }`
- `DELETE /api/suppliers/:id` – delete supplier
- `GET /api/vendors` – list vendors
- `POST /api/vendors` – create vendor `{ name, location, phone, groupBuy }`
- `POST /api/auth/register` – register vendor/supplier users
- `POST /api/auth/login` – authenticate and receive JWT
- `POST /api/auth/logout` – revoke session (requires `Authorization: Bearer <token>`)
- `POST /api/demo-seed` – seed demo data for local development

## Development tips

- Run `npm run dev` during development for auto-reload.
- Use `npm run dev && npm start` from the frontend root (with a tool like `concurrently`) to launch both apps if needed.
- Use the demo seed endpoint to quickly repopulate the database when testing.