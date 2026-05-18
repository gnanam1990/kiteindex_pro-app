create table kp_users (
  id text primary key default ('usr_' || lower(replace(gen_random_uuid()::text, '-', ''))),
  owner_address text unique not null,
  email text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise', 'free_oss')),
  created_at timestamptz default now()
);

create table kp_api_keys (
  id text primary key default ('key_' || lower(replace(gen_random_uuid()::text, '-', ''))),
  user_id text references kp_users(id) on delete cascade,
  key_hash text unique not null,
  name text not null,
  rate_limit int default 10,
  monthly_quota int default 100000,
  usage_count int default 0,
  status text default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz default now()
);

create table kp_usage (
  id bigserial primary key,
  api_key_id text references kp_api_keys(id),
  endpoint text not null,
  response_time_ms int,
  created_at timestamptz default now()
);

create index idx_api_keys_hash on kp_api_keys(key_hash);
create index idx_usage_key on kp_usage(api_key_id);
create index idx_usage_created on kp_usage(created_at);
