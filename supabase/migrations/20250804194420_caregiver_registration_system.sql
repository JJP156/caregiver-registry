-- Location: supabase/migrations/20250804194420_caregiver_registration_system.sql
-- Schema Analysis: Fresh project, no existing tables
-- Integration Type: Complete new schema
-- Dependencies: None

-- 1. Extensions & Types
CREATE TYPE public.caregiver_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'suspended');
CREATE TYPE public.document_type AS ENUM ('id_front', 'id_back', 'criminal_record');
CREATE TYPE public.document_status AS ENUM ('pending', 'valid', 'invalid', 'requires_resubmission');
CREATE TYPE public.locality_type AS ENUM (
    'madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 
    'malaga', 'murcia', 'palma', 'las_palmas', 'bilbao',
    'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon',
    'hospitalet', 'vitoria', 'granada', 'elche', 'oviedo'
);

-- 2. Core Tables
-- User profiles table (CRITICAL: Intermediary for PostgREST)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'caregiver_registrar',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Caregivers table
CREATE TABLE public.caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    locality public.locality_type NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status public.caregiver_status DEFAULT 'pending'::public.caregiver_status,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ
);

-- Documents table
CREATE TABLE public.caregiver_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID REFERENCES public.caregivers(id) ON DELETE CASCADE,
    document_type public.document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    status public.document_status DEFAULT 'pending'::public.document_status,
    validation_notes TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMPTZ,
    validated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    UNIQUE(caregiver_id, document_type)
);

-- 3. Indexes
CREATE INDEX idx_caregivers_status ON public.caregivers(status);
CREATE INDEX idx_caregivers_locality ON public.caregivers(locality);
CREATE INDEX idx_caregivers_email ON public.caregivers(email);
CREATE INDEX idx_caregivers_created_by ON public.caregivers(created_by);
CREATE INDEX idx_caregiver_documents_caregiver_id ON public.caregiver_documents(caregiver_id);
CREATE INDEX idx_caregiver_documents_status ON public.caregiver_documents(status);
CREATE INDEX idx_caregiver_documents_type ON public.caregiver_documents(document_type);

-- 4. Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'caregiver-documents',
    'caregiver-documents',
    false,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf']
);

-- 5. Helper Functions (Must be BEFORE RLS policies)
CREATE OR REPLACE FUNCTION public.is_caregiver_registrar()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('caregiver_registrar', 'validator', 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.is_validator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('validator', 'admin')
)
$$;

-- 6. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_documents ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Caregivers - Allow authenticated users to create and view
CREATE POLICY "authenticated_users_can_create_caregivers"
ON public.caregivers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_view_caregivers"
ON public.caregivers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "caregiver_registrars_can_update_caregivers"
ON public.caregivers
FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR public.is_caregiver_registrar())
WITH CHECK (created_by = auth.uid() OR public.is_caregiver_registrar());

-- Pattern 3: Documents - Allow authenticated users to create and view
CREATE POLICY "authenticated_users_can_create_documents"
ON public.caregiver_documents
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_users_can_view_documents"
ON public.caregiver_documents
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "caregiver_registrars_can_update_documents"
ON public.caregiver_documents
FOR UPDATE
TO authenticated
USING (uploaded_by = auth.uid() OR public.is_caregiver_registrar())
WITH CHECK (uploaded_by = auth.uid() OR public.is_caregiver_registrar());

-- Storage RLS Policies
-- Pattern 1: Private caregiver documents - authenticated users can access
CREATE POLICY "authenticated_users_view_caregiver_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'caregiver-documents'
);

CREATE POLICY "authenticated_users_upload_caregiver_documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'caregiver-documents'
);

CREATE POLICY "authenticated_users_update_caregiver_documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'caregiver-documents'
)
WITH CHECK (
    bucket_id = 'caregiver-documents'
);

CREATE POLICY "authenticated_users_delete_caregiver_documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'caregiver-documents'
);

-- 8. Triggers and Functions for Automation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'caregiver_registrar')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_caregivers_updated_at
    BEFORE UPDATE ON public.caregivers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Mock Data for Testing
DO $$
DECLARE
    validator_id UUID := gen_random_uuid();
    caregiver1_id UUID := gen_random_uuid();
    caregiver2_id UUID := gen_random_uuid();
BEGIN
    -- Create validator user
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (validator_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'validator@example.com', crypt('validator123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Document Validator", "role": "validator"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample caregivers
    INSERT INTO public.caregivers (id, first_name, last_name, birth_date, locality, phone, email, status) VALUES
        (caregiver1_id, 'Maria', 'Garcia Lopez', '1985-03-15', 'madrid'::public.locality_type, '+34 666 123 456', 'maria.garcia@example.com', 'pending'::public.caregiver_status),
        (caregiver2_id, 'Carlos', 'Rodriguez Martinez', '1978-11-22', 'barcelona'::public.locality_type, '+34 677 789 012', 'carlos.rodriguez@example.com', 'in_review'::public.caregiver_status);

    -- Create sample document records (files would be uploaded separately)
    INSERT INTO public.caregiver_documents (caregiver_id, document_type, file_name, file_path, file_size, mime_type, status) VALUES
        (caregiver1_id, 'id_front'::public.document_type, 'dni_front_maria.jpg', 'caregiver-documents/' || caregiver1_id::text || '/dni_front.jpg', 2048576, 'image/jpeg', 'pending'::public.document_status),
        (caregiver1_id, 'id_back'::public.document_type, 'dni_back_maria.jpg', 'caregiver-documents/' || caregiver1_id::text || '/dni_back.jpg', 1924876, 'image/jpeg', 'pending'::public.document_status),
        (caregiver2_id, 'criminal_record'::public.document_type, 'antecedentes_carlos.pdf', 'caregiver-documents/' || caregiver2_id::text || '/criminal_record.pdf', 512000, 'application/pdf', 'valid'::public.document_status);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting mock data: %', SQLERRM;
END $$;

-- 10. Cleanup function for testing (optional)
CREATE OR REPLACE FUNCTION public.cleanup_mock_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete in dependency order
    DELETE FROM public.caregiver_documents WHERE caregiver_id IN (
        SELECT id FROM public.caregivers WHERE email LIKE '%@example.com'
    );
    DELETE FROM public.caregivers WHERE email LIKE '%@example.com';
    DELETE FROM public.user_profiles WHERE email LIKE '%@example.com';
    DELETE FROM auth.users WHERE email LIKE '%@example.com';
    
    RAISE NOTICE 'Mock data cleaned up successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;