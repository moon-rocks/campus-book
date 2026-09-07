-- Safe project metadata and file-tree storage.
-- Only sanitized safe files should be inserted into file_tree.
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  description text not null default '',
  author text not null default '',
  technology text not null default '',
  category text not null default '',
  github_url text,
  live_demo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  file_tree jsonb not null default '[]'::jsonb,
  file_count integer not null default 0,
  safe_file_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_created_idx on public.projects(status, created_at desc);
alter table public.projects enable row level security;

drop policy if exists "Public read approved projects" on public.projects;
create policy "Public read approved projects" on public.projects
  for select using (status = 'approved' or public.is_admin());

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.projects_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.projects_set_updated_at();
