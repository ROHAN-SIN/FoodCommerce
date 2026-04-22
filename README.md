# 🍔 FoodHub - MERN Food Commerce App

A beginner-friendly MERN stack food ordering app built for learning and interviews.

## 🗂️ Project Structure

```
FoodHub/
├── backend/                   # Node.js + Express API
│   ├── server.js              # Entry point - starts the server
│   ├── .env                   # Environment variables (MongoDB URI, JWT secret)
│   └── src/
│       ├── app/app.js         # Express app setup, routes mounted here
│       ├── db/db.js           # MongoDB connection
│       ├── Models/            # Mongoose schemas
│       │   ├── user.model.js  # User (fullname, email, password, isAdmin)
│       │   ├── food.model.js  # Food item (name, price, category, inStock)
│       │   ├── cart.model.js  # User's cart (items array)
│       │   └── order.model.js # Order (items, total, status)
│       ├── routes/            # Express route handlers
│       │   ├── auth.routes.js   # POST /register, POST /login
│       │   ├── food.routes.js   # CRUD for foods (admin protected)
│       │   ├── cart.routes.js   # GET/POST cart
│       │   └── order.routes.js  # GET/POST orders, PATCH status
│       ├── Controller/
│       │   └── auth.controller.js  # Register & login logic
│       └── middleware/
│           └── auth.middleware.js  # JWT verification middleware
│
└── frontend/                  # React + Vite
    └── src/
        ├── main.jsx           # React entry point
        ├── App.jsx            # Routes setup
        ├── index.css          # All styles (no Bootstrap - custom CSS)
        ├── contexts/
        │   └── AuthContext.jsx  # Global auth state (token, user, login, logout)
        ├── components/          # Reusable UI pieces
        │   ├── Navbar.jsx       # Top navigation bar
        │   ├── Layout.jsx       # Wraps every page with Navbar + Footer
        │   ├── PrivateRoute.jsx # Protects routes that need login
        │   └── FoodCard.jsx     # Single food item card
        └── pages/               # One file per page/route
            ├── Home.jsx         # Landing page with hero section
            ├── FoodsPage.jsx    # Browse menu with category filter
            ├── CartPage.jsx     # View cart, adjust quantities, place order
            ├── OrdersPage.jsx   # User's order history
            ├── AdminPage.jsx    # Admin: add/edit/delete foods & manage orders
            ├── LoginPage.jsx    # Login form
            └── RegisterPage.jsx # Register form
```

## 🚀 How to Run

### 1. Start Backend
```bash
cd backend
# Create .env file with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/foodhub
# JWT_SECRET=supersecretkey
npm install
npm run dev
# Server runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## 👥 User Roles

### Regular User
- Browse food menu
- Filter by category (burger, pizza, sushi, etc.)
- Add food to cart
- Adjust quantities in cart
- Place orders
- View order history

### Admin User
- Everything a regular user can do
- Add new food items
- Edit existing food items
- Delete food items
- View ALL customer orders
- Update order status (pending → preparing → delivered)

**To make a user admin:** Manually set `isAdmin: true` in MongoDB for that user.

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | None | Create account |
| POST | /api/auth/login | None | Login, get JWT token |
| GET | /api/auth/me | JWT | Get logged-in user info |
| GET | /api/foods | None | Get all foods (filter by ?category=) |
| POST | /api/foods | Admin | Add new food |
| PUT | /api/foods/:id | Admin | Update food |
| DELETE | /api/foods/:id | Admin | Delete food |
| GET | /api/cart | JWT | Get user's cart |
| POST | /api/cart | JWT | Save/replace cart |
| GET | /api/orders | JWT | Get orders (admin = all) |
| POST | /api/orders | JWT | Place new order |
| PATCH | /api/orders/:id/status | Admin | Update order status |

## 🐛 Bugs Fixed from Original
1. **Order never saved** - `order.save()` was missing the `await`
2. **Category names** - Updated from fruit/vegetable/meat to burger/pizza/sushi/etc.
3. **Cart not clearing after order** - Now clears both localStorage and DB cart
4. **No vite proxy** - Added proxy so `/api` calls go to backend automatically
