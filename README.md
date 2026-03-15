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
EMAIL_USER='test@gmail.com'
APP_KEY='1111 2222 3333 4444'
JWT_SECRET="key"
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CURRENCY=egp
STRIPE_SUCCESS_URL=http://localhost:5000/payment/success
STRIPE_CANCEL_URL=http://localhost:5000/payment/cancel
```

3. Run the app:

```bash
npm start
```

## Project Structure

- `Database/` - database connection logic (`connect_db.js`).
- `Modules/` - route handlers / business logic per domain (e.g. `auth`, `products`) / Mongoose models (e.g. `User`, `Product`, `Order`).
- `Middleware/` - custom Express middleware (e.g. auth, error handling).
- `index.js` - application entry point.
