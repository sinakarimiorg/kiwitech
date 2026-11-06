<div align="center">

# KiwiTech (کیوی‌تک)

**An online store for mobile and computer accessories**
A full-stack, Persian (RTL) e-commerce project built with Next.js, TypeScript and MongoDB

[**🔗 Live demo: https://YOUR-DOMAIN.com**](https://YOUR-DOMAIN.com)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Overview

KiwiTech is a complete online store with three main areas:

- **Storefront**: home page, product listing and details, amazing offers, articles (blog), search, cart and checkout
- **User panel** (`/p-user`): orders, favorites, addresses, messages, wallet and profile
- **Admin panel** (`/p-admin`): manage products, orders, users, comments, discount codes, categories, banners, articles and home page settings

## Features

### Storefront
- Products with **color variants**, each with its own stock, price and discount
- Live search suggestions, category/subcategory filters, sorting and pagination
- "Amazing Offers" section with a countdown to the end of the day (Iran time)
- Persistent cart (localStorage) with stock limits
- Discount codes (percent / fixed) with usage caps, Jalali expiry dates and minimum order amounts
- Configurable shipping cost and free shipping above a threshold
- Customer reviews with admin approval and star ratings
- Dynamic category menu and mobile bottom navigation

### Authentication and security
- Sign in / sign up with an **SMS one-time password (OTP)**; codes are stored hashed
- Server-side sessions with an `httpOnly` cookie and hashed tokens
- **Rate limiting** (MongoDB-backed) on OTP, comments, discount codes and the contact form
- Uploaded images are verified from their actual bytes, not the file extension
- Role-based access control (user / admin) in every Server Action

### Payments
- **Zarinpal** integration (order payments and wallet top-ups)
- Stock is reserved when a payment starts and released automatically on cancel or expiry
- Idempotent order creation and handling of unknown payment results
- Unit tests for the payment finalization logic

### Admin panel
- Dashboard stats (today's sales, weekly sales pulse, low stock)
- Real-time notifications and unread badges
- Advanced product form (colors, specs, tags, multiple images, automatic discount calculation)
- Banner ordering and status, plus **home page layout control** (enable/disable, order, titles, item counts)

### SEO and performance
- `generateMetadata`, canonical URLs, Open Graph, dynamic `sitemap.xml` and `robots.txt`
- JSON-LD structured data for products, articles and the organization
- Server-side caching with revalidatable tags (`unstable_cache`)
- Loading skeletons and a navigation progress bar

## Tech Stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) · React 19 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Styling | Tailwind CSS v4 |
| Forms and validation | Formik · Yup |
| Client state | Redux Toolkit (cart and menu) |
| Slider / map | Swiper · React-Leaflet |
| Alerts | SweetAlert2 |
| Testing | Vitest |
| CI | GitHub Actions |

## Getting Started

### Prerequisites
- Node.js 22 or later
- A MongoDB database (local or Atlas)

### Install and run

```bash
git clone https://github.com/sinakarimiorg/kiwitech.git
cd kiwitech
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The app runs at `http://localhost:3000`.

### Environment variables

Create a `.env.local` file:

```env
# Database connection
MONGODB_URI=mongodb://localhost:27017/kiwitech

# Site URL (no trailing slash), used for SEO, sitemap and payment callbacks
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=true
```

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check the project |
| `npm test` | Run tests (Vitest) |

### Creating the first admin

New users get the `کاربر` (user) role by default. After signing up with your phone number, change the role in MongoDB:

```js
db.users.updateOne({ phone: "09123456789" }, { $set: { role: "ادمین" } })
```

## Project Structure

```
src/
├── app/                  # Routes (storefront, p-user, p-admin, api)
├── components/
│   ├── layouts/          # Admin and user panel layouts
│   ├── modules/          # Shared components (Header, Footer, Pagination, ...)
│   └── templates/        # Page-level components with their Server Actions
├── lib/                  # auth, payment, cache, seo, rate limit, ...
├── models/               # Mongoose models
├── store/                # Redux (cart and menu)
├── types/                # Shared types
├── utils/                # Helpers (dates, phone, validation)
└── __tests__/            # Unit tests
```

## Roadmap

- [ ] Connect a real SMS provider for OTP delivery
- [ ] Email/SMS notifications for the contact form and order status changes
- [ ] Automatic refunds for payments flagged for manual review
- [ ] Email newsletter signup

## Contributing

Issues and pull requests are welcome. Please run `npm run typecheck` and `npm test` before submitting.

## Author

**Sina Karimi** — [github.com/sinakarimiorg](https://github.com/sinakarimiorg)
