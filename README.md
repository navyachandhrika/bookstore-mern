# BookStore - MERN Stack Web Application

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/navyachandhrika/bookstore-mern)

A full-stack online bookstore built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). Features user authentication, book browsing with filters, a shopping cart, checkout, order management, reviews, and an admin dashboard.

---

## Features

- **User Authentication** - Register, login, JWT-based sessions
- **Book Browsing** - Search, filter by genre/author/language, sort, pagination
- **Book Details** - Cover art, descriptions, ratings, stock status
- **Reviews** - Submit and read community reviews with star ratings
- **Shopping Cart** - Add/remove/update quantities, real-time totals
- **Checkout** - Shipping address + simulated payment
- **Order History** - View past orders with expandable details
- **Admin Dashboard** - Add/edit/delete books, manage order statuses
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Dark Mode UI** - Premium glassmorphic design with animations

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router  |
| Backend    | Node.js, Express.js                         |
| Database   | MongoDB, Mongoose ODM                       |
| Auth       | JWT (jsonwebtoken), bcryptjs                |
| Validation | express-validator                           |
| HTTP       | Axios                                       |
| Icons      | react-icons (Feather Icons)                 |

---

## Project Structure

```
bookstore-mern/
├── package.json          # Root: concurrently runs client + server
├── server/               # Express.js Backend
│   ├── server.js         # Entry point
│   ├── models/           # Mongoose schemas (User, Book, Review, Cart, Order)
│   ├── controllers/      # Business logic
│   ├── routes/           # API routing
│   ├── middleware/        # Auth, admin, validation, error handler
│   └── seed.js           # Database seeder
└── client/               # React Frontend (Vite)
    ├── src/
    │   ├── components/   # Navbar, Footer, BookCard, Alert, StarRating
    │   ├── pages/        # Home, BookList, BookDetail, Cart, Checkout, Login, Register, Profile, AdminDashboard
    │   ├── context/      # AuthContext, CartContext
    │   └── services/     # Axios API layer
    └── public/covers/    # Book cover images
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local installation or MongoDB Atlas)

### 1. Clone & Install

```bash
cd bookstore-mern
npm run install-all
```

This installs dependencies in the root, server, and client directories.

### 2. Configure Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **Admin account**: `admin@bookstore.com` / `admin123`
- **Test user**: `jane@example.com` / `password123`
- **12 sample books** across multiple genres

### 4. Run the Application

```bash
npm run dev
```

This starts both the server (port 5000) and client (port 3000) concurrently.

Open **http://localhost:3000** in your browser.

---

## API Endpoints

### Authentication
| Method | Endpoint              | Access  | Description           |
|--------|----------------------|---------|----------------------|
| POST   | `/api/auth/register` | Public  | Register new user    |
| POST   | `/api/auth/login`    | Public  | Login & get JWT      |
| GET    | `/api/auth/me`       | Private | Get current user     |

### Books
| Method | Endpoint             | Access | Description                   |
|--------|---------------------|--------|-------------------------------|
| GET    | `/api/books`        | Public | List books (filter, search, paginate) |
| GET    | `/api/books/:id`    | Public | Get book details + reviews    |
| POST   | `/api/books`        | Admin  | Create a new book             |
| PUT    | `/api/books/:id`    | Admin  | Update a book                 |
| DELETE | `/api/books/:id`    | Admin  | Delete a book                 |

### Reviews
| Method | Endpoint                    | Access  | Description       |
|--------|----------------------------|---------|-------------------|
| GET    | `/api/books/:id/reviews`   | Public  | Get book reviews  |
| POST   | `/api/books/:id/reviews`   | Private | Add a review      |

### Cart
| Method | Endpoint              | Access  | Description          |
|--------|----------------------|---------|----------------------|
| GET    | `/api/cart`           | Private | Get user's cart      |
| POST   | `/api/cart`           | Private | Add item to cart     |
| PUT    | `/api/cart`           | Private | Update item quantity |
| DELETE | `/api/cart/:bookId`   | Private | Remove item          |
| DELETE | `/api/cart`           | Private | Clear cart           |

### Orders
| Method | Endpoint                  | Access  | Description            |
|--------|--------------------------|---------|------------------------|
| POST   | `/api/orders`            | Private | Place an order         |
| GET    | `/api/orders/my-orders`  | Private | Get user's orders      |
| GET    | `/api/orders`            | Admin   | Get all orders         |
| PUT    | `/api/orders/:id/status` | Admin   | Update order status    |

---

## Demo Accounts

| Role  | Email                  | Password    |
|-------|------------------------|-------------|
| Admin | admin@bookstore.com    | admin123    |
| User  | jane@example.com       | password123 |

---

## License

This project is built for educational and demonstration purposes.
