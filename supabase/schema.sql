-- Brabham Venue Sports demo
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.venue_items (
  id text primary key,
  venue_slug text not null,
  kind text not null check (kind in ('competition','event','prize','music','trivia_pack')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  title text not null,
  subtitle text,
  description text,
  sport text,
  starts_at timestamptz,
  ends_at timestamptz,
  prize text,
  image_url text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  venue_slug text not null,
  item_id text not null references public.venue_items(id) on delete cascade,
  name text not null,
  email text not null,
  mobile text,
  username text,
  answers jsonb not null default '{}'::jsonb,
  score integer,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  venue_slug text not null,
  role text not null default 'venue_admin',
  created_at timestamptz not null default now()
);

alter table public.venue_items enable row level security;
alter table public.entries enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "public can read active venue content" on public.venue_items;
create policy "public can read active venue content"
on public.venue_items
for select
to anon, authenticated
using (is_active = true or exists (
  select 1 from public.admin_profiles ap
  where ap.user_id = auth.uid()
    and ap.venue_slug = venue_items.venue_slug
));

drop policy if exists "public can submit entries" on public.entries;
create policy "public can submit entries"
on public.entries
for insert
to anon, authenticated
with check (
  venue_slug = 'brabham'
  and consent = true
);

drop policy if exists "admins can read venue entries" on public.entries;
create policy "admins can read venue entries"
on public.entries
for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.venue_slug = entries.venue_slug
  )
);

drop policy if exists "admins can manage venue content" on public.venue_items;
create policy "admins can manage venue content"
on public.venue_items
for all
to authenticated
using (
  exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.venue_slug = venue_items.venue_slug
  )
)
with check (
  exists (
    select 1 from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and ap.venue_slug = venue_items.venue_slug
  )
);

drop policy if exists "admin reads own profile" on public.admin_profiles;
create policy "admin reads own profile"
on public.admin_profiles
for select
to authenticated
using (user_id = auth.uid());

