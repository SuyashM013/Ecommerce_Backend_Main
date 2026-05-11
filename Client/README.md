# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
Ecommerce/
│
├── client/                         # Frontend (React / Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CartItem.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Orders.jsx
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
│
├── server/                         # Backend (Node + Express)
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── user_controller.js
│   │   ├── product_controller.js
│   │   ├── cart_controller.js
│   │   ├── order_controller.js
│   │   └── payment_controller.js
│   │
│   ├── middlewares/
│   │   ├── auth_middleware.js
│   │   ├── error_middleware.js
│   │   └── upload_middleware.js
│   │
│   ├── models/
│   │   ├── user_model.js
│   │   ├── product_model.js
│   │   ├── cart_model.js
│   │   ├── order_model.js
│   │   └── payment_model.js
│   │
│   ├── routes/
│   │   ├── user_routes.js
│   │   ├── product_routes.js
│   │   ├── cart_routes.js
│   │   ├── order_routes.js
│   │   └── payment_routes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sendResponse.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md

```