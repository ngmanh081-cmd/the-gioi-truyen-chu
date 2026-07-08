# Webdoctruyen MVP

Website doc truyen chu MVP gom:

- `apps/api`: Express.js, TypeScript, Prisma ORM, SQL Server, Redis cache chapter.
- `apps/web`: React.js, TypeScript, Tailwind CSS, Framer Motion.

## Chay local

1. Cai dependencies:

```bash
npm install
```

2. Tao file cau hinh API:

```bash
cp apps/api/.env.example apps/api/.env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Chay dev:

```bash
npm run dev
```
