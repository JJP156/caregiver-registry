import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos para TypeScript (opcional)
export const CaregiverStatus = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
}

export const DocumentType = {
  ID_FRONT: 'id_front',
  ID_BACK: 'id_back',
  CRIMINAL_RECORD: 'criminal_record'
}

export const DocumentStatus = {
  PENDING: 'pending',
  VALID: 'valid',
  INVALID: 'invalid',
  REQUIRES_RESUBMISSION: 'requires_resubmission'
}

export const LocalityType = {
  MADRID: 'madrid',
  BARCELONA: 'barcelona',
  VALENCIA: 'valencia',
  SEVILLA: 'sevilla',
  ZARAGOZA: 'zaragoza',
  MALAGA: 'malaga',
  MURCIA: 'murcia',
  PALMA: 'palma',
  LAS_PALMAS: 'las_palmas',
  BILBAO: 'bilbao',
  ALICANTE: 'alicante',
  CORDOBA: 'cordoba',
  VALLADOLID: 'valladolid',
  VIGO: 'vigo',
  GIJON: 'gijon',
  HOSPITALET: 'hospitalet',
  VITORIA: 'vitoria',
  GRANADA: 'granada',
  ELCHE: 'elche',
  OVIEDO: 'oviedo'
} 