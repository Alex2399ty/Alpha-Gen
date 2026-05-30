-- ════════════════════════════════════════════════════════════════
-- AlphaGen — PostgreSQL schema (Supabase)
-- Run in Supabase SQL editor or: psql "$DATABASE_URL" -f db/schema.sql
-- ════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Enums ──────────────────────────────────────────────────────
do $$ begin
  create type user_tier         as enum ('free','pro','alpha');
  create type signal_type       as enum ('strong_hold','hold','watch','consider_swap');
  create type sentiment_type    as enum ('positive','neutral','negative');
  create type impact_direction  as enum ('positive','negative','neutral');
  create type txn_type          as enum ('buy','sell');
  create type holding_change    as enum ('new','added','reduced','exited');
exception when duplicate_object then null; end $$;

-- ── users (mirrors auth.users) ─────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text,
  avatar_url  text,
  tier        user_tier not null default 'free',
  created_at  timestamptz not null default now()
);

-- ── portfolios ─────────────────────────────────────────────────
create table if not exists public.portfolios (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  name              text not null default 'My Portfolio',
  risk_level        int  not null default 5 check (risk_level between 1 and 10),
  time_horizon_years int not null default 10,
  investment_amount numeric(14,2) not null default 0,
  monthly_dca       numeric(14,2) not null default 0,
  dividend_strategy text not null default 'reinvest',
  sectors           text[] not null default '{}',
  health_score      int,
  created_at        timestamptz not null default now()
);
create index if not exists idx_portfolios_user on public.portfolios(user_id);

-- ── holdings ───────────────────────────────────────────────────
create table if not exists public.holdings (
  id            uuid primary key default gen_random_uuid(),
  portfolio_id  uuid not null references public.portfolios(id) on delete cascade,
  symbol        text not null,
  shares        numeric(18,6) not null default 0,
  avg_cost      numeric(14,4) not null default 0,
  added_at      timestamptz not null default now()
);
create index if not exists idx_holdings_portfolio on public.holdings(portfolio_id);

-- ── watchlist ──────────────────────────────────────────────────
create table if not exists public.watchlist (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  symbol          text not null,
  alert_threshold numeric(14,4),
  added_at        timestamptz not null default now(),
  unique(user_id, symbol)
);

-- ── stocks (universe) ──────────────────────────────────────────
create table if not exists public.stocks (
  symbol                  text primary key,
  name                    text,
  sector                  text,
  market_cap_tier         text,
  current_price           numeric(14,4),
  price_updated_at        timestamptz,
  ceo_score               numeric(5,2),
  ceo_score_updated_at    timestamptz,
  thesis                  text,
  management_assessment   text,
  key_risks               text,
  why_popular             text,
  daily_signal            signal_type,
  signal_confidence       int check (signal_confidence between 0 and 100),
  signal_reason           text,
  signal_updated_at       timestamptz,
  swap_suggestion_symbol  text,
  swap_suggestion_reason  text,
  div_yield               numeric(6,3),
  beta                    numeric(6,3),
  pe_ratio                numeric(10,3),
  market_cap              numeric(20,2)
);

-- ── news_items ─────────────────────────────────────────────────
create table if not exists public.news_items (
  id              uuid primary key default gen_random_uuid(),
  symbol          text,
  headline        text not null,
  source          text,
  url             text,
  published_at    timestamptz,
  impact_summary  text,
  sentiment       sentiment_type,
  fetched_at      timestamptz not null default now()
);
create index if not exists idx_news_symbol on public.news_items(symbol, published_at desc);

-- ── insider_trades (Form 4) ────────────────────────────────────
create table if not exists public.insider_trades (
  id               uuid primary key default gen_random_uuid(),
  symbol           text not null,
  filer_name       text,
  filer_title      text,
  transaction_type txn_type,
  shares           numeric(18,4),
  price            numeric(14,4),
  total_value      numeric(20,2),
  is_10b5_1_plan   boolean default false,
  filed_at         timestamptz,
  fetched_at       timestamptz not null default now()
);
create index if not exists idx_insider_symbol on public.insider_trades(symbol, filed_at desc);

