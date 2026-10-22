# Blue Velvet Restaurant & Coctelería de Autor - Web Client

Cliente web oficial para **Blue Velvet Restaurant & Coctelería de Autor**, plataforma de alta cocina y mixología contemporánea desarrollada para el curso **DOSW**.

---

## Estructura del Proyecto (Arquitectura Nivel 2)

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
