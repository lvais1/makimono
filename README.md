# 🍣 Makimono

Sushi-night companion for couples. Shared space, shared data, shared memories — across any device via a single invite link.

Built with **Next.js 14 (App Router)** + **Supabase** + **Tailwind** + **Zustand**.

---

## Architecture

- Each couple gets a **Space** — a cloud-hosted row in Supabase with a unique `invite_token`.
- Anyone who opens `/join/<token>` gets an `HttpOnly` cookie linking their device to that space.
- All data (journal, ratings, shopping list, challenges, saved rolls, ingredients, settings) is scoped by `space_id` in Postgres.
- **No user auth.** The invite token *is* the credential. Keep the link private.
- Server-side Supabase client uses the **service role key** (never exposed to the browser).
- Client mutates via **Next.js Server Actions**; Zustand holds an optimistic local copy that revalidates on window focus.

---

## Setup

### 1. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Open **SQL Editor** → paste the contents of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
3. Open **Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Local development

```bash
cp .env.example .env.local
# paste the two values into .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll land on `/welcome` — click **New space** to create one.

### 3. Deploy to Vercel

```bash
# If this is the first deploy:
vercel link

# Add the two env vars (production + preview + development):
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy:
vercel --prod
```

Or via the Vercel dashboard: **Project → Settings → Environment Variables**, add both, then redeploy.

---

## How sharing works

1. User A opens the site → **New space** → gets a cookie linking their device.
2. User A goes to **Settings** → copies the invite link (`https://yourapp.com/join/<token>`).
3. User A sends the link to User B via any channel.
4. User B opens the link → their device gets linked to the same space.
5. Both devices now read/write the same `space_id`. Changes appear on refresh or when the tab regains focus.

---

## Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | server + client | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS; used by server actions |

> ⚠️ Never put the service_role key in a `NEXT_PUBLIC_*` variable. The app does not use the anon key — all DB access is server-side.

---

## Database schema

See [`supabase/schema.sql`](supabase/schema.sql). Tables:

- `spaces` — one per couple, holds `invite_token` + `settings` JSONB
- `journal_entries`, `ratings`, `shopping_items`, `saved_rolls` — per-space lists, each row stores its domain shape as JSONB
- `completed_challenges` — composite PK (`space_id`, `challenge_id`)
- `available_ingredients` — composite PK (`space_id`, `ingredient_id`)

RLS is **enabled with no policies** on every table. Anon and authenticated roles get zero access. Only the service_role key (server-side) can touch the data, and the app layer enforces space scoping via the `makimono_space_id` cookie.

---

## Security notes

- `invite_token` is 32 chars from a 62-char alphabet (`nanoid`) → ≈190 bits of entropy. Not brute-forceable.
- The cookie is `HttpOnly` + `SameSite=Lax` + `Secure` in production.
- The client bundle contains **zero** Supabase credentials. All DB traffic goes through server actions.
- If an invite link leaks, rotate by creating a new space and migrating data (not yet implemented — lowest-priority follow-up).

---

## Scripts

```bash
npm run dev      # Local dev server
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint
```
