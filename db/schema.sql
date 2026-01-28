-- ==========================================
-- ONE-Platform 数据库架构全集 (Master Ledger)
-- 版本: v1.0 (MVP 正式发布版)
-- 状态: 已投产 (Production Ready)
-- 更新日期: 2026-01-18
-- ==========================================

-- ------------------------------------------
-- 1. 项目表 (Projects)
-- ------------------------------------------
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  status text not null default 'ongoing',
  budget numeric,
  user_id uuid references auth.users not null
);
alter table projects enable row level security;
create policy "Users can manage their own projects" on projects for all using (auth.uid() = user_id);

-- ------------------------------------------
-- 2. 专利表 (Patents)
-- ------------------------------------------
create table if not exists patents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null,
  status text not null default 'draft',
  application_no text,
  file_url text,
  user_id uuid references auth.users not null
);
alter table patents enable row level security;
create policy "Users can manage their own patents" on patents for all using (auth.uid() = user_id);

-- ------------------------------------------
-- 3. 证照表 (Licenses)
-- ------------------------------------------
create table if not exists licenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null,
  status text not null default 'valid',
  expire_date date,
  file_url text,
  user_id uuid references auth.users not null
);
alter table licenses enable row level security;
create policy "Users can manage their own licenses" on licenses for all using (auth.uid() = user_id);

-- ------------------------------------------
-- 4. 客户表 (Customers)
-- ------------------------------------------
create table if not exists customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  contact_name text,
  phone text,
  email text,
  address text,
  status text default 'active',
  user_id uuid references auth.users not null
);
alter table customers enable row level security;
create policy "Users can manage their own customers" on customers for all using (auth.uid() = user_id);

-- ------------------------------------------
-- 5. 用户档案表 (Profiles)
-- ------------------------------------------
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  company_name text,
  department text,   -- [新增] 部门字段
  job_title text
);
-- ... (RLS 策略保持不变)
alter table profiles enable row level security;
-- 允许用户管理自己的档案 (增删改查)
-- 这是一个"超级策略"，允许 INSERT 和 UPDATE
create policy "Users can manage their own profiles" 
on profiles for all 
to authenticated 
using (auth.uid() = id) 
with check (auth.uid() = id);

-- ------------------------------------------
-- 6. 存储桶策略 (Storage)
-- ------------------------------------------
-- Bucket: 'one-platform-files'
-- 策略已在 Supabase 界面配置，此处为记录
-- 1. Insert: authenticated
-- 2. Select: authenticated
-- 3. Update: authenticated