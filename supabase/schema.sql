-- ============================================================================
-- Atlas AI Education — Authoritative Supabase PostgreSQL Schema & RLS Policies
-- Execute this file once in your Supabase Project -> SQL Editor.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (1:1 with auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  phone text default '',
  city_district text default '',
  country text default 'Bangladesh',
  education_level text default '',
  profession_role text default '',
  organization text default '',
  short_bio text default '',
  preferred_language text not null default 'Bilingual' check (preferred_language in ('Bangla', 'English', 'Bilingual')),
  avatar_url text default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  account_status text not null default 'pending_verification' check (account_status in ('pending_verification', 'active', 'suspended', 'deactivated')),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Helper: check if current authenticated user is an active admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

-- Trigger on auth.users creation to provision public.profiles safely (never auto-grants admin)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    preferred_language,
    marketing_opt_in,
    role,
    account_status
  )
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'preferred_language', 'Bilingual'),
    coalesce((new.raw_user_meta_data->>'marketing_opt_in')::boolean, false),
    'user',
    case when new.email_confirmed_at is not null then 'active' else 'pending_verification' end
  )
  on conflict (id) do update
    set email = excluded.email,
        account_status = case when new.email_confirmed_at is not null and public.profiles.account_status = 'pending_verification'
                              then 'active'
                              else public.profiles.account_status end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sync email verification status when auth.users is updated
create or replace function public.handle_user_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null and old.email_confirmed_at is null then
    update public.profiles
    set account_status = 'active'
    where id = new.id and account_status = 'pending_verification';
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_verified on auth.users;
create trigger on_auth_user_verified
  after update of email_confirmed_at on auth.users
  for each row execute function public.handle_user_verified();

-- ----------------------------------------------------------------------------
-- 2. PAYMENT SETTINGS (Configured by Admin — NO invented recipient numbers)
-- ----------------------------------------------------------------------------
create table if not exists public.payment_settings (
  method text primary key check (method in ('bkash', 'nagad')),
  account_number text,
  account_type text default 'Personal / Merchant (Configure in Admin)',
  instructions text default 'Send exact course fee via Send Money / Payment and enter your sender mobile number and Transaction ID (TrxID) below.',
  is_enabled boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

insert into public.payment_settings (method, account_number, is_enabled)
values
  ('bkash', null, false),
  ('nagad', null, false)
on conflict (method) do nothing;

-- ----------------------------------------------------------------------------
-- 3. SCHOLARSHIP APPLICATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  education_level text not null,
  profession_role text not null,
  institution_org text default '',
  city_district text not null,
  course_code text not null,
  course_title text not null,
  learning_motivation text not null,
  financial_need text not null,
  educational_relevance text not null,
  commitment_statement text not null,
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'approved', 'partially_approved', 'rejected')),
  approved_waiver_percent integer not null default 0 check (approved_waiver_percent >= 0 and approved_waiver_percent <= 50),
  remaining_payable_bdt integer,
  admin_notes text default '',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_scholarship_updated_at on public.scholarship_applications;
create trigger trg_scholarship_updated_at
  before update on public.scholarship_applications
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. ENROLMENTS
-- ----------------------------------------------------------------------------
create table if not exists public.enrolments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  programme_code text not null,
  programme_title text not null,
  programme_type text not null check (programme_type in ('course', 'specialized')),
  category_id text not null,
  cohort_name text default 'Upcoming Cohort',
  status text not null default 'pending_payment' check (status in ('pending_payment', 'active', 'upcoming', 'completed', 'revoked', 'cancelled')),
  regular_fee_bdt integer not null default 0,
  discounted_fee_bdt integer not null default 0,
  scholarship_discount_bdt integer not null default 0,
  payable_fee_bdt integer not null default 0,
  scholarship_id uuid references public.scholarship_applications(id) on delete set null,
  enrolled_at timestamptz not null default now(),
  activated_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, programme_code)
);

drop trigger if exists trg_enrolments_updated_at on public.enrolments;
create trigger trg_enrolments_updated_at
  before update on public.enrolments
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5. MANUAL PAYMENTS (bKash / Nagad / Free Enrolment Record)
-- ----------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  enrolment_id uuid not null references public.enrolments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  programme_code text not null,
  programme_title text not null,
  method text not null check (method in ('bkash', 'nagad', 'free')),
  sender_number text not null default '',
  transaction_id text not null default '',
  amount_bdt integer not null check (amount_bdt >= 0),
  currency text not null default 'BDT',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'partial', 'refunded')),
  receipt_number text unique,
  student_notes text default '',
  admin_notes text default '',
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 6. LEARNING PROGRESS
-- ----------------------------------------------------------------------------
create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  programme_code text not null,
  completed_modules jsonb not null default '[]'::jsonb,
  completed_sessions jsonb not null default '[]'::jsonb,
  completion_percentage integer not null default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  last_activity_at timestamptz not null default now(),
  unique (user_id, programme_code)
);

