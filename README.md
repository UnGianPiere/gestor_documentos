# Gestor de Documentos

Sistema moderno de gestión de documentos construido como monorepo con Next.js, TypeScript y MongoDB.

## 🚀 Características

- **Gestión de archivos**: Organiza y administra documentos con categorías y etiquetas
- **Búsqueda avanzada**: Encuentra documentos rápidamente con filtros avanzados
- **Control de acceso**: Gestiona permisos y comparte documentos de forma segura
- **Interfaz moderna**: UI construida con Tailwind CSS y componentes reutilizables
- **Base de datos MongoDB**: Almacenamiento eficiente y escalable
- **TypeScript**: Desarrollo con tipado fuerte para mayor robustez

## 🛠️ Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS, Lucide Icons, Class Variance Authority
- **Backend**: Next.js API Routes, Mongoose
- **Base de datos**: MongoDB
- **Estado**: TanStack Query (React Query)
- **Notificaciones**: React Hot Toast

## 📋 Prerrequisitos

- Node.js 18+
- MongoDB (local o en la nube)
- pnpm (recomendado) o npm

## 🚀 Instalación y Configuración

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env.local` y configura las variables:
   ```bash
   cp .env.example .env.local
   ```

   Variables necesarias:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gestor_documentos_db
   NEXT_PUBLIC_APP_NAME=Gestor de Documentos
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NODE_ENV=development
   PORT=3000
   ```

3. **Iniciar MongoDB**:
   Asegúrate de que MongoDB esté corriendo localmente en el puerto 27017, o actualiza la URI en `.env.local`.

4. **Inicializar la base de datos** (opcional, crea usuarios de prueba):
   ```bash
   pnpm init-db
   ```

   **Credenciales de usuarios creados:**
   - **Admin**: usuario: `admin`, contraseña: `admin123`
   - **Usuario**: usuario: `user`, contraseña: `user123`
   - **Viewer**: usuario: `viewer`, contraseña: `viewer123`

5. **Ejecutar el proyecto**:
   ```bash
   pnpm dev
   ```

   El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas y layouts de Next.js
├── components/            # Componentes reutilizables
│   ├── common/           # Componentes comunes
│   ├── layout/           # Componentes de layout
│   └── ui/               # Componentes de UI base
├── context/              # Contextos de React
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y configuración
├── providers/            # Providers de contexto
├── services/             # Servicios de API
├── types/                # Definiciones de tipos
└── utils/                # Utilidades auxiliares
```

## 🔧 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta ESLint

## 📚 API Routes

El proyecto incluye API routes para:
- Gestión de documentos
- Autenticación de usuarios
- Carga de archivos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Para preguntas o soporte, por favor abre un issue en el repositorio.