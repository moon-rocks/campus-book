-- Campus Book marketplace/admin upgrade.
-- Run this migration in Supabase SQL Editor after the existing base schema.

create extension if not exists pgcrypto;

alter table public.profiles add column if not exists role text not null default 'user';
alter table public.profiles add column if not exists phone text;

alter table public.books add column if not exists college_id uuid;
alter table public.books add column if not exists is_demo boolean not null default false;
alter table public.books add column if not exists data_type text not null default 'real';
alter table public.books add column if not exists seller_phone text;
alter table public.books add column if not exists seller_email text;

alter table public.colleges add column if not exists courses text[] not null default array['Diploma'];
alter table public.colleges add column if not exists popular_branches text[] not null default array[]::text[];
alter table public.colleges add column if not exists image text;
alter table public.colleges add column if not exists status text not null default 'active';
alter table public.colleges add column if not exists is_official boolean not null default true;
alter table public.colleges add column if not exists book_count integer not null default 0;
alter table public.colleges add column if not exists is_demo boolean not null default false;
alter table public.colleges add column if not exists data_type text not null default 'real';

-- Only add the foreign key when legacy rows do not block it.
update public.books b
set college_id = c.id
from public.colleges c
where b.college_id is null and b.college = c.name;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'books_college_id_fkey') then
    alter table public.books add constraint books_college_id_fkey foreign key (college_id) references public.colleges(id) on delete set null;
  end if;
end $$;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  buyer_id text,
  buyer_name text not null,
  buyer_email text,
  buyer_phone text,
  seller_id text,
  seller_name text not null,
  college text not null,
  last_message text not null default '',
  last_message_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'flagged', 'closed')),
  messages_count integer not null default 0,
  unread_count integer not null default 0,
  is_moderated boolean not null default false,
  is_demo boolean not null default false,
  data_type text not null default 'real' check (data_type in ('demo', 'real')),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id text,
  sender_name text not null,
  sender_role text not null check (sender_role in ('buyer', 'seller', 'admin')),
  content text not null check (char_length(content) between 1 and 4000),
  is_read boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists books_college_id_idx on public.books(college_id);
create index if not exists books_status_college_idx on public.books(status, college_id);
create index if not exists conversations_book_id_idx on public.conversations(book_id);
create index if not exists conversations_last_message_idx on public.conversations(last_message_at desc);
create index if not exists conversations_unread_idx on public.conversations(unread_count) where unread_count > 0;
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false);
$$;

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Buyers/sellers can see only their own conversations; admins can moderate all of them.
drop policy if exists "Admins manage conversations" on public.conversations;
create policy "Admins manage conversations" on public.conversations for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Participants view conversations" on public.conversations;
create policy "Participants view conversations" on public.conversations for select using (auth.uid()::text = buyer_id or auth.uid()::text = seller_id);
drop policy if exists "Buyers create conversations" on public.conversations;
create policy "Buyers create conversations" on public.conversations for insert with check (buyer_id = auth.uid()::text or buyer_id is null);

 drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages" on public.messages for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Participants view messages" on public.messages;
create policy "Participants view messages" on public.messages for select using (
  exists (select 1 from public.conversations c where c.id = conversation_id and (c.buyer_id = auth.uid()::text or c.seller_id = auth.uid()::text))
);
drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages" on public.messages for insert with check (
  exists (select 1 from public.conversations c where c.id = conversation_id and (c.buyer_id = auth.uid()::text or c.seller_id = auth.uid()::text or c.buyer_id is null))
);

-- Admin-only policies for private contact and college management.
drop policy if exists "Public read profiles" on public.profiles;
create policy "Users view own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage colleges" on public.colleges;
create policy "Admins manage colleges" on public.colleges for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.delete_demo_chats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count integer;
begin
  if not public.is_admin() then raise exception 'admin access required'; end if;
  delete from public.conversations where is_demo = true or data_type = 'demo';
  get diagnostics deleted_count = row_count;
  return json_build_object('deleted_conversations', deleted_count);
end;
$$;

revoke all on function public.delete_demo_chats() from public;
grant execute on function public.delete_demo_chats() to authenticated;

-- Keep counts database-driven. This view is safe to query from admin code.
create or replace view public.college_book_statistics as
select c.id, c.name, c.city, c.state,
  count(b.id) filter (where b.status <> 'archived')::integer as book_count,
  count(b.id) filter (where b.status = 'approved')::integer as approved_count,
  count(b.id) filter (where b.status = 'pending')::integer as pending_count,
  count(b.id) filter (where b.status = 'rejected')::integer as rejected_count
from public.colleges c
left join public.books b on b.college_id = c.id or (b.college_id is null and b.college = c.name)
group by c.id, c.name, c.city, c.state;

create table if not exists public.site_settings (
  key text primary key,
  value boolean not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('buyerMobileRequired', true),
  ('adminInquiryApproval', true),
  ('privateConversation', true),
  ('smsNotification', true),
  ('contactSharing', false),
  ('antiSpamProtection', true)
on conflict (key) do nothing;

create table if not exists public.book_inquiries (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  buyer_id text,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_email text,
  seller_id text,
  seller_name text not null,
  college text not null,
  message text not null check (char_length(message) between 1 and 4000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'seller_accepted', 'seller_rejected', 'active', 'closed', 'sold', 'cancelled')),
  approval_required boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id text not null,
  kind text not null,
  title text not null,
  body text not null,
  inquiry_id uuid references public.book_inquiries(id) on delete cascade,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_blocks (
  blocker_id text not null,
  blocked_id text not null,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create index if not exists inquiries_book_idx on public.book_inquiries(book_id);
create index if not exists inquiries_buyer_idx on public.book_inquiries(buyer_id);
create index if not exists inquiries_seller_idx on public.book_inquiries(seller_id);
create index if not exists inquiries_status_idx on public.book_inquiries(status, created_at desc);
create index if not exists notifications_recipient_idx on public.notifications(recipient_id, is_read, created_at desc);

alter table public.site_settings enable row level security;
alter table public.book_inquiries enable row level security;
alter table public.notifications enable row level security;
alter table public.user_blocks enable row level security;

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public read marketplace settings" on public.site_settings;
create policy "Public read marketplace settings" on public.site_settings for select using (true);
drop policy if exists "Admins manage inquiries" on public.book_inquiries;
create policy "Admins manage inquiries" on public.book_inquiries for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Buyers view own inquiries" on public.book_inquiries;
create policy "Buyers view own inquiries" on public.book_inquiries for select using (buyer_id = auth.uid()::text);
drop policy if exists "Buyers create inquiries" on public.book_inquiries;
create policy "Buyers create inquiries" on public.book_inquiries for insert with check (buyer_id = auth.uid()::text or buyer_id is null);
drop policy if exists "Users view own notifications" on public.notifications;
create policy "Users view own notifications" on public.notifications for select using (recipient_id = auth.uid()::text or public.is_admin());
drop policy if exists "Users manage own blocks" on public.user_blocks;
create policy "Users manage own blocks" on public.user_blocks for all using (blocker_id = auth.uid()::text) with check (blocker_id = auth.uid()::text);