-- ----------------------------------------------------------------------------
-- 7. CLASS SCHEDULES (Admin-published live sessions)
-- ----------------------------------------------------------------------------
create table if not exists public.class_schedules (
  id uuid primary key default gen_random_uuid(),
  programme_code text not null,
  cohort_name text not null default 'Current Cohort',
  session_title text not null,
  session_date date not null,
  start_time text not null,
  end_time text not null,
  timezone text not null default 'Asia/Dhaka (BST)',
  delivery_mode text not null default 'Live Online',
  meeting_link text default '',
  instructor_notes text default '',
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 8. ASSIGNMENTS & SUBMISSIONS
-- ----------------------------------------------------------------------------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  programme_code text not null,
  title text not null,
  description text not null,
  instructions text default '',
  due_date timestamptz,
  is_published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  submission_text text not null,
  submission_url text default '',
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'reviewed', 'revision_requested')),
  feedback text default '',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (assignment_id, user_id)
);

-- ----------------------------------------------------------------------------
-- 9. CERTIFICATES (Issued by Admin & Verifiable Publicly by Certificate Code)
-- ----------------------------------------------------------------------------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  certificate_code text unique not null,
  participant_name text not null,
  programme_code text not null,
  programme_title text not null,
  certificate_type text not null check (
    certificate_type in (
      'Certificate of Participation',
      'Foundation Certificate',
      'Professional Development Certificate',
      'Executive Development Certificate',
      'Specialised Professional Certificate'
    )
  ),
  issue_date date not null default current_date,
  status text not null default 'valid' check (status in ('valid', 'revoked')),
  revoked_reason text default '',
  issued_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 10. SAVED RESOURCES, NOTIFICATIONS & SUPPORT TICKETS
-- ----------------------------------------------------------------------------
create table if not exists public.saved_resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resource_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  category text not null default 'system' check (category in ('enrolment', 'payment', 'scholarship', 'schedule', 'certificate', 'system')),
  is_read boolean not null default false,
  link_url text default '/dashboard',
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  category text not null default 'General',
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  admin_reply text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tickets_updated_at on public.support_tickets;
create trigger trg_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 11. PUBLIC CONTACT & INSTITUTIONAL TRAINING ENQUIRIES
-- ----------------------------------------------------------------------------
create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  organization text default '',
  subject text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.institutional_enquiries (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text not null,
  role_title text not null,
  email text not null,
  phone text not null,
  sector_type text not null,
  participant_count text not null,
  delivery_format text not null,
  areas_of_interest jsonb not null default '[]'::jsonb,
  timeline text default '',
  objectives text not null,
  status text not null default 'new' check (status in ('new', 'scoping', 'proposal_sent', 'closed')),
  admin_notes text default '',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.payment_settings enable row level security;
alter table public.scholarship_applications enable row level security;
alter table public.enrolments enable row level security;
alter table public.payments enable row level security;
alter table public.learning_progress enable row level security;
alter table public.class_schedules enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.certificates enable row level security;
alter table public.saved_resources enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.institutional_enquiries enable row level security;

-- PROFILES: User can view/update own non-privileged columns; Admin can read/manage all
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
  );

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- PAYMENT SETTINGS: Public read (for checkout display), Admin write
drop policy if exists "payment_settings_public_read" on public.payment_settings;
create policy "payment_settings_public_read" on public.payment_settings
  for select using (true);

drop policy if exists "payment_settings_admin_write" on public.payment_settings;
create policy "payment_settings_admin_write" on public.payment_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- SCHOLARSHIPS: User reads/inserts own; Admin full control
drop policy if exists "scholarships_select_own_or_admin" on public.scholarship_applications;
create policy "scholarships_select_own_or_admin" on public.scholarship_applications
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "scholarships_insert_own" on public.scholarship_applications;
create policy "scholarships_insert_own" on public.scholarship_applications
  for insert with check (auth.uid() = user_id);

drop policy if exists "scholarships_admin_update" on public.scholarship_applications;
create policy "scholarships_admin_update" on public.scholarship_applications
  for update using (public.is_admin()) with check (public.is_admin());

