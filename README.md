# Blue Velvet Restaurant & Coctelería de Autor - Web Client

Cliente web oficial para **Blue Velvet Restaurant & Coctelería de Autor**, plataforma de alta cocina y mixología contemporánea desarrollada para el curso **DOSW**.

---

## 🏛️ Sprint 1: Arquitectura Base Nivel 2, Sistema de Diseño y Enrutamiento SPA

- **Single Page Application (SPA):** Enrutamiento fluido con `react-router-dom` v6 sin recargas de página (`pushState`).
- **Arquitectura Nivel 2:** Separación estricta por tipos de archivos y módulos funcionales (`common`, `auth`, `menu`, `reservations`).
- **Sistema de Diseño Responsivo:** Estilizado mediante Tailwind CSS con paleta temática corporativa (*Velvet Blue*, *Velvet Gold*, fondos oscuros de alto contraste y tipografía *Playfair Display* / *Plus Jakarta Sans*).
- **UX de Alta Conversión:** Landing page diseñada para mitigar las 4 barreras de rechazo (mensaje poco claro, mala UX, carga lenta y falta de confianza).

---

## ⚡ Sprint 2: Capa HTTP con Axios, Interceptores JWT, DTOs y Servicios por Módulo

- **Cliente Axios Centralizado (`src/services/api.js`):**
  - Lectura de URL base desde variable de entorno `VITE_API_BASE_URL` (fallback `http://localhost:8080/api/v1`).
  - Timeout de 10000 ms y cabecera `Content-Type: application/json`.
  - **Request Interceptor:** Inyección automática del token Bearer JWT desde `localStorage` (`blue_velvet_token`).
  - **Response Interceptor:** Manejo de error 401 con limpieza de sesión y redirección a `/login`. Normalización de mensajes de error desde Spring Boot.
- **Contratos DTOs (`src/dtos/`):**
  - `authDTOs.js`: `LoginRequestDTO`, `AuthResponseDTO`.
  - `menuDTOs.js`: `MenuItemDTO`.
  - `bookingDTOs.js`: `CreateBookingRequestDTO`, `BookingResponseDTO`.
- **Servicios por Dominio (`src/services/`):**
  - `authService.js`, `menuService.js`, `bookingService.js`.
- **Estado Global (`src/context/` y `src/hooks/`):**
  - `AuthProvider` y `AuthContext`: Control de `user`, `token`, `loading`, `login` y `logout`.
  - `useAuth()`: Custom Hook con validación de contexto para consumo global.

---

## 💎 Sprint 3: Custom Hooks de Negocio, Componentes Modulares y Pantallas Interactivas

- **Custom Hooks de Dominio (`src/hooks/`):**
  - `useMenu(initialCategory)`: Control reactivo de `items`, `loading`, `error`, `activeCategory`, `setActiveCategory` y `refreshMenu`. Resiliencia automática ante fallos de backend.
  - `useBooking()`: Manejo integral del ciclo de vida de la reserva (`availableSlots`, `loadingSlots`, `submitting`, `bookingSuccess`, `error`, `fetchSlots`, `createReservation`, `resetBooking`).
- **Componentes Modulares de Menú (`src/components/menu/`):**
  - `MenuFilter.jsx`: Barra horizontal con botones de categoría interactivos y realce dorado.
  - `MenuCard.jsx`: Tarjetas con formato de moneda colombiana ($COP), badges de categoría, detalles de ingredientes y botón de acción rápida "Agregar a la Reserva".
- **Componentes Modulares de Reservas (`src/components/reservations/`):**
  - `TimeSlotPicker.jsx`: Cuadrícula interactiva de selección de franjas horarias con estados activo/deshabilitado/cargando.
  - `BookingSummary.jsx`: Resumen de confirmación con código de reserva, detalles de fecha/hora/comensales y acciones inmediatas.
