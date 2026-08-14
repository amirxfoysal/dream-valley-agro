# Dream Valley Agro — 🌱 Online Plant Nursery

**Website:** [https://dreamvalleyagro.com](https://dreamvalleyagro.com)

Dream Valley Agro is a full-stack e-commerce platform for a plant nursery business in Bangladesh. It lets customers browse, order, and track plants, trees, and garden essentials online — in both **English** and **Bangla** — while giving the shop owner a complete admin panel to run daily operations.

---

## 🌿 About the Business

Dream Valley Agro started as a small family nursery with a simple belief: every home is brighter with plants. Today it delivers healthy, hand-picked greenery across Bangladesh — from fruit trees and flowering plants to medicinal herbs, gardening tools, pots, and organic fertilizers.

Every plant is nurtured with care and quality-checked before it reaches the customer's door, so it arrives healthy, vibrant, and ready to thrive.

- 🏡 **Indoor & outdoor plants** — ornamentals, flowers, bonsai
- 🍎 **Fruit & timber trees** — native and exotic varieties
- 🌾 **Vegetable, spice & medicinal plants**
- 🧪 **Organic fertilizers & pesticides**
- 🪴 **Pots, geo bags & gardening tools**
- 🚚 **Nationwide delivery** with cash on delivery
- 📞 **Plant care support** with every order

---

## ✨ Website Features

### Customer Experience

- **Bilingual interface (English / বাংলা)** — instant language switching across the entire site
- **Dark & light themes** — persisted user preference with a smooth transition
- **Animated hero banners** — auto-playing carousel showcasing curated collections
- **Category browsing** — every category gets its own section with product highlights
- **Explore by tree** — browse varieties grouped by tree type
- **Smart shop filters** — filter by category, subcategory, tree type, and search
- **Featured products** — hand-picked favorites with a dedicated view
- **Product details** — images, pricing, discounts, stock status, and plant care tips
- **Shopping cart** — persistent cart with quantity controls
- **Checkout with cash on delivery** — auto-filled delivery details from the customer profile
- **Order tracking** — live delivery status powered by SteadFast courier integration
- **User accounts** — email/password and Google sign-in via Firebase
- **Customer profile** — manage personal info, delivery address, and order history
- **Skeleton loading animations & responsive design** — polished experience on mobile, tablet, and desktop (2-column product grid on phones)

### Admin Panel

- **Dashboard** — revenue, order, and product statistics at a glance
- **Product management** — create, edit, delete, and feature products with bilingual content
- **Tree & category management** — organize varieties and subcategories shown on the storefront
- **Order management** — update order statuses through the fulfilment pipeline
- **Courier integration** — create SteadFast consignments and sync live delivery statuses
- **Customer directory** — registered customers with order history and spending insights
- **Role-protected routes** — admin-only access with secure Firebase authentication

---

## 🖼️ Interface

| Home | Shop |
|------|------|
| [![Home page](https://ibb.co.com/RpRRg6Kg)](https://ibb.co.com/RpRRg6Kg) | [![Shop page](https://ibb.co.com/wNcn4P7f)](https://ibb.co.com/wNcn4P7f) |

| Product Details | Cart & Checkout |
|------|------|
| [![Product details](https://ibb.co.com/d8rq6rD)](https://ibb.co.com/d8rq6r) | [![Cart and checkout](https://ibb.co.com/q3vztsJh)](https://ibb.co.com/q3vztsJh) |

| Order Tracking |
|------|
| [![Order tracking](https://ibb.co.com/5WrMxygx)](https://ibb.co.com/5WrMxygx) |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 19, Vite, React Router 7, i18next, CSS Modules |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Authentication | Firebase Auth (email/password + Google) |
| Courier & Tracking | SteadFast API |
| Deployment | [dreamvalleyagro.com](https://dreamvalleyagro.com) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Firebase project (for client authentication)

### 1. Client

```bash
cd client
npm install
npm run dev
```

### 2. Server

```bash
cd server
npm install
npm run dev
```

Configure environment variables (Firebase credentials, MongoDB URI, SteadFast API keys) before running in production.

---

## 📄 License

All rights reserved © Dream Valley Agro.
