# Fury Food — Next.js RBAC Food Ordering App

A full-stack web app built with **Next.js (App Router)**, **Tailwind CSS**, **Prisma v7** and **Neon Postgres**.  
It supports Restaurants/Menu browsing, Cart → Checkout/Pay, Order Cancelation, and Payment Method selection, with **RBAC** + **country-scoped** access enforced on the server.

---

## Tech Stack

- Next.js (App Router) + Route Handlers for APIs [web:37]
- Tailwind CSS (responsive UI)
- Prisma **Client v7.x** + Prisma Config (`prisma.config.ts`) for migrations/config [web:67]
- Neon Postgres (pooled + direct connection strings) [web:386]

---

## Live site

```
```

## Prerequisites (Follow below steps to setup from scratch)

- **Node.js** 18+ (recommended) and npm
- A **Neon** Postgres project + database (free tier is fine)

---

## 1) Clone & install dependencies

```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_FOLDER>
npm install
```

## 2) Create account on neon


https://neon.com/docs/introduction

## 3) Configure environment variables

# Runtime (Next.js app / Prisma Client via Neon adapter) — pooled URL
```
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxxxx-pooler.REGION.aws.neon.tech/DB?sslmode=require"
```

# Prisma CLI (migrate/studio) — direct URL (next line if you use Prisma <5.10)
```
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxxxx.REGION.aws.neon.tech/DB?sslmode=require"
```

# Session signing/entropy (any long random string)
```
SESSION_SECRET="replace-with-a-long-random-string"
```

## 4) Run migrations and generate Prisma Client

```npx prisma generate
npx prisma migrate dev
```
## 6) Seed dummy data (Nick Fury + employees + restaurants + menu)

```
node prisma/seed.js
```

## 7) Start the dev server

```
npm run dev
```

## Seeded logins (for testing)

### Password for all seeded users: Password@123

### Emails:

```
nick@fury.com (ADMIN)

marvel@fury.com (MANAGER, INDIA)

america@fury.com (MANAGER, AMERICA)

thanos@fury.com (MEMBER, INDIA)

thor@fury.com (MEMBER, INDIA)

travis@fury.com (MEMBER, AMERICA)
```

## Cookies not working on localhost
If your session cookie is set with secure: true, it won’t be stored on http://localhost.
Use secure: process.env.NODE_ENV === "production" for local dev.

## Access management

| Feature               | Admin | Manager | Member |
| --------------------- | ----- | ------- | ------ |
| View restaurants/menu | ✅     | ✅       | ✅      |
| Add items to cart     | ✅     | ✅       | ✅      |
| Checkout & pay        | ✅     | ✅       | ❌      |
| Cancel order          | ✅     | ✅       | ❌      |
| Update payment method | ✅     | ❌       | ❌      |