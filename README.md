# Caregiver Registry

Un sistema moderno de registro y gestión de cuidadores domiciliarios construido con React y Supabase.

## 🚀 Características

- **Gestión de Cuidadores**: Registro, validación y seguimiento de cuidadores
- **Sistema de Documentos**: Subida y validación de documentos (DNI, antecedentes penales)
- **Panel de Administración**: Dashboard completo para validadores
- **Autenticación Segura**: Sistema de autenticación con Supabase
- **Base de Datos en Tiempo Real**: Sincronización en tiempo real con Supabase
- **Interfaz Responsiva**: Diseño adaptativo para todos los dispositivos

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerrequisitos

- Node.js (v14.x o superior)
- npm o yarn
- Cuenta en [Supabase](https://supabase.com)

## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd caregiverregistry
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura Supabase:
   - Sigue las instrucciones en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Copia `env.example` a `.env` y configura las variables

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## 📁 Estructura del Proyecto

```
caregiverregistry/
├── public/                    # Assets estáticos
├── src/
│   ├── components/           # Componentes UI reutilizables
│   ├── pages/               # Páginas de la aplicación
│   │   ├── authentication-login/     # Página de login
│   │   ├── caregiver-management-dashboard/  # Dashboard principal
│   │   ├── caregiver-profile-detail-view/   # Vista detallada
│   │   ├── caregiver-registration-form/     # Formulario de registro
│   │   └── document-verification-queue/     # Cola de verificación
│   ├── services/            # Servicios de API
│   │   ├── supabase.js      # Configuración de Supabase
│   │   └── caregiverService.js  # Servicio de cuidadores
│   ├── hooks/               # Hooks personalizados
│   │   └── useSupabase.js   # Hook de autenticación
│   ├── styles/              # Estilos globales
│   ├── utils/               # Utilidades
│   ├── App.jsx              # Componente principal
│   ├── Routes.jsx           # Rutas de la aplicación
│   └── index.jsx            # Punto de entrada
├── supabase/
│   └── migrations/          # Migraciones de base de datos
├── .env                     # Variables de entorno
├── env.example              # Ejemplo de variables
├── SUPABASE_SETUP.md        # Documentación de configuración
└── package.json             # Dependencias y scripts
```

## 🔧 Configuración de Supabase

Para configurar la base de datos y autenticación:

1. **Sigue la guía completa**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **Variables de entorno**: Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
3. **Ejecuta migraciones**: El script SQL crea toda la estructura necesaria

## 📊 Funcionalidades Principales

### Gestión de Cuidadores
- Registro de nuevos cuidadores
- Validación de documentos
- Seguimiento de estados (pendiente, en revisión, aprobado, rechazado)
- Búsqueda y filtrado avanzado

### Sistema de Documentos
- Subida de DNI (frente y reverso)
- Subida de antecedentes penales
- Validación automática y manual
- Almacenamiento seguro en Supabase Storage

### Panel de Administración
- Dashboard con estadísticas
- Vista de tabla y tarjetas
- Acciones masivas
- Exportación de datos

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 🚀 Despliegue

Para desplegar en producción:

```bash
npm run build
```

## 🔒 Seguridad

- Row Level Security (RLS) configurado en Supabase
- Autenticación segura con JWT
- Validación de documentos
- Políticas de acceso por roles

## 🙏 Agradecimientos

- Construido con [Rocket.new](https://rocket.new)
- Alimentado por React y Vite
- Estilizado con Tailwind CSS
- Base de datos y autenticación con Supabase

Construido con ❤️ para el cuidado domiciliario
.
