-- Script para corregir políticas RLS de Supabase
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- 1. Agregar campos de auditoría si no existen
DO $$
BEGIN
    -- Agregar campo created_by si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'caregivers' AND column_name = 'created_by') THEN
        ALTER TABLE public.caregivers ADD COLUMN created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
    END IF;
    
    -- Agregar campo updated_by si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'caregivers' AND column_name = 'updated_by') THEN
        ALTER TABLE public.caregivers ADD COLUMN updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
    END IF;
    
    -- Agregar campo uploaded_by si no existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'caregiver_documents' AND column_name = 'uploaded_by') THEN
        ALTER TABLE public.caregiver_documents ADD COLUMN uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_caregivers_created_by ON public.caregivers(created_by);

-- 3. Crear función helper si no existe
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

-- 4. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "public_can_read_caregivers" ON public.caregivers;
DROP POLICY IF EXISTS "validators_manage_caregivers" ON public.caregivers;
DROP POLICY IF EXISTS "validators_manage_caregiver_documents" ON public.caregiver_documents;
DROP POLICY IF EXISTS "validators_view_caregiver_documents" ON storage.objects;
DROP POLICY IF EXISTS "validators_upload_caregiver_documents" ON storage.objects;
DROP POLICY IF EXISTS "validators_update_caregiver_documents" ON storage.objects;
DROP POLICY IF EXISTS "validators_delete_caregiver_documents" ON storage.objects;

-- 5. Crear nuevas políticas permisivas
-- Políticas para cuidadores
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

-- Políticas para documentos
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

-- Políticas para storage
CREATE POLICY "authenticated_users_view_caregiver_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'caregiver-documents');

CREATE POLICY "authenticated_users_upload_caregiver_documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'caregiver-documents');

CREATE POLICY "authenticated_users_update_caregiver_documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'caregiver-documents')
WITH CHECK (bucket_id = 'caregiver-documents');

CREATE POLICY "authenticated_users_delete_caregiver_documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'caregiver-documents');

-- 6. Verificar que el usuario actual tenga un perfil
INSERT INTO public.user_profiles (id, email, full_name, role)
SELECT 
    auth.uid(),
    auth.jwt() ->> 'email',
    COALESCE(auth.jwt() ->> 'user_metadata' ->> 'full_name', 'Usuario'),
    'caregiver_registrar'
WHERE 
    auth.uid() IS NOT NULL 
    AND NOT EXISTS (
        SELECT 1 FROM public.user_profiles WHERE id = auth.uid()
    );

-- 7. Mensaje de confirmación
SELECT 'Políticas RLS actualizadas correctamente. Los usuarios autenticados ahora pueden crear cuidadores.' as message;



