Postgres quick start (docker):

1) Start Postgres:
   docker run --name convospan-postgres -e POSTGRES_PASSWORD=pass -e POSTGRES_DB=convospan_dev -p 5432:5432 -d postgres:15

2) Set DATABASE_URL in .env:
   postgresql://postgres:pass@localhost:5432/convospan_dev

3) Install deps:
   npm ci --legacy-peer-deps

4) Generate Prisma client:
   npx prisma generate

5) Create initial migration:
   npx prisma migrate dev --name init

6) Build and run:
   npm run build
   npm run start
