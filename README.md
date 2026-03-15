# E-commerce Node.js + MongoDB API

An e-commerce API built with Node.js, Express, and MongoDB, featuring role-based access control, product management, shopping cart, orders, payments, reviews, and more.

## Features

### User Management
- User registration and authentication (JWT-based)
- Role-based authorization: Admin, Seller, Customer
- Email verification for accounts
- Profile management

### Product Management
- Sellers can create, update, and delete their products
- Product categories
- Product approval system (admins approve products before they become visible)
- Public product browsing with filtering (by category, price range, search)
- Product images and details

### Shopping Cart
- Customers can add/remove products from cart
- Quantity management
- Total price calculation

### Orders
- Customers can place orders from their cart
- Order status tracking
- Order history

### Payments
- Integration with Stripe for secure payments
- Payment processing for orders

### Reviews
- Customers can leave reviews on products
- Review management

### Promocodes
- Discount codes for orders
- Promocode validation and application

### Wishlist
- Customers can add products to wishlist
- Wishlist management

### Email Notifications
- Email templates for order status updates and other notifications
- SMTP integration with Nodemailer

## Constraints and Role-Based Permissions

### Admin
- Approve/reject products submitted by sellers
- View and manage all users
- Restrict/unrestrict user accounts
- View pending products
- Full access to user data

### Seller
- Create, update, and delete their own products
- View their own products
- Products require admin approval to be visible to customers

### Customer
- Browse approved products
- Add products to cart and manage cart
- Place orders and make payments
- Leave reviews on products
- Manage wishlist
- View order history

### General Constraints
- Only customers can access cart, orders, reviews, and wishlist features
- Only sellers can create products
- Only admins can approve products and manage users
- Unapproved products are not visible to customers
- Authentication required for most operations
- Email verification required for account activation

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Payments**: Stripe
- **Email**: Nodemailer
- **Logging**: Morgan
- **CORS**: Enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ecommerce-node-mongodb-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root with the following variables:
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

4. Start MongoDB service (if running locally):
```bash
# On Linux/Mac
sudo systemctl start mongod
# Or use brew services start mongodb/brew/mongodb-community
```

5. Run the application:
```bash
npm start
```

The server will start on `http://localhost:5000`

### Seeding Data (Optional)
To populate the database with sample users (admin, seller, customer), run the seed script:
```bash
node seed_data/seedUsers.js
```

Sample accounts:
- **Admin**: admin@test.com / password123
- **Seller**: seller@test.com / password123
- **Customer**: customer@test.com / password123

## Project Structure

- `Database/` - Database connection logic (`connect_db.js`) and models
- `Modules/` - Route handlers, business logic, and Mongoose models per domain (carts, categories, orders, payments, products, promocodes, reviews, users, wishList)
- `Middleware/` - Custom Express middleware (auth, error handling, validation)
- `Constants/` - Application constants (roles)
- `Email/` - Email templates and sending logic
- `seed_data/` - Database seeding scripts
- `index.js` - Application entry point

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/admin/signup` - Admin registration (requires admin token)

### Users
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /users` - List all users (admin only)
- `GET /users/:id` - Get user by ID (admin only)
- `PATCH /users/:id/restrict` - Restrict/unrestrict user (admin only)
- `DELETE /users/:id` - Delete user (admin only)

### Products
- `GET /products` - Get all approved products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (seller only)
- `PUT /products/:id` - Update product (seller only, own products)
- `DELETE /products/:id` - Delete product (seller only, own products)
- `GET /products/pending` - Get pending products (admin only)
- `PUT /products/:id/approve` - Approve product (admin only)
- `GET /products/my-products` - Get seller's products (seller only)

### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin only)
- `PUT /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Cart
- `POST /cart` - Add to cart (customer only)
- `GET /cart` - Get user cart (customer only)
- `DELETE /cart/:productId` - Remove from cart (customer only)
- `PUT /cart/decrease` - Decrease quantity (customer only)

### Orders
- `POST /orders` - Create order (customer only)
- `GET /orders` - Get user orders (customer only)
- `GET /orders/:id` - Get order by ID (customer only)
- `PUT /orders/:id/cancel` - Cancel order (customer only)

### Payments
- `POST /payments/create-payment-intent` - Create payment intent (customer only)

### Reviews
- `GET /reviews/:productId` - Get reviews for product
- `POST /reviews` - Create review (customer only)
- `PUT /reviews/:id` - Update review (customer only, own reviews)
- `DELETE /reviews/:id` - Delete review (customer only, own reviews)

### Promocodes
- `GET /promocodes` - Get all promocodes (admin only)
- `POST /promocodes` - Create promocode (admin only)
- `PUT /promocodes/:id` - Update promocode (admin only)
- `DELETE /promocodes/:id` - Delete promocode (admin only)

### Wishlist
- `POST /wishlist` - Add to wishlist (customer only)
- `GET /wishlist` - Get user wishlist (customer only)
- `DELETE /wishlist/:productId` - Remove from wishlist (customer only)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
