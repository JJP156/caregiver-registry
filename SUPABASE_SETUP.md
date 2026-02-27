# Configuración de Supabase para Caregiver Registry

## Requisitos Previos

1. Una cuenta en [Supabase](https://supabase.com)
2. Un proyecto de Supabase creado
3. Node.js y npm instalados

## Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima

### 2. Configurar Variables de Entorno

1. Copia el archivo `env.example` a `.env`:
```bash
cp env.example .env
```

2. Edita el archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
VITE_APP_NAME=Caregiver Registry
VITE_APP_VERSION=1.0.0
```

### 3. Ejecutar Migraciones

1. Instala Supabase CLI (opcional):
```bash
npm install -g supabase
```

2. Ejecuta la migración SQL en tu proyecto de Supabase:
   - Ve al dashboard de Supabase
   - Navega a SQL Editor
   - Copia y pega el contenido de `supabase/migrations/20250804194420_caregiver_registration_system.sql`
   - Ejecuta el script

### 4. Configurar Storage

El script de migración ya crea el bucket `caregiver-documents` automáticamente, pero puedes verificar en:
- Dashboard de Supabase → Storage → Buckets

### 5. Configurar Autenticación

1. Ve a Authentication → Settings en el dashboard de Supabase
2. Configura los dominios permitidos para tu aplicación
3. Opcional: Configura proveedores de autenticación adicionales

### 6. Crear Usuario Validador

El script de migración crea automáticamente un usuario validador de prueba:
- Email: `validator@example.com`
- Password: `validator123`

**⚠️ IMPORTANTE**: Cambia esta contraseña en producción.

## Estructura de la Base de Datos

### Tablas Principales

1. **user_profiles**: Perfiles de usuarios del sistema
2. **caregivers**: Información de cuidadores domiciliarios
3. **caregiver_documents**: Documentos subidos por los cuidadores

### Tipos de Estado

- **Caregiver Status**: `pending`, `in_review`, `approved`, `rejected`, `suspended`
- **Document Status**: `pending`, `valid`, `invalid`, `requires_resubmission`
- **Document Types**: `id_front`, `id_back`, `criminal_record`

## Servicios Disponibles

### CaregiverService

```javascript
import { CaregiverService } from './services/caregiverService';

// Obtener cuidadores
const result = await CaregiverService.getCaregivers(page, limit, filters);

// Crear cuidador
const caregiver = await CaregiverService.createCaregiver(caregiverData);

// Actualizar estado
await CaregiverService.updateCaregiverStatus(id, 'approved');

// Subir documento
await CaregiverService.uploadDocument(caregiverId, 'id_front', file);
```

### Hook de Autenticación

```javascript
import { useSupabase } from './hooks/useSupabase';

const { user, loading, signIn, signOut } = useSupabase();
```

## Políticas de Seguridad (RLS)

El sistema incluye Row Level Security configurado:

- **Validadores**: Pueden acceder a todos los datos
- **Usuarios normales**: Solo pueden ver sus propios perfiles
- **Documentos**: Solo accesibles por validadores

## Solución de Problemas

### Error de Conexión

1. Verifica que las variables de entorno estén correctas
2. Asegúrate de que el proyecto de Supabase esté activo
3. Verifica que las políticas RLS permitan el acceso

### Error de Autenticación

1. Verifica que el usuario exista en la tabla `user_profiles`
2. Asegúrate de que el rol sea correcto (`validator`)
3. Verifica las políticas RLS para autenticación

### Error de Storage

1. Verifica que el bucket `caregiver-documents` exista
2. Asegúrate de que las políticas de storage estén configuradas
3. Verifica los tipos de archivo permitidos

## Datos de Prueba

El script de migración incluye datos de prueba:

- 2 cuidadores de ejemplo
- 3 documentos de ejemplo
- 1 usuario validador

Para limpiar los datos de prueba:
```sql
SELECT public.cleanup_mock_data();
```

## Producción

Para usar en producción:

1. Cambia las credenciales de prueba
2. Configura dominios permitidos en autenticación
3. Revisa y ajusta las políticas RLS según necesidades
4. Configura backups automáticos
5. Monitorea el uso de recursos 