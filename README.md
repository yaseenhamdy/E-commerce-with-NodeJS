# E-commerce Node.js + MongoDB API

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce_db
```

3. Run the app:

```bash
npm start
```

## Project Structure

- `Database/` - database connection logic (`connect_db.js`) and Mongoose models in `Database/Models/` (e.g. `User`, `Product`, `Order`).
- `Modules/` - route handlers / business logic per domain (e.g. `auth`, `products`).
- `Middleware/` - custom Express middleware (e.g. auth, error handling).
- `index.js` - application entry point.
