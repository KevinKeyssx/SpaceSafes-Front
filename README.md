# SpaceSafes: Tu Espacio Seguro Digital

![SpaceSafes Logo](public/logo.png)

## Acerca del Proyecto

SpaceSafes es una plataforma de gestión de información personal segura desarrollada para la Hackathon de Clerk 2025. La aplicación proporciona un espacio centralizado y seguro donde los usuarios pueden almacenar y gestionar sus cuentas, enlaces, balances financieros, notas y más, todo protegido con la autenticación avanzada de Clerk.

### ¿Por qué SpaceSafes?

En un mundo digital donde manejamos decenas de cuentas, contraseñas y datos personales, SpaceSafes ofrece:

- **Acceso unificado**: Un solo lugar para todas tus cuentas y datos importantes
- **Experiencia fluida**: Interfaz moderna e intuitiva que funciona en cualquier dispositivo
- **Privacidad por diseño**: Tu información nunca se comparte con terceros


## Crear una cuenta en SpaceSafes

Para crear una cuenta, debes:
1. Iniciar sesión con Clerk
2. Dirigete a la página cuentas de SpaceSafes
3. Darle click al botón "Crear Cuenta"
4. Llenar los campos requeridos
5. Darle click al botón "Guardar"

![Crear Cuenta](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747793827/space-safes/demo/account/Create_account_uhjdir.gif)

## Crear un balance en SpaceSafes

Para crear un balance, debes:
1. Iniciar sesión con Clerk
2. Dirigete a la página balances de SpaceSafes
3. Darle click al botón "Crear Balance"
4. Llenar los campos requeridos
5. Darle click al botón "Guardar"

![Crear Balance](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747793993/space-safes/demo/balance/Create_account_nihhxi.gif)

## Crear un enlace en SpaceSafes

Para crear un enlace, debes:
1. Iniciar sesión con Clerk
2. Dirigete a la página enlaces de SpaceSafes
3. Darle click al botón "Crear Enlace"
4. Llenar los campos requeridos
5. Darle click al botón "Guardar"

![Crear Enlace](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747795674/space-safes/demo/navly/Create_navly_oipq4n.gif)

## Crear un servicio de pago en SpaceSafes

Para crear un servicio de pago, debes:
1. Iniciar sesión con Clerk
2. Dirigete a la página servicios de SpaceSafes
3. Seleccionar un servicio
4. Seleccionar un enlace (opcional)
5. Darle click al botón "Agregar"

![Crear Servicio de Pago](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747796076/space-safes/demo/services/Create_service_ligfjy.gif)


## Crear pagos en SpaceSafes

Para crear un pago, debes:
1. Iniciar sesión con Clerk
2. Dirigete a la página pagos de SpaceSafes
3. Debes seleccionar el medio de pago de los balances disponibles
4. Puedes seleccionar varios servicios de pago e ir cambiando de balances como desees
5. Darle click al botón "Realizar Pago"

![Crear Pago](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747796430/space-safes/demo/payment/Create_payments_f0i2hl.gif)


## SpaceSafes en acción

Queremos que registrar tus pagos sea lo más sencillo posible, por eso SpaceSafes te permite registrar tus pagos de manera rápida y cómoda.

- Puedes ver tus pagos como un historial moviendote de fecha así puedes ver tus pagos en el tiempo en el que se hicieron.
- Cada pado descuenta de tu saldo de tu balance por eso es muy importante que todos tus pagos los vayas registrando.
- Recuerda crear tus servicios de pago para que puedas registrar tus pagos de forma rápida y cómoda.


## Futuras funcionalidades

- Adminitrador de notas
- Adminitrador de servicios, podrías agregar más tipos de servicios de pago
- Adminitrador de notas de voz.
- Agregar tipos de pagos trimestrales, semestrales y anuales.
- Optimizar y mejorar la experiencia de usuario.

![Historial de pagos](https://res.cloudinary.com/dbgzsikcs/image/upload/v1747796985/space-safes/demo/payment/historial_de_pagos_kxrlep.gif)


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
