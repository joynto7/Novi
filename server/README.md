# Occasio — Server

Express + PostgreSQL + Prisma API for the Occasio event platform. See the
[root README](../README.md) for full setup instructions, environment variables,
and demo credentials.

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```
