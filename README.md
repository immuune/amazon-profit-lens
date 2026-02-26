# Amazon Profit Lens - Setup Guide

## Supabase Setup

1.  **Create a new Supabase project** at [supabase.com](https://supabase.com).
2.  **Run the SQL Migration**:
    -   Go to the **SQL Editor** in your Supabase dashboard.
    -   Copy the contents of `supabase_migration.sql` from this project.
    -   Paste it into the SQL Editor and click **Run**.
3.  **Configure Auth**:
    -   Go to **Authentication** > **Providers**.
    -   Ensure **Email** is enabled.
    -   Enable **Magic Link** (passwordless).
    -   Set your Site URL and Redirect URLs in **Authentication** > **URL Configuration**.
        -   Site URL: `https://ais-pre-wj2e47qmk73cqg3embb57h-61238858483.europe-west1.run.app` (or your production URL)
        -   Redirect URLs: `https://ais-pre-wj2e47qmk73cqg3embb57h-61238858483.europe-west1.run.app/auth/callback`

## Environment Variables

Create a `.env.local` file (or set these in your hosting provider):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Add the environment variables listed above.
4.  Deploy!