- **Vistas Interactivas con Manejo Completo de Estados (`src/pages/`):**
  - `LoginPage.jsx`: Formulario centrado con validaciones visuales, estado `submitting`, mensajes de alerta y redirección a `/menu`.
  - `MenuPage.jsx`: Integración de `useMenu()`, esqueletos de carga (`loading`), estados vacíos y manejo de errores con reintento.
  - `BookingPage.jsx`: Flujo guiado en dos pasos con `TimeSlotPicker`, selección de comensales, zona, datos del titular y confirmación con `BookingSummary`.

---

## 🚀 Sprint 4: Configuración de Producción, Vercel SPA y Optimización de Builds

- **Enrutamiento SPA y Cabeceras de Seguridad para Vercel (`vercel.json`):**
  - Reescritura universal (`rewrites`) hacia `/index.html` para soporte CDN global de HTML5 pushState.
  - Cabeceras de seguridad estrictas:
    * `X-Content-Type-Options: nosniff`
    * `X-Frame-Options: DENY`
    * `X-XSS-Protection: 1; mode=block`
    * `Referrer-Policy: strict-origin-when-cross-origin`
  - Caché inmutable para activos estáticos (`/assets/(.*)`): `public, max-age=31536000, immutable`.
- **Plantillas Seguras de Variables de Entorno:**
  - `.env.example`: Documentación formal de la variable `VITE_API_BASE_URL`.
  - `.env.production`: Configuración de producción apuntando a la API en Azure Cloud (`https://dosw-parcial-sebastiangranados-fqded5cvd9awgab7.northcentralus-01.azurewebsites.net/api/v1`).
- **Optimización de Build y Previsualización Local (`vite.config.js`):**
  - Carpeta de salida estándar `dist` con limpieza automática (`emptyOutDir: true`).
  - Servidor de previsualización (`preview`) fijado en el puerto 3000 con apertura automática (`open: true`).
- **Validación del Cliente HTTP (`src/services/api.js`):**
  - Inyección dinámica en tiempo de construcción (`import.meta.env.VITE_API_BASE_URL`) sin URLs absolutas quemadas.

---

## 📂 Estructura del Proyecto (Arquitectura Nivel 2)

```text
blue-velvet-front/
├── .env                     # Variables de entorno locales (desarrollo)
├── .env.example             # Plantilla documentada de variables de entorno (Sprint 4)
├── .env.production          # Variables de entorno para producción Azure (Sprint 4)
├── index.html               # Plantilla HTML con Google Fonts y Favicon
├── package.json             # Dependencias del proyecto
├── postcss.config.js        # Configuración PostCSS (Tailwind y Autoprefixer)
├── tailwind.config.js       # Tokens de diseño y paleta de lujo
├── vercel.json              # Configuración de despliegue y cabeceras Vercel (Sprint 4)
├── vite.config.js           # Configuración Vite optimizada (dist y preview 3000)
└── src/
    ├── assets/              # Constantes de marca e institucionales
    ├── components/
    │   ├── auth/            # Componentes de autenticación
    │   ├── common/          # Componentes compartidos globales
    │   ├── menu/            # Componentes de carta y catálogo
    │   ├── modulos/         # Módulos operativos de coctelería
    │   └── reservations/    # Componentes de reservas y turnos
    ├── context/             # Contextos globales (AuthContext, BlueVelvetContext)
    ├── dtos/                # Contratos de transferencia tipados
    ├── hooks/               # Custom Hooks (useAuth, useMenu, useBooking)
    ├── pages/               # Vistas de la aplicación SPA
    ├── routes/              # AppRouter con enrutamiento reactivo
    ├── services/            # Clientes HTTP Axios desacoplados
    ├── styles/              # CSS base y utilidades
    ├── types/               # Modelos y contratos de dominio
    ├── App.jsx              # Raíz con envoltura de proveedores
    └── main.jsx             # Punto de montaje ReactDOM
```

---

## 🛠️ Comandos de Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Abre automáticamente en `http://localhost:3000`.

3. **Construcción para producción:**
   ```bash
   npm run build
   ```
   Genera los archivos optimizados en la carpeta `dist/`.

4. **Previsualización de build de producción:**
   ```bash
   npm run preview
   ```
   Sirve el paquete de producción en `http://localhost:3000`.
