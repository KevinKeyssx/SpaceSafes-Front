# SpaceSafes: Tu Espacio Seguro Digital

![SpaceSafes Logo](public/logo.png)

## Acerca del Proyecto

SpaceSafes es una plataforma de gestión de información personal segura desarrollada para la Hackathon de Clerk 2025. La aplicación proporciona un espacio centralizado y seguro donde los usuarios pueden almacenar y gestionar sus cuentas, enlaces, balances financieros, notas y más, todo protegido con la autenticación avanzada de Clerk.

### ¿Por qué SpaceSafes?

En un mundo digital donde manejamos decenas de cuentas, contraseñas y datos personales, SpaceSafes ofrece:

- **Acceso unificado**: Un solo lugar para todas tus cuentas y datos importantes
- **Experiencia fluida**: Interfaz moderna e intuitiva que funciona en cualquier dispositivo
- **Privacidad por diseño**: Tu información nunca se comparte con terceros

## Tecnologías Utilizadas

### Frontend
- **Astro**: Framework web de alto rendimiento con renderizado híbrido
- **Svelte**: Para componentes interactivos con reactividad eficiente
- **TailwindCSS**: Framework CSS para un diseño moderno y responsive
- **TypeScript**: Tipado estático para un código más robusto

### Autenticación y Seguridad
- **Clerk**: Sistema de autenticación completo y seguro
- **JWT**: Para manejo seguro de sesiones

### Estado y Caché
- **Svelte Stores**: Para estado global de la aplicación

### Herramientas de Desarrollo
- **pnpm**: Gestor de paquetes eficiente y rápido
- **Vite**: Para desarrollo rápido con HMR (Hot Module Replacement)

## Integración con Clerk

SpaceSafes aprovecha al máximo las capacidades de Clerk para ofrecer una experiencia de autenticación segura y sin fricciones:

### Características implementadas con Clerk

- **Autenticación Multi-Factor (MFA)**: Capa adicional de seguridad para proteger las cuentas de los usuarios
- **Social Login**: Inicio de sesión simplificado con proveedores como Google, GitHub, etc.
- **Componentes Personalizados**: UI de autenticación integrada perfectamente con el diseño de la aplicación
- **Protección de Rutas**: Acceso controlado a páginas y recursos basado en el estado de autenticación

### Implementación Técnica

La integración de Clerk en SpaceSafes se realiza mediante:

```typescript
// Componentes de Clerk en el Header
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/astro';

// En el Header.astro
<SignedOut>
  <SignInButton mode='modal' appearance={{
    elements: {
      footer: 'hidden'
    }
  }}/>
</SignedOut>

<SignedIn>
  <UserButton showName appearance={{
    elements: {
      footer: 'hidden',
      userButton: 'text-primary-900 dark:text-primary-100'
    }
  }}/>
</SignedIn>
```

- **Middleware de Astro**: Para protección de rutas y validación de sesiones
- **Context Providers**: Para acceso a datos de usuario en toda la aplicación
- **API Endpoints Protegidos**: Validación de tokens JWT en cada solicitud

## Funcionalidades Principales

- **Enlaces Organizados**: Guarda y categoriza tus enlaces importantes
- **Balances Financieros**: Seguimiento de ingresos y gastos
- **Tarjetas Bancarias**: Gestión segura de información de tarjetas

## Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, desde una terminal:

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`            | Instala dependencias                             |
| `pnpm run dev`            | Inicia servidor de desarrollo en `localhost:4321`|
| `pnpm run build`          | Construye el sitio para producción en `./dist/`  |
| `pnpm run preview`        | Vista previa de la build antes de desplegar      |

## Equipo

SpaceSafes está siendo desarrollado solo por mi @KevinKeyssx, manejando tanto el frontend como el backend.

## Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).
