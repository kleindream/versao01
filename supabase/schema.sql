-- Kleindream Starter (Supabase) — Schema + RLS
-- 1) Rode isto no SQL Editor do Supabase.
-- 2) Depois crie algumas chaves na tabela invites.

create extension if not exists "uuid-ossp";

-- Perfis
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  created_at timestamptz not null default now()
);

-- Chaves de acesso (invites)
create table if not exists public.invites (
  code text primary key,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  redeemed_by uuid references auth.users(id),
  redeemed_at timestamptz
);

-- Grupos
create table if not exists public.groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Tópicos/Discussões
create table if not exists public.threads (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null,
  author_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

-- Posts dentro do tópico
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- Mural do perfil (mensagens no perfil)
create table if not exists public.profile_posts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- Função para resgatar chave (server-side no DB)
create or replace function public.redeem_invite(p_code text, p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- existe e não foi usada
  update public.invites
    set redeemed_by = p_user_id,
        redeemed_at = now()
  where code = p_code
    and redeemed_by is null;

  if not found then
    raise exception 'invite inválido';
  end if;
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.invites enable row level security;
alter table public.groups enable row level security;
alter table public.threads enable row level security;
alter table public.posts enable row level security;
alter table public.profile_posts enable row level security;

-- Perfis: leitura pública, escrita só do dono
create policy "profiles_read_public" on public.profiles
  for select using (true);

create policy "profiles_write_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Invites: somente leitura/escrita por service role (vamos inserir manualmente pelo painel)
-- Bloqueia acesso via anon/auth.
create policy "invites_no_access" on public.invites
  for all using (false) with check (false);

-- Grupos: leitura pública, criação por logado, edição só do owner
create policy "groups_read_public" on public.groups
  for select using (true);

create policy "groups_insert_auth" on public.groups
  for insert with check (auth.uid() = owner_id);

create policy "groups_update_owner" on public.groups
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "groups_delete_owner" on public.groups
  for delete using (auth.uid() = owner_id);

-- Threads: leitura pública, criação por logado
create policy "threads_read_public" on public.threads
  for select using (true);

create policy "threads_insert_auth" on public.threads
  for insert with check (auth.uid() = author_id);

-- Posts: leitura pública, criação por logado, edição/apagar só do autor
create policy "posts_read_public" on public.posts
  for select using (true);

create policy "posts_insert_auth" on public.posts
  for insert with check (auth.uid() = author_id);

create policy "posts_update_own" on public.posts
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

create policy "posts_delete_own" on public.posts
  for delete using (auth.uid() = author_id);

-- Mural: leitura pública; escrita por logado (qualquer um) — para 1.0.
-- Depois você pode restringir por privacidade do perfil.
create policy "profile_posts_read_public" on public.profile_posts
  for select using (true);

create policy "profile_posts_insert_auth" on public.profile_posts
  for insert with check (auth.uid() = author_id);

create policy "profile_posts_update_own" on public.profile_posts
  for update using (auth.uid() = author_id) with check (auth.uid() = author_id);

create policy "profile_posts_delete_own" on public.profile_posts
  for delete using (auth.uid() = author_id);
