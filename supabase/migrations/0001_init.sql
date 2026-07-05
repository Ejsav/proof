-- AutoMax Branford — initial schema
-- Run via: supabase db push  (or paste into the SQL editor)

-- ============ leads ============
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('test_drive', 'prequal', 'trade_in', 'contact')),
  name text not null,
  phone text not null,
  email text,
  vehicle_slug text,
  -- Full validated payload; schema lives in lib/leads/schema.ts
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'appointment', 'sold', 'lost')),
  -- TCPA evidence: consent is required by the Zod schema; stamp it here too
  tcpa_consent_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

-- ============ vehicles (live-feed target for lib/inventory.ts seam) ============
create table if not exists public.vehicles (
  id text primary key,
  slug text unique not null,
  stock_number text not null,
  year int not null,
  make text not null,
  model text not null,
  trim text not null,
  price int not null,
  mileage int not null,
  body_style text not null,
  exterior_color text not null,
  interior_color text not null,
  drivetrain text not null,
  transmission text not null,
  fuel text not null,
  mpg_city int not null,
  mpg_highway int not null,
  features jsonb not null default '[]'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  status text not null default 'available'
    check (status in ('available', 'pending', 'sold')),
  featured boolean not null default false,
  highlight text,
  updated_at timestamptz not null default now()
);

-- ============ RLS ============
-- Leads: no client access at all. The app writes/reads leads exclusively
-- through Server Actions using the service-role key (which bypasses RLS).
alter table public.leads enable row level security;

-- Vehicles: public read of non-sold inventory (future client-side use);
-- writes only via service role (feed ingestion).
alter table public.vehicles enable row level security;
create policy "public can read live inventory"
  on public.vehicles for select
  using (status in ('available', 'pending'));

-- ============ storage ============
-- Create a public bucket named `vehicle-photos` in the dashboard (or CLI).
-- Feed ingestion uploads there; photo URLs land in vehicles.photos.
