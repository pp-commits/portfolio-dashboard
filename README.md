## Dynamic Portfolio Dashboard

## Getting Started
First, install dependencies:
```bash
npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```
Second build the database client app will use to talk to DB
```bash
npx prisma generate

npx prisma migrate dev --name add_transaction_table
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

API logic lives inside:
app/api/portfolio/route.ts
app/api/google/route.ts

GET /api/portfolio

Returns:

Portfolio list

Sector summary

Totals

GET /api/google?symbol=TCS:NSE

Fallback scraper for:

P/E ratio

EPS

Financial data fetching utilities are located in:
lib/market.ts
lib/usePortfolio.ts

Visualizations

Portfolio Pie Chart (portfolio weight distribution)

Sector Bar Chart (investment vs present value per sector)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