-- ENROLMENTS: User reads own; Admin manages all
drop policy if exists "enrolments_select_own_or_admin" on public.enrolments;
create policy "enrolments_select_own_or_admin" on public.enrolments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "enrolments_insert_own" on public.enrolments;
create policy "enrolments_insert_own" on public.enrolments
  for insert with check (auth.uid() = user_id);

drop policy if exists "enrolments_admin_all" on public.enrolments;
create policy "enrolments_admin_all" on public.enrolments
  for all using (public.is_admin()) with check (public.is_admin());

-- PAYMENTS: User reads/submits own (always status='pending'); Admin verifies/updates
drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin" on public.payments
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- LEARNING PROGRESS: User owns their progress; Admin reads all
drop policy if exists "progress_own_all" on public.learning_progress;
create policy "progress_own_all" on public.learning_progress
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- CLASS SCHEDULES & ASSIGNMENTS: Enrolled active learners or Admins can view; Admins manage
drop policy if exists "schedules_enrolled_or_admin" on public.class_schedules;
create policy "schedules_enrolled_or_admin" on public.class_schedules
  for select using (
    public.is_admin()
    or (
      is_published = true
      and exists (
        select 1 from public.enrolments e
        where e.user_id = auth.uid()
          and e.programme_code = class_schedules.programme_code
          and e.status in ('active', 'upcoming', 'completed')
      )
    )
  );

drop policy if exists "schedules_admin_all" on public.class_schedules;
create policy "schedules_admin_all" on public.class_schedules
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "assignments_enrolled_or_admin" on public.assignments;
create policy "assignments_enrolled_or_admin" on public.assignments
  for select using (
    public.is_admin()
    or (
      is_published = true
      and exists (
        select 1 from public.enrolments e
        where e.user_id = auth.uid()
          and e.programme_code = assignments.programme_code
          and e.status in ('active', 'completed')
      )
    )
  );

drop policy if exists "assignments_admin_all" on public.assignments;
create policy "assignments_admin_all" on public.assignments
  for all using (public.is_admin()) with check (public.is_admin());

-- ASSIGNMENT SUBMISSIONS: User owns own; Admin reads/reviews
drop policy if exists "submissions_own_or_admin" on public.assignment_submissions;
create policy "submissions_own_or_admin" on public.assignment_submissions
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- CERTIFICATES: User reads own; Public verify handled via RPC/API; Admin manages all
drop policy if exists "certificates_own_or_admin" on public.certificates;
create policy "certificates_own_or_admin" on public.certificates
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "certificates_admin_all" on public.certificates;
create policy "certificates_admin_all" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

-- Public certificate verification RPC (safe: only returns certificate by exact code)
create or replace function public.verify_certificate_by_code(p_code text)
returns table (
  certificate_code text,
  participant_name text,
  programme_code text,
  programme_title text,
  certificate_type text,
  issue_date date,
  status text,
  revoked_reason text
)
language sql
security definer
set search_path = public
as $$
  select
    c.certificate_code,
    c.participant_name,
    c.programme_code,
    c.programme_title,
    c.certificate_type,
    c.issue_date,
    c.status,
    c.revoked_reason
  from public.certificates c
  where upper(trim(c.certificate_code)) = upper(trim(p_code))
  limit 1;
$$;

-- SAVED RESOURCES & NOTIFICATIONS & SUPPORT TICKETS
drop policy if exists "saved_resources_own" on public.saved_resources;
create policy "saved_resources_own" on public.saved_resources
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "notifications_own_select_update_delete" on public.notifications;
create policy "notifications_own_select_update_delete" on public.notifications
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "tickets_own_or_admin" on public.support_tickets;
create policy "tickets_own_or_admin" on public.support_tickets
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- ENQUIRIES: Anyone can insert (server-side API recommended), only Admin can read/update
drop policy if exists "contact_enquiries_admin_read" on public.contact_enquiries;
create policy "contact_enquiries_admin_read" on public.contact_enquiries
  for select using (public.is_admin());

drop policy if exists "contact_enquiries_admin_update" on public.contact_enquiries;
create policy "contact_enquiries_admin_update" on public.contact_enquiries
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "institutional_enquiries_admin_read" on public.institutional_enquiries;
create policy "institutional_enquiries_admin_read" on public.institutional_enquiries
  for select using (public.is_admin());

drop policy if exists "institutional_enquiries_admin_update" on public.institutional_enquiries;
create policy "institutional_enquiries_admin_update" on public.institutional_enquiries
  for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- HOW TO GRANT ADMIN ROLE TO AN OWNER ACCOUNT:
-- After signing up and verifying your email, run:
--   update public.profiles set role = 'admin', account_status = 'active'
--   where email = 'your-admin-email@example.com';
-- ============================================================================
