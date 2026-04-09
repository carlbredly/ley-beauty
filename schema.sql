-- LEY Beauty Supabase Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────

create table if not exists slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  is_available boolean default true,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references slots(id) on delete cascade not null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  service text not null,
  message text,
  status text default 'pending'
    check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────

create index if not exists slots_date_idx on slots (date);
create index if not exists slots_available_idx on slots (is_available);
create index if not exists bookings_slot_id_idx on bookings (slot_id);
create index if not exists bookings_status_idx on bookings (status);
create index if not exists bookings_created_at_idx on bookings (created_at desc);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

alter table slots enable row level security;
alter table bookings enable row level security;

-- SLOTS: anyone can read available slots
create policy "Public can view slots"
  on slots for select
  using (true);

-- SLOTS: only service role (admin) can insert/update/delete
create policy "Service role can manage slots"
  on slots for all
  using (auth.role() = 'service_role');

-- BOOKINGS: service role manages all
create policy "Service role can manage bookings"
  on bookings for all
  using (auth.role() = 'service_role');

-- BOOKINGS: public can insert (create booking request)
create policy "Public can create bookings"
  on bookings for insert
  with check (true);

-- ─────────────────────────────────────────
-- SAMPLE DATA (optional, for testing)
-- ─────────────────────────────────────────

-- Insert a few sample slots for today + next 7 days
-- (Remove in production or use the admin dashboard)

insert into slots (date, start_time, end_time) values
  (current_date + 1, '10:00', '11:30'),
  (current_date + 1, '13:00', '14:30'),
  (current_date + 1, '15:00', '16:30'),
  (current_date + 2, '10:00', '11:30'),
  (current_date + 2, '14:00', '15:30'),
  (current_date + 3, '11:00', '12:30'),
  (current_date + 3, '15:00', '17:00');
