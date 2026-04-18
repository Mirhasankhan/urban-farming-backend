# Urban Farming Backend

Backend API for an urban farming marketplace platform built with Express, TypeScript, Prisma, and PostgreSQL.

## Features

- Authentication and user management
- Role-based access (`ADMIN`, `VENDOR`, `CUSTOMER`)
- Vendor profiles and produce listing
- Orders and rental space modules
- Community post module

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod validation

## API Base Path

All module routes are served under:

`/api/v1`

Available modules:

- `/api/v1/user`
- `/api/v1/auth`
- `/api/v1/vendor`
- `/api/v1/produce`
- `/api/v1/admin`
- `/api/v1/community-post`
- `/api/v1/rent`
- `/api/v1/order`

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and configure at least:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

JWT_SECRET=your_jwt_secret
GEN_SALT=10
EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Prisma Commands

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Seed Data

Running the seed command:

```bash
npx prisma db seed
```

Will automatically create (idempotent/upsert-based):

- 1 admin user
- 1 customer user
- 10 vendors (with vendor profiles)
- 100 produce records (10 per vendor)

Seed login credentials:

- Password for all seeded users: `123456`
- Admin email: `admin@gmail.com`
- Customer email: `customer@gmail.com`
- Vendor emails: `vendor1@gmail.com` ... `vendor10@gmail.com`

## Run The Server

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```
