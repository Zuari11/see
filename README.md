# Next.js App with Clerk Auth and Supabase

This project demonstrates how to set up authentication using Clerk and automatically sync new users to a Supabase database.

## Features

- Authentication with Clerk
- User data synchronization to Supabase
- Protected routes with Clerk middleware
- Modern UI with custom auth components

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cmVndWxhci1hbnRlbG9wZS0yNi5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_QXgtvRenlhNSi7BnbD6vVqSBKhJTKHfJvjeyzbn24T
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   CLERK_WEBHOOK_SECRET=your_webhook_secret

   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase:
   - Create a `users` table in Supabase with the following schema:
     ```sql
     CREATE TABLE users (
       id TEXT PRIMARY KEY,
       email TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE
     );
     ```

5. Set up Clerk Webhook:
   - Go to your Clerk Dashboard
   - Navigate to Webhooks
   - Create a new webhook with endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Enable the `user.created` event
   - Copy the signing secret to your `CLERK_WEBHOOK_SECRET` env variable

6. Run the development server:
   ```
   npm run dev
   ```

## User Synchronization Approaches

This project implements two approaches for syncing users to Supabase:

1. **Webhook-based** (server-side): When a user is created in Clerk, a webhook is triggered that creates the corresponding user in Supabase.
2. **Client-side**: When a user signs up and completes the authentication flow, the client makes a request to sync the user to Supabase.

## Project Structure

- `src/middleware.ts`: Clerk middleware setup
- `src/app/layout.tsx`: Root layout with ClerkProvider
- `src/app/auth/`: Authentication pages 
- `src/app/dashboard/`: Protected dashboard page
- `src/app/api/webhooks/clerk/`: Webhook endpoint for Clerk events
- `src/app/api/user/sync/`: API endpoint for client-side user sync
- `src/lib/supabase.ts`: Supabase client and user creation functions

## Technologies Used

- Next.js 15 (App Router)
- Clerk for authentication
- Supabase for database
- TypeScript
- Tailwind CSS

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# chart
# chart
