# Brabham Venue Sports — live demo starter

A mobile-first Brabham Hotel sports engagement platform with:

- AFL competition template
- NRL competition template
- UFC predictor
- Horse racing Pick 6
- Sports/AFL/racing trivia packs
- Upcoming venue events
- Music schedule
- Prize templates
- Venue Admin Sign In
- Supabase-ready content storage + entries
- Local browser fallback so the project still runs without a database

## Brand direction

The UI uses the supplied Brabham screenshot as the visual reference and carries through:

- warm cream `#EBE3B9`
- venue orange/gold `#DFA55B`
- deep brown `#2F211B`
- pale paper `#FFFDF6`

The supplied screenshot is cropped into `public/brabham-hero.jpg`.

## 1. Run locally

```bash
npm install
npm run dev
```

Open:

- Public demo: `http://localhost:3000`
- Venue Admin: `http://localhost:3000/admin`

Without Supabase variables the public demo and admin content manager run in local-browser demo mode.

## 2. Make it genuinely shared/live with Supabase

1. Create or use the existing Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. In Authentication, create the Brabham venue admin user.
5. Copy that user's UUID.
6. Run:

```sql
insert into public.admin_profiles (user_id, venue_slug, role)
values ('PASTE_AUTH_USER_UUID_HERE', 'brabham', 'venue_admin');
```

7. Copy `.env.example` to `.env.local`.
8. Add:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Now guest entries save centrally and Venue Admin changes are shared across devices.

## 3. Deploy

This is a standard Next.js project and can be deployed from GitHub.

Recommended workflow for the existing venue-mode stack:

1. Create a branch such as `feature/brabham-hotel-demo`.
2. Add this as a standalone app or merge the route/components into the existing repo.
3. Add the two Supabase environment variables in the deployment environment.
4. Deploy a preview.
5. Test mobile widths around 390px and 430px.
6. Submit test entries from a second device.
7. Sign into `/admin`, switch content on/off, refresh the public demo on the second device, and confirm the changes are visible.
8. Only then share the demo URL.

## 4. Best route structure inside the existing Fanverse/Bragger venue repo

If you are merging this into the existing venue platform instead of using it standalone:

```text
/venues/brabham
/venues/brabham/admin
```

Use `venue_slug = "brabham"` for all reads/writes.

Do not modify unrelated venue pages, current media or production routes.

## 5. Production checklist

Before a real public activation:

- replace demo team/fighter/runner names with current approved fixtures
- confirm prize values and fulfilment with the venue
- decide whether each competition requires physical venue check-in
- finalise T&Cs, privacy consent and age eligibility
- add leaderboard/admin entry export if required
- add sponsor artwork only where approved
- confirm staff workflow for winners
- test every entry flow on iPhone and Android
- confirm RLS prevents non-admin users from changing venue content