-- ── institutional_holdings (13F) ───────────────────────────────
create table if not exists public.institutional_holdings (
  id          uuid primary key default gen_random_uuid(),
  symbol      text not null,
  fund_name   text,
  shares      numeric(20,4),
  value       numeric(20,2),
  change_type holding_change,
  quarter     text,
  fetched_at  timestamptz not null default now()
);
create index if not exists idx_inst_symbol on public.institutional_holdings(symbol, quarter);

-- ── earnings_calls ─────────────────────────────────────────────
create table if not exists public.earnings_calls (
  id                        uuid primary key default gen_random_uuid(),
  symbol                    text not null,
  call_date                 date,
  transcript_text           text,
  ceo_score_raw             numeric(5,2),
  language_precision_score  numeric(5,2),
  hedging_frequency_score   numeric(5,2),
  consistency_score         numeric(5,2),
  key_quotes                text[],
  processed_at              timestamptz
);
create index if not exists idx_earnings_symbol on public.earnings_calls(symbol, call_date desc);

-- ── macro_events ───────────────────────────────────────────────
create table if not exists public.macro_events (
  id               uuid primary key default gen_random_uuid(),
  event_type       text,
  headline         text not null,
  description      text,
  affected_symbols text[],
  impact_direction impact_direction,
  published_at     timestamptz not null default now()
);

-- ── user_check_ins ─────────────────────────────────────────────
create table if not exists public.user_check_ins (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.users(id) on delete cascade,
  answers               jsonb not null default '{}',
  portfolio_adjustments jsonb not null default '{}',
  created_at            timestamptz not null default now()
);

-- ── chat_sessions ──────────────────────────────────────────────
create table if not exists public.chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  messages   jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── user_recommendations (Discovery Agent) ─────────────────────
create table if not exists public.user_recommendations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  symbol     text not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ── waitlist (public signup) ───────────────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  name       text,
  source     text,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════
alter table public.users                  enable row level security;
alter table public.portfolios             enable row level security;
alter table public.holdings               enable row level security;
alter table public.watchlist              enable row level security;
alter table public.user_check_ins         enable row level security;
alter table public.chat_sessions          enable row level security;
alter table public.user_recommendations   enable row level security;

-- users: a user can see/update only their own row
drop policy if exists "users self" on public.users;
create policy "users self" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- portfolios: owner only
drop policy if exists "portfolios owner" on public.portfolios;
create policy "portfolios owner" on public.portfolios
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- holdings: via owning portfolio
drop policy if exists "holdings owner" on public.holdings;
create policy "holdings owner" on public.holdings
  for all using (exists (
    select 1 from public.portfolios p
    where p.id = holdings.portfolio_id and p.user_id = auth.uid()
  )) with check (exists (
    select 1 from public.portfolios p
    where p.id = holdings.portfolio_id and p.user_id = auth.uid()
  ));

-- watchlist / check-ins / chats / recs: owner only
drop policy if exists "watchlist owner" on public.watchlist;
create policy "watchlist owner" on public.watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "checkins owner" on public.user_check_ins;
create policy "checkins owner" on public.user_check_ins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "chats owner" on public.chat_sessions;
create policy "chats owner" on public.chat_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "recs owner" on public.user_recommendations;
create policy "recs owner" on public.user_recommendations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public read tables (stocks, news, insider, institutional, macro, earnings):
-- left without RLS so the service role and anon read work; tighten later as needed.
-- waitlist: allow anonymous inserts only.
alter table public.waitlist enable row level security;
drop policy if exists "waitlist insert" on public.waitlist;
create policy "waitlist insert" on public.waitlist for insert with check (true);

-- ── Auto-provision public.users row on auth signup ─────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (new.id, new.email,
          new.raw_user_meta_data->>'full_name',
          new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
