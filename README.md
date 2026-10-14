# 🛒 MarketYa! — Control de Inventarios, POS Táctil y Facturación Electrónica SUNAT

[![Angular 22](https://img.shields.io/badge/Angular-22.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![daisyUI 5](https://img.shields.io/badge/daisyUI-5.0.0-1AD1A5?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.4-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![Storybook 10](https://img.shields.io/badge/Storybook-10.6.2-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-10B981?style=for-the-badge&logo=w3c&logoColor=white)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **MarketYa!** es una plataforma web integral de punto de venta (POS) y gestión comercial diseñada para minimarkets, bodegas y tiendas de retail. Desarrollada bajo los estándares de **Angular 22**, arquitectura **Zoneless**, enfoque **Signals-First**, metodología **Atomic Design** y diseño semántico con **Tailwind CSS 4 + daisyUI 5**.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura y Estándares Técnicos](#-arquitectura-y-estándares-técnicos)
- [Estructura del Proyecto (Atomic Design)](#-estructura-del-proyecto-atomic-design)
- [Paleta de Colores y Tema daisyUI](#-paleta-de-colores-y-tema-daisyui)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
- [Scripts Disponibles](#-scripts-disponibles)
- [Credenciales de Demostración](#-credenciales-de-demostración)
- [Módulos Funcionales](#-módulos-funcionales)
- [Accesibilidad (A11y) y UX](#-accesibilidad-a11y-y-ux)
- [Pruebas Unitarias y Storybook](#-pruebas-unitarias-y-storybook)

---

## ✨ Características Principales

* 🏪 **Terminal de Punto de Venta (POS) Táctil**:
  * Búsqueda por SKU, nombre y lector activo de códigos de barras.
  * Carrito reactivo con desglose de empaque (unidad, pack promocional y caja mayoreo).
  * Adaptación táctil y flujo responsive optimizado para smartphones y tablets.
  * Pasarela modal de cobro multimoneda (Soles/Dólares) con cálculo de vuelto en tiempo real para Efectivo, Yape, Plin y Tarjetas POS.
* 📦 **Doble Kardex e Inventario Físico**:
  * Control físico diferenciado entre **Almacén (Bodega)** y **Góndola (Exhibición)**.
  * Detección automática de stock crítico con atajos de reposición inmediata.
  * Historial auditado de traslados internos de mercadería.
* ⏳ **Control de Vencimientos y Políticas de Proveedor**:
  * Emparejamiento de fecha de ingreso de mercadería vs. fecha de emisión de factura.
  * Semáforo de alerta temprana por días restantes de vida útil.
  * Asignación de ofertas relámpago con descuento porcentual directo.
  * Gestión de políticas de canjes por proveedor y exportación de reportes de devolución.
* 🧾 **Facturación Electrónica SUNAT (UBL 2.1)**:
  * Generación y emisión de Facturas, Boletas de Venta y Notas de Crédito/Débito.
  * Validación fiscal previa de RUC/DNI y cálculo automático de Base Imponible e IGV (18%).
  * Historial con estados: Borrador, Aceptado por SUNAT, Pendiente y Anulado.
* 🔒 **Arqueo y Cierre de Caja**:
  * Conciliación por medio de pago (Efectivo vs. Billeteras digitales vs. Tarjetas).
  * Control de descuadres (faltante / sobrante).
  * Reapertura auditada de turno protegida con rol administrador.
* 🎁 **Armado de Packs y Combos**:
  * Diseñador de combos con cálculo de costo total, precio sugerido y margen comercial.
  * Descuento automático de stock de los productos componentes al vender en el POS.
* 📊 **Analítica y Reportes Ejecutivos**:
  * Panel gráfico de ventas horarias y semanales.
  * Filtros multidimensionales (fechas, horas pico, estado SUNAT, categorías, métodos de pago).
  * Exportación nativa a hojas de cálculo Excel (`.xlsx`).

---

## 🛠️ Arquitectura y Estándares Técnicos

El proyecto respeta rigurosamente las directrices modernas de desarrollo en **Angular 22**:

1. **Zoneless Nativo**:
   * Sin dependencia de `zone.js`. Configurado mediante `provideExperimentalZonelessChangeDetection()`.
   * Rendimiento y uso de memoria óptimos sin chequeos de ciclo de vida innecesarios.
2. **Signals-First**:
   * Estado y reactividad manejados exclusivamente con `signal()`, `computed()`, `linkedSignal()`, `input()`, `model()` y `output()`.
   * Sin observables manuales ni suscripciones que causen fugas de memoria.
3. **Control Flow Moderno (Estricto)**:
   * Uso exclusivo de `@if`, `@for (track)`, `@switch`, `@let` y `@empty`.
   * **Cero directivas obsoletas**: Totalmente prohibido el uso de `*ngIf`, `*ngFor` y `*ngSwitch`.
4. **Naming Angular 20+ por Rol**:
   * Sin sufijos redundantes `*.component.ts` ni `*.service.ts`.
   * Componentes: `button.ts` (clase `Button`), `pos-page.ts` (clase `PosPage`), `modal.ts` (clase `Modal`).
   * Servicios: `store.ts` (clase `Store`), `toast-store.ts` (clase `ToastStore`).
5. **Inyección con `@Service()`**:
   * Servicios decorados con `@Service()` e inyección moderna vía `inject()`.
6. **Estilos Tailwind CSS 4 + daisyUI 5**:
   * Configuración directa en CSS con `@import "tailwindcss"; @plugin "daisyui";`.
   * Sin necesidad de archivo `tailwind.config.js` ni preprocesadores SCSS.
   * Iconos centralizados con el átomo accesible `ui-icon` (Heroicons vía `@ng-icons`).

---

## 📁 Estructura del Proyecto (Atomic Design)

La interfaz y lógica de negocio están estructuradas según la jerarquía **Atomic Design**, garantizando dependencias unidireccionales:

```text
src/
├── main.ts                       # Entrada de la aplicación zoneless
├── styles.css                    # Tailwind CSS 4, tema daisyUI y reglas A11y
├── app/
│   ├── app.routes.ts             # Enrutamiento con lazy loading (loadComponent)
│   ├── core/                     # Servicios singleton, modelos y guards
│   │   ├── guards/               # authGuard, adminOnlyGuard
│   │   ├── models/               # product.model.ts, sale.model.ts
│   │   └── services/             # store.ts, toast-store.ts, sales-analytics.ts, electronic-documents.ts
│   ├── features/                 # Páginas principales orquestadoras de vistas
│   │   ├── cash-closure/         # cash-closure-page.ts
│   │   ├── dashboard/            # dashboard-page.ts
│   │   ├── electronic-documents/ # electronic-documents-page.ts
│   │   ├── expirations/          # expirations-page.ts
│   │   ├── inventory/            # inventory-page.ts
│   │   ├── login/                # login-page.ts
│   │   ├── movements/            # movements-page.ts
│   │   ├── packs/                # packs-page.ts
│   │   ├── pos/                  # pos-page.ts
│   │   ├── reports/              # reports-page.ts
│   │   └── units/                # units-page.ts
│   └── ui/                       # Sistema de diseño Atomic Design
│       ├── atoms/                # avatar, badge, button, icon, input, kpi-metric, select, toggle
│       ├── molecules/            # cart-item-row, dual-range-slider, modal, notification-item, product-pos-card, search-bar
│       ├── organisms/            # header, mobile-nav, pos-catalog, pos-cart, checkout-modal, kardex-table, sales-analytics...
│       └── templates/            # app-shell (layout autenticado), auth-layout (layout de login)
public/
├── logo.jpg                      # Identidad corporativa MarketYa!
├── products_data.json            # Base de datos mock de productos precargados
└── fonts/                        # Tipografía DM Sans local (sin llamadas externas)
```

---

## 🎨 Paleta de Colores y Tema daisyUI

El tema semántico `marketya` está declarado en `src/styles.css` preservando la identidad visual y garantizando ratio de contraste **WCAG 2.1 AA (≥ 4.5:1)**:

```css
@plugin "daisyui/theme" {
  name: "marketya";
  default: true;
  prefersdark: false;
  color-scheme: light;

  --color-primary: #f97316;          /* Naranja Vibrante Comercial */
  --color-primary-content: #ffffff;
  --color-secondary: #0f766e;        /* Verde Petróleo Retail */
  --color-secondary-content: #ffffff;
  --color-accent: #fbbf24;           /* Ámbar Promocional */
  --color-accent-content: #422006;
  --color-neutral: #1e293b;          /* Pizarra Corporativo */
  --color-neutral-content: #f8fafc;
  --color-info: #0284c7;             /* Azul SUNAT */
  --color-info-content: #ffffff;
  --color-success: #0f766e;          /* Verde Éxito */
  --color-success-content: #ffffff;
  --color-warning: #d97706;          /* Ámbar Alerta Stock */
  --color-warning-content: #422006;
  --color-error: #e11d48;            /* Carmesí Error / Vencido */
  --color-error-content: #ffffff;
  --radius-selector: 1rem;
  --radius-field: 0.75rem;
  --radius-box: 1.25rem;
}
```

---

## 💻 Requisitos Previos

* **Node.js**: Versión `^20.18.0` o `^22.0.0`
* **npm**: Versión `^10.0.0`

---

## 🚀 Instalación y Puesta en Marcha

1. **Clonar o situarse en el directorio del proyecto**:
   ```bash
   cd f:\MIO\MarketYa\marketya-web
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```
   Abrir [http://localhost:4200](http://localhost:4200) en el navegador.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo de Angular en `http://localhost:4200` |
| `npm run build` | Compila el bundle de producción en `dist/market-ya-web` |
| `npm test` | Ejecuta la suite de pruebas unitarias con Vitest y jsdom en modo interactivo |
| `npm test -- --watch=false` | Ejecuta todas las pruebas unitarias una sola vez y finaliza |
| `npm run storybook` | Inicia el servidor de Storybook 10 en `http://localhost:6006` |
| `npm run build-storybook` | Genera la documentación estática de Storybook en `storybook-static/` |

---

## 🔑 Credenciales de Demostración

La pantalla de autenticación incluye un selector rápido de roles interactivo:

| Rol | Usuario | Contraseña | Permisos de Acceso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin1` | `demo123` | Acceso irrestricto: Dashboard, Inventario, Unidades, Packs, Historial, Vencimientos, Reportes, Cierre y Reapertura de Caja, Facturación SUNAT y POS. |
| **Cajero POS** | `cajero1` | `demo123` | Acceso operativo: Terminal de Ventas POS, detalle de carrito, pasarela de cobro y arqueo/cierre de su propio turno de caja. |

---

## 📱 Módulos Funcionales

1. **Punto de Venta (`/pos`)**:
   * Catálogo con tarjetas interactivas de stock en góndola.
   * Lector de código de barras por teclado o pistola USB.
   * Carrito con botones rápidos de incremento/decremento y desglose por presentación.
   * En pantallas móviles, interruptor de pestañas [Catálogo] / [Carrito] y barra flotante de cobro rápido.
2. **Dashboard Ejecutivo (`/dashboard`)**:
   * Tarjetas KPI de ventas de la jornada, volumen de tickets y promedio por venta.
   * Gráficos SVG interactivos de ventas por hora del día y tendencia semanal.
   * Alertas directas a stock bajo góndola y productos próximos a vencer.
3. **Inventario & Doble Kardex (`/inventory`)**:
   * Vista consolidada Almacén vs. Góndola por producto.
   * Modal de traslado interno de reposición con control de stock máximo en bodega.
   * Registro y auditoría de transferencias realizadas.
4. **Comprobantes Electrónicos SUNAT (`/electronic-documents`)**:
   * Emisor de Facturas, Boletas y Notas de Crédito con cálculo automático de IGV.
   * Filtros por estado tributario y tipo de comprobante.
   * Vista previa y anulación formal de comprobantes.
5. **Cierre de Caja (`/cash-closure`)**:
   * Arqueo por medio de pago (Efectivo, Billeteras digitales, POS).
   * Cierre formal de turno y cálculo de descuadre.
   * Reapertura auditada reservada para administradores.
6. **Vencimientos y Políticas (`/expirations`)**:
   * Semáforo de días restantes para expiración de productos.
   * Asignación de ofertas relámpago con descuento porcentual.
   * Mapeo de reglas de canje y devolución a proveedores comerciales.
7. **Packs y Combos (`/packs`)**:
   * Gestor de combos multi-producto con descuento dinámico de componentes.
8. **Reportes Multidimensionales (`/reports`)**:
   * Generador de consultas avanzadas con exportación directa a Excel.

---

## ♿ Accesibilidad (A11y) y UX

* **WCAG 2.1 Nivel AA**: Contraste verificado en todos los tokens de color del tema `marketya`.
* **Navegación por Teclado Completa**:
  * Anillo de foco de alto contraste (`outline: 3px solid rgb(249 115 22 / 48%)`) visible en botones, enlaces, selectores y campos de texto.
  * Tarjetas de producto POS operables mediante `Enter` y `Space`.
  * Modales y menús desplegables cerrables con la tecla `Escape`.
* **Enlace de Salto (Skip Link)**: Permite a usuarios de lectores de pantalla saltar directamente al contenido principal (`#main-content`).
* **Soporte `prefers-reduced-motion`**: Desactiva transiciones y animaciones para usuarios con preferencias de movimiento reducido.
* **Etiquetado Semántico**: Todos los inputs y selects cuentan con etiquetas `<label for="...">` o `aria-label` descriptivos. Todos los botones iconográficos tienen textos accesibles.
* **Touch Targets Móviles**: Áreas táctiles interactivas $\ge 44\times 44\text{ px}$.

---

## 🧪 Pruebas Unitarias y Storybook

### Pruebas Unitarias (Vitest)
El proyecto cuenta con pruebas automáticas que verifican el correcto comportamiento del sistema:

```bash
npm test -- --watch=false
```

* `toast-store.spec.ts`: Apilamiento, descarte manual y auto-descarte por temporizador.
* `store.spec.ts`: Autenticación, gestión de permisos por rol, adición, actualización y vaciado del carrito.
* `auth-guard.spec.ts`: Protección de rutas y redirecciones para usuarios invitados o sin rol administrativo.
* `button.spec.ts`: Renderizado de labels, clases de variante, estado deshabilitado, estado `aria-busy` y eventos de clic.
* `badge.spec.ts`: Variantes semánticas y estilo contorno.
* `search-bar.spec.ts`: Filtrado reactivo, emisión en tecla Enter y botón limpiar.
* `cart-item-row.spec.ts`: Renderizado de SKU/precios, controles de cantidad y remoción.
* `modal.spec.ts`: Apertura condicional, tecla Escape y proyección de acciones.

### Catálogo de Componentes (Storybook)
Para visualizar, probar e interactuar con los componentes atómicos y moleculares en aislamiento:

```bash
npm run storybook
```

Disponible en [http://localhost:6006](http://localhost:6006).

---

## 📄 Licencia

Este proyecto es de carácter privado y de uso exclusivo para **MarketYa!**.