-- Seed venue content.
insert into public.venue_items
(id, venue_slug, kind, sort_order, is_active, title, subtitle, description, sport, starts_at, ends_at, prize, image_url, config)
values
(
  'comp-afl','brabham','competition',10,true,
  'AFL Game Day Pick','Pick the winner, first goal and margin',
  'A clean three-pick game built for the sports bar. Entries close at the first bounce.',
  'AFL','2026-09-05T15:00:00+08:00','2026-09-05T17:40:00+08:00',
  'Brabham dining voucher + reserved table',null,
  '{"home":"Fremantle","away":"Collingwood","scorers":["Jye Amiss","Shai Bolton","Bobby Hill","Jamie Elliott","Other"],"marginMax":60,"requireVenueCheckin":false}'::jsonb
),
(
  'comp-nrl','brabham','competition',20,true,
  'NRL Friday Footy','Winner, first try scorer and winning margin',
  'Fast to enter and designed for repeat venue engagement before kick-off.',
  'NRL','2026-09-04T17:00:00+08:00','2026-09-04T18:00:00+08:00',
  'Sports merch pack',null,
  '{"home":"Panthers","away":"Storm","scorers":["Brian To''o","Sunia Turuva","Xavier Coates","Ryan Papenhuyzen","Other"],"marginMax":40,"requireVenueCheckin":false}'::jsonb
),
(
  'comp-ufc','brabham','competition',30,true,
  'UFC Main Event Predictor','Winner, method and round',
  'A premium fight-night prediction card for the main event.',
  'UFC','2026-09-06T09:00:00+08:00','2026-09-06T11:30:00+08:00',
  'Brabham meal voucher',null,
  '{"fighterA":"Fighter A","fighterB":"Fighter B","methods":["KO / TKO","Submission","Decision"],"rounds":[1,2,3,4,5],"requireVenueCheckin":false}'::jsonb
),
(
  'comp-racing','brabham','competition',40,true,
  'Saturday Racing Pick 6','Pick a runner in six featured races',
  'Free tipping competition. No wagering. Most winners takes the lead.',
  'RACING','2026-09-05T11:00:00+08:00','2026-09-05T13:00:00+08:00',
  'Race-day merch + dining voucher',null,
  '{"races":[{"label":"Race 1","runners":["1. Northern Star","2. Gold Rush","3. Local Legend","4. Fast Lane"]},{"label":"Race 2","runners":["1. Big Screen","2. Brabham Boy","3. Weekend Ready","4. Trackside"]},{"label":"Race 3","runners":["1. New Local","2. Pub Classic","3. Palfrey Street","4. Grandstand"]},{"label":"Race 4","runners":["1. Friday Night","2. Racing Royalty","3. Home Straight","4. Full House"]},{"label":"Race 5","runners":["1. Game Day","2. Main Bar","3. Late Charge","4. Final Call"]},{"label":"Race 6","runners":["1. Victory Lap","2. Local Hero","3. Crowd Favourite","4. Last Round"]}],"requireVenueCheckin":false}'::jsonb
),
(
  'trivia-sports-mix','brabham','trivia_pack',50,true,
  'Sports Mix','Fast, broad and pub-friendly',
  'Five-question sprint for demo mode.','TRIVIA',null,null,'Leaderboard bragging rights',null,
  '{"questions":[{"question":"How many points is a goal worth in AFL?","options":["3","5","6","7"],"answer":2},{"question":"How many players are on the field for one NRL team?","options":["11","12","13","15"],"answer":2},{"question":"In UFC, what does TKO stand for?","options":["Technical Knockout","Total Knockout","Timed Kick Out","Technical Kick Off"],"answer":0},{"question":"What surface is the Melbourne Cup run on?","options":["Dirt","Synthetic","Turf","Sand"],"answer":2},{"question":"Which term describes a tied score in many sports?","options":["Draw","Bye","Set","Heat"],"answer":0}]}'::jsonb
),
(
  'trivia-afl','brabham','trivia_pack',51,true,
  'AFL Fan Test','Five quick AFL questions',
  'Specific sports content selected from the trivia picker.','TRIVIA',null,null,null,null,
  '{"questions":[{"question":"How many points is a behind worth?","options":["1","2","3","6"],"answer":0},{"question":"How many quarters are in an AFL match?","options":["2","3","4","5"],"answer":2},{"question":"Which line marks the centre of the ground?","options":["Goal square","Centre square","Boundary arc","Interchange line"],"answer":1},{"question":"A mark is usually paid when a kicked ball travels at least how far?","options":["5m","10m","15m","25m"],"answer":2},{"question":"What is the restart called after a goal?","options":["Ball-up","Throw-in","Centre bounce","Kick-in"],"answer":2}]}'::jsonb
),
(
  'trivia-racing','brabham','trivia_pack',52,true,
  'Racing Knowledge','Horse racing without wagering',
  'A racing-focused knowledge pack for race-day engagement.','TRIVIA',null,null,null,null,
  '{"questions":[{"question":"What is the person riding a racehorse called?","options":["Trainer","Jockey","Starter","Clerk"],"answer":1},{"question":"What is the numbered starting structure used before a race?","options":["Barrier","Rail","Mount","Paddock"],"answer":0},{"question":"Where are horses commonly viewed before a race?","options":["Paddock","Scoreboard","Timekeeper''s box","Press room"],"answer":0},{"question":"What does a photo finish help decide?","options":["Barrier draw","Winner","Track rating","Race distance"],"answer":1},{"question":"What does a trainer primarily prepare?","options":["The betting market","The horse","The broadcast","The barrier"],"answer":1}]}'::jsonb
),
(
  'event-fathers-day','brabham','event',60,true,
  'Father''s Day','Sunday 6 September',
  'Family day with kids activities, face painting, live music and Sunday roast.',
  'GENERAL','2026-09-06T12:00:00+08:00','2026-09-06T17:00:00+08:00',
  'Ultimate Dad Hamper draw',null,'{}'::jsonb
),
(
  'event-trivia','brabham','event',70,true,
  'Wednesday Trivia Night','Every Wednesday from 7pm',
  'General knowledge, pop culture, sport and more.',
  'TRIVIA',null,null,null,null,'{}'::jsonb
),
(
  'event-afl-gf','brabham','event',80,true,
  'AFL Grand Final Day','Saturday 26 September | From 11am',
  'Big-screen game day with sports bar seating and family-friendly entertainment.',
  'AFL','2026-09-26T11:00:00+08:00',null,null,null,'{}'::jsonb
),
(
  'music-weekend','brabham','music',90,true,
  'Live Music Weekends','Beer garden sessions',
  'Rotate artists, times and promo copy from Venue Admin.',
  'MUSIC',null,null,null,null,
  '{"schedule":[{"day":"Friday","time":"6:30pm","artist":"Local Acoustic Session"},{"day":"Saturday","time":"4:00pm","artist":"Weekend Live Set"},{"day":"Sunday","time":"3:00pm","artist":"Sunday Session"}]}'::jsonb
),
(
  'prize-1','brabham','prize',100,true,
  'Brabham Dining Voucher','Venue supplied',
  'Simple, useful and easy for staff to fulfil.',
  'GENERAL',null,null,'$50 dining voucher',null,'{}'::jsonb
),
(
  'prize-2','brabham','prize',110,true,
  'Sports Merch Pack','Competition prize template',
  'Use for footy, UFC or racing activations.',
  'GENERAL',null,null,'Sports merchandise pack',null,'{}'::jsonb
),
(
  'prize-3','brabham','prize',120,true,
  'Reserved Game-Day Table','Experience prize',
  'Reserved table for a nominated live sports session.',
  'GENERAL',null,null,'Reserved table experience',null,'{}'::jsonb
)
on conflict (id) do update set
  venue_slug = excluded.venue_slug,
  kind = excluded.kind,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  sport = excluded.sport,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  prize = excluded.prize,
  image_url = excluded.image_url,
  config = excluded.config,
  updated_at = now();

-- After creating a Supabase Auth user for the venue admin:
-- insert into public.admin_profiles (user_id, venue_slug, role)
-- values ('PASTE_AUTH_USER_UUID_HERE', 'brabham', 'venue_admin');
