-- =============================================================================
-- Seed data for local Supabase development
-- Runs automatically on `supabase db reset`
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Test user for local development
-- Email: auditor@test.local / Password: test123456
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at, confirmation_token,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'authenticated', 'authenticated', 'auditor@test.local',
  crypt('test123456', gen_salt('bf')),
  NOW(), NOW(), NOW(), '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Auditor"}',
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  jsonb_build_object('sub', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'email', 'auditor@test.local'),
  'email', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  NOW(), NOW(), NOW()
)
ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO public.users (id, email, full_name, organization, role) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'auditor@test.local', 'Test Auditor', 'iO', 'auditor')
ON CONFLICT (id) DO NOTHING;

-- Admin test user
-- Email: admin@test.local / Password: test123456
INSERT INTO auth.users (
  instance_id, id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at, confirmation_token,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'authenticated', 'authenticated', 'admin@test.local',
  crypt('test123456', gen_salt('bf')),
  NOW(), NOW(), NOW(), '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test Admin"}',
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  jsonb_build_object('sub', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'email', 'admin@test.local'),
  'email', 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  NOW(), NOW(), NOW()
)
ON CONFLICT (provider_id, provider) DO NOTHING;

INSERT INTO public.users (id, email, full_name, organization, role) VALUES
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'admin@test.local', 'Test Admin', 'iO', 'admin')
ON CONFLICT (id) DO NOTHING;
