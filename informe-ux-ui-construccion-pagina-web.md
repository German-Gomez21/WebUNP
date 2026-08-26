# Informe de análisis UX/UI y construcción de la página web

**Proyecto:** `web-unp` — Unidad Nacional de Protección (UNP)  
**Código analizado:** repositorio local Angular (`C:\Users\Lina Chavarro\Desktop\German\web-unp`)  
**Fecha del análisis:** 26 de agosto de 2026  
**Versión del producto en `package.json`:** `17.0.0` (migración Angular v17+)

---

## 1. Introducción

### Objetivo del informe

Documentar, con evidencia del código fuente y de los estilos del proyecto, cómo está concebida, diseñada, estructurada e implementada la interfaz del portal web UNP, de modo que un tercero (diseño, desarrollo, producto o stakeholders) pueda comprender la experiencia y el sistema visual sin haber participado en su construcción.

### Alcance

Se analizó:

- Arquitectura de rutas y features Angular.
- Layout institucional (barra GOV.CO, accesibilidad, header, footer).
- Página de inicio y sus secciones.
- Páginas públicas de contenido (PQRSD, trámites, noticias, transparencia, normativa, quiénes somos, línea vida 103, la UNP).
- Panel administrativo (dashboard y gestión de noticias), en la medida en que aparece en rutas y plantillas.
- Sistema de diseño en tokens CSS (`_tokens.scss`) y partials de UI (botones, cards, forms, tipografía, dark mode).
- Componentes compartidos, iconografía Material Icons, carruseles y microinteracciones definidas en CSS/TS.

### Metodología

1. Lectura de rutas (`app.routes.ts`), `package.json`, `index.html` y `styles.scss`.
2. Inventario de features, layout y shared components.
3. Extracción de valores literales de tokens (colores, tipografía, spacing, radius, elevación, botones).
4. Revisión de plantillas HTML/inline templates para CTAs, formularios y estructura semántica.
5. Cruce entre estilos globales (`main.css`, partials) y estilos de componente.
6. Marcado explícito de lo **verificado**, lo **inferido** y lo **no verificable**.

### Limitaciones

- El análisis se basa en el **código fuente**, no en pruebas de usuario ni en métricas de analítica en producción.
- No se midió rendimiento con Lighthouse u otras herramientas en este informe (salvo lo observable en configuración de build y assets).
- No se verificó el comportamiento en un servidor GOV.CO externo distinto de lo declarado en el repo (URLs de GitHub Pages usadas en despliegues previos aparecen en el historial de trabajo, no como configuración fija en `angular.json`).
- Algunos datos de contenido llegan vía servicios (`DataService`, `PqrsdService`) con datos mock; el contenido exacto en producción **no es verificable** desde este análisis estático.
- No existe documentación histórica formal del proceso de diseño (wireframes, actas); la sección 25 es una **reconstrucción razonada**, no un relato factual.

### Qué se observó directamente vs. qué no pudo verificarse

| Tipo | Ejemplos |
| --- | --- |
| Observado directamente | Rutas, tokens CSS, variantes `.btn`, estructura del home, clases dark mode, FABs en `index.html` |
| Inferido con cautela | Intención de conversión de CTAs, journey “ideal” del ciudadano, alineación con lineamientos GOV.CO |
| No verificable | Tasas de conversión, cumplimiento WCAG auditado, APIs reales de `api.unp.gov.co` en runtime, historial de workshops de diseño |

---

## 2. Resumen ejecutivo

El proyecto es un **portal institucional público** de la Unidad Nacional de Protección (Colombia), implementado como aplicación **Angular 17 standalone** con lazy loading de páginas. La experiencia combina:

- Identidad de gobierno digital (barra GOV.CO, azul institucional `#3366CC`, acento naranja `#FF6B35`).
- Arquitectura de contenidos orientada a **orientación ciudadana**: protección, trámites, PQRSD, transparencia, normativa y noticias.
- Un **design system en CSS custom properties** (`_tokens.scss` v1.0.0) con modo claro/oscuro por clases en `body`.
- Controles de interfaz tipo **pill** (radio `9999px`) unificados en `.btn`.
- Home construida por bloques: hero carrusel, servicios principales, áreas institucionales, rutas de atención, noticias, canales de contacto, carrusel institucional y FAQ.

Visualmente el producto se caracteriza por superficies claras, cards con borde + sombra de elevación, tipografía **Nunito Sans**, iconos **Material Icons** y una densidad media-baja típica de sitios gubernamentales informativos.

Las decisiones UX/UI más claras en el código son: (1) priorizar canales de emergencia y orientación (Línea Vida 103, PQRSD, teléfonos); (2) reutilizar un vocabulario de botones y cards; (3) ofrecer accesibilidad operativa vía barra lateral (contraste y tamaño de fuente); (4) separar el panel admin con guards.

---

## 3. Arquitectura general del sitio

### Shell de aplicación

**Verificado** en `main-layout.component.html`:

```text
App
└── MainLayout
    ├── Barra GOV.CO (.gov-bar + logo)
    ├── AccessibilityBar
    ├── Header
    ├── <main class="main-content">
    │   └── <router-outlet>  ← páginas feature
    └── Footer
```

**Nota verificada:** `home.component.html` vuelve a montar `<app-accessibility-bar>`, lo que implica **duplicación** de la barra en la página de inicio respecto al layout.

### Árbol de rutas verificadas (`app.routes.ts`)

```text
Sitio
├── /                          Home
├── /la-unp                    La UNP
├── /quienes-somos             Quiénes Somos
├── /linea-vida-103            Línea Vida 103
├── /transparencia             Transparencia
├── /normativa                 Normativa
├── /atencion-servicios/tramites   Trámites y Servicios
├── /pqrsd                     PQRSD
├── /atencion-servicios/pqrsd  → redirect a /pqrsd
├── /noticias                  Listado de noticias
├── /noticias/:slug            Detalle de noticia
├── /admin                     Panel admin (AuthGuard + AdminGuard)
├── /admin/noticias            Gestión de noticias (guards)
└── **                         → redirect a /
```

### Navegación primaria (header)

Grupos definidos en `header.component.ts` (**verificado**):

- **Principal:** Inicio, La UNP, Quiénes Somos, Noticias  
- **Atención:** Trámites, PQRSD, Línea Vida 103  
- **Información:** Transparencia, Normativa  

### Relación entre páginas

Las páginas públicas se comportan como **destinos de contenido** enlazados desde home, menú y footer. El admin es un espacio restringido. No hay un flujo de checkout o cuenta de ciudadano en las rutas públicas verificadas.

### Flujo general conceptual (inferencia de producto)

```text
Entrada (Home / deep link)
  ↓
Orientación (hero + servicios)
  ↓
Profundización (quiénes somos, trámites, PQRSD, transparencia)
  ↓
Acción / contacto (teléfono, correo, enlaces externos, FAQ)
```

Esta secuencia es una **inferencia** basada en el orden del home y la IA del menú; no es un journey validado con usuarios.

---

## 4. Sistema visual

Fuente principal: `src/styles/_tokens.scss` (Design System UNP v1.0.0).

### 4.1 Colores

#### Modo claro (`:root`) — valores verificados

| Rol | Token | Valor |
| --- | --- | --- |
| Primario | `--color-primary` | `#3366CC` |
| Primario oscuro | `--color-primary-dark` | `#2851A3` |
| Primario claro | `--color-primary-light` | `#E7F1FF` |
| Acento | `--color-accent` | `#FF6B35` |
| Texto principal | `--color-text-primary` | `#102A43` |
| Texto secundario | `--color-text-secondary` | `#4B5563` |
| Texto muted | `--color-text-muted` | `#6B7280` |
| Texto inverso | `--color-text-inverse` | `#FFFFFF` |
| Superficie base | `--color-surface-base` | `#FFFFFF` |
| Superficie muted | `--color-surface-muted` | `#F7F9FC` |
| Superficie subtle | `--color-surface-subtle` | `#F1F5F9` |
| Card | `--color-surface-card` | `#FFFFFF` |
| Borde | `--color-border` | `#DFE7F3` |
| Borde fuerte | `--color-border-strong` | `#C4CDD8` |
| GOV.CO bar | `--color-govco-bar` | `#003366` |
| Error | `--color-error` | `#DC3545` |
| Success | `--color-success` | `#17633A` |

#### Modo oscuro (`body.modo_oscuro-govco`) — valores verificados

| Rol | Valor |
| --- | --- |
| Primary | `#68A1FF` |
| Accent | `#FF8B53` |
| Texto principal | `#F1F3F6` |
| Surface base | `#14161B` |
| Surface card | `#22262E` |
| Surface subtle | `#2A2F38` |
| Border | `#333944` |

El comentario en tokens describe una familia tonal “carbón frío” para evitar saltos de matiz entre páginas (**verificado** en comentarios del archivo).

### 4.2 Tipografía

| Aspecto | Valor verificado |
| --- | --- |
| Familia | `'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Carga | Google Fonts en `index.html` (pesos 300–800) |
| Pesos tokenizados | 400, 500, 600, 700, 800 |
| Line-height | tight 1.15, snug 1.35, normal 1.6, relaxed 1.75 |

Jerarquía en `_typography.scss` (fluid `clamp`):

- `h1`: `clamp(2rem, 4vw, 3.2rem)`, bold  
- `h2`: `clamp(1.5rem, 2.5vw, 2rem)`, bold  
- `h3`: `clamp(1.15rem, 2vw, 1.4rem)`, bold  
- Párrafos: 1rem, color secundario, line-height relaxed  
- `.eyebrow`: 0.8rem, extrabold, uppercase, letter-spacing 0.12em, color accent  

**Uso UX:** el eyebrow naranja marca secciones institucionales; los headings bold + letter-spacing negativo (`-0.02em`) refuerzan jerarquía en hero y páginas de contenido.

### 4.3 Espaciado

Escala base 4px (**verificado**):

`--space-1` … `--space-10` → 4, 8, 12, 16, 20, 24, 32, 48, 64, 96 px (en rem).

Layout:

- `--container-max: 1200px`
- `--container-padding: clamp(1rem, 3vw, 2rem)`

Patrón repetido: secciones `.section` con header (título + subtítulo) y grillas de cards; ritmo vertical generoso (`space-6`–`space-8` en muchos bloques).

### 4.4 Bordes y superficies

| Token | Valor |
| --- | --- |
| radius-xs → xl | 4, 6, 10, 16, 24 px |
| pill / full | 9999px |
| elevation-0…3 | none → sm → md → lg |

Sombras light (extracto verificado):

- `--shadow-sm`: `0 2px 8px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.05)`
- Cards usan `elevation-1` por defecto; hover interactivo sube a `elevation-2`.

Comentario de sistema (**verificado**): botones **sin sombra** decorativa; la elevación se reserva a cajones/paneles.

Overlays: `--color-surface-overlay: rgba(0,0,0,0.4)`; héroes de carrusel usan overlays locales sobre imagen.

### 4.5 Iconografía

- Librería: **Material Icons** (Google Fonts).
- Uso: inline `<i class="material-icons">` junto a CTAs, cards, footer, canales y FAQ.
- Tamaño típico de botón icon: `--btn-icon-size: 2.5rem`; iconos de flecha de carrusel con `drop-shadow` para contraste sobre foto (**verificado** en estilos de carrusel).
- Función: affordance (flechas, teléfono, escudo), refuerzo semántico, no solo decoración.
- Consistencia: alta en Material; coexisten algunos SVG inline en FABs de `index.html`.

---

## 5. Análisis completo de cada sección

Se documentan primero el **shell** y luego el **home** (bloque a bloque), y después las páginas feature principales.

---

### 5.1 Barra GOV.CO

#### Objetivo

Identificar el sitio como pertenencia al ecosistema digital del Estado colombiano.

#### Función en el journey

Es el primer marco institucional antes de cualquier contenido UNP.

#### Estructura

Logo `gov-logo.png`, contenedor `.gov-bar`, enlace/contexto GOV.CO (markup en layout).

#### Jerarquía visual

1. Franja azul institucional (`#003366`).  
2. Logo GOV.CO.

#### UX / UI

Reduce ambigüedad de procedencia. Color de alto contraste institucional. Poco interactivo: es señal de confianza más que herramienta.

#### Accesibilidad

Depende del contraste del logo sobre la barra; no se auditó WCAG numéricamente aquí (**no medido**).

---

### 5.2 Barra de accesibilidad

#### Objetivo

Permitir contraste (modo oscuro/claro) y ajuste de tamaño tipográfico.

#### Función

Control persistente lateral (clases GOV.CO: `barra-accesibilidad-govco`). Preferencia dark en `localStorage` clave `unp-dark-mode`. Font size ±1px (límites 8–64 px) (**verificado** en TS).

#### Estructura

Botones: contraste, disminuir letra, aumentar letra; tooltips asociados.

#### Interacciones

Toggle de clases `modo_oscuro-govco` / `modo_claro-govco` en `body`; estado activo visual en botón.

#### Problema verificado

Duplicación en Home (layout + home). Posibles listeners/estado duplicados (**inferencia** de impacto; el markup duplicado es hecho).

#### Accesibilidad

Aporta control de contraste y zoom tipográfico. El viewport declara `user-scalable=no` en `index.html`, lo que **puede conflictuar** con zoom nativo del navegador (**hecho** del meta; impacto WCAG = inferencia).

---

### 5.3 Header

#### Objetivo

Navegación primaria, identidad UNP y búsqueda.

#### Estructura

Logo, grupos de nav, búsqueda (`SearchService` + `ngModel`), menú móvil (hamburguesa `btn btn--icon btn--soft`), cierre de drawer.

#### Jerarquía

1. Logo.  
2. Ítems de menú.  
3. Buscador / iconos móviles.

#### UX

Agrupación por “Principal / Atención / Información” reduce carga cognitiva frente a un menú plano largo (**inferencia** de IA). Dropdowns y búsqueda soportan descubrimiento.

#### Interacciones

Hover de links, apertura de submenús, resultados de búsqueda, menú off-canvas en móvil.

#### Responsive

A ~768px el menú pasa a patrón móvil (patrones en `main.css` / header styles).

---

### 5.4 Home — Hero carrusel

#### Objetivo

Comunicar tres mensajes prioritarios: solicitar protección, Línea Vida 103, PQRSD.

#### Función

Primer “viewport” de contenido: captura atención y ofrece CTA inmediato.

#### Estructura (verificada)

Por slide: imagen de fondo, gradient, overlay, título `h2`, subtítulo, CTA con icono Material, controles prev/next (`aria-label`), indicadores.

Datos hardcodeados en `HeroComponent`:

| Slide | Título | CTA | Destino declarado |
| --- | --- | --- | --- |
| 0 | Solicitar Protección | Solicitar ahora | `/solicitar-proteccion` |
| 1 | Línea Vida 103 | Llamar ahora | `/linea-vida-103` |
| 2 | (PQRSD — ver archivo) | — | `/pqrsd` |

Auto-rotate: **5000 ms** (**verificado**).

#### Jerarquía visual

1. Título del slide.  
2. CTA.  
3. Controles/indicadores.

#### UX

Fuerte en awareness de servicios críticos. **Hallazgo verificado:** la ruta `/solicitar-proteccion` **no existe** en `app.routes.ts`; el wildcard redirige a `/`, por lo que ese CTA no lleva a una página dedicada.

#### UI

Flechas sin fondo, icono blanco con `drop-shadow` para contraste sobre imagen (**cambio reciente verificado en CSS**). CTA pill blanco semitransparente (`.hero-carousel__cta`).

#### Responsive

Alturas y tamaños de control se reducen en breakpoints 768/480 (reglas en `main.css`).

---

### 5.5 Home — Servicios principales (Banners)

#### Objetivo

Acceso rápido a servicios destacados.

#### Estructura

Grid de `.banner-card` con icono coloreado, título, descripción, botón `btn btn--outline btn--sm` (“Ir al servicio”), flecha decorativa; variante `--destacado` y borde izquierdo por color de dato.

Datos desde `DataService` (**contenido exacto no fijado en este informe**).

#### Jerarquía

1. Título de sección.  
2. Cards.  
3. CTA outline.

#### UX

Patrón de “service tiles” familiar en gobierno. El borde de color ayuda a escanear.

---

### 5.6 Home — Conoce la UNP (Sections)

#### Objetivo

Explorar áreas institucionales con imagen + bullets + CTA “Ver más”.

#### Estructura

`.info-section-card`: imagen/cover, título, descripción, lista con `check_circle`, botón outline.

#### UX

Combina storytelling visual y lista de beneficios. Buena para exploración sin saturar el hero.

---

### 5.7 Home — Servicios y rutas de atención

#### Objetivo

Presentar canales/rutas (gestión de medidas, contratación, emergencia, etc.).

#### Estructura

`.services-grid` / `.service-card` con icono Material. Al menos una card es enlace a `/linea-vida-103/` (`target="_blank"`) (**verificado**). Otras cards descriptivas sin CTA explícito en el fragmento leído.

#### UX

Mezcla de cards informativas y una accionable. La inconsistencia “algunas clicables / otras no” puede generar affordance ambigua (**inferencia**).

---

### 5.8 Home — Noticias (carrusel)

#### Objetivo

Difundir novedades y profundizar en `/noticias/:slug`.

#### Estructura

Carrusel horizontal; CTA “Leer más” `btn--outline btn--sm` con icono `arrow_forward`; botones `.news-carousel__btn` prev/next; auto-rotate **4000 ms**; paso `344px` (**verificado**).

#### UX

Mantiene el home vivo con contenido editorial. Controles de flecha sin fondo + contraste por sombra.

---

### 5.9 Home — Canales de atención

#### Objetivo

Dar datos de contacto accionables (teléfono, correo, dirección, chat).

#### Estructura

Sección `.section--blue` con 4 `.contact-channel` (icono + título + valor + descripción). Valores verificados en template: línea `01 8000 118 228`, correo `correspondencia@unp.gov.co`, dirección Carrera 44 # 20-21 Bogotá, chat “Disponible en nuestra web”.

#### UX

Bloque de confianza y contacto directo. Fondo azul invierte la paleta para destacar el cierre de journey (**inferencia** visual).

---

### 5.10 Home — Carrusel institucional

#### Objetivo

Refuerzo visual institucional / campañas.

#### Estructura

`app-institutional-carousel`: 3 slides por defecto (assets `carousel-1/2/3`), autoPlay 5000 ms, swipe touch threshold 50px, nav sin fondo, indicadores.

#### UX

Presencia de marca; menos “tarea” que el hero (el CTA institucional depende de items/config).

---

### 5.11 Home — FAQ

#### Objetivo

Resolver dudas frecuentes sin salir del home.

#### Estructura

Acordeón: botón `.faq-item__question` + panel de respuesta; toggle por índice en el componente.

#### UX

Reduce tickets/llamadas potenciales (**inferencia** de negocio). Patrón familiar de expand/collapse.

---

### 5.12 Footer

#### Objetivo

Navegación secundaria, contacto, redes y cierre legal/institucional.

#### Estructura

Contenedor tipo “cajón” elevado (`.footer__card-container` con `elevation-3`), columnas de servicios (enlaces a `unp.gov.co`), contacto, institucional, redes con `btn btn--icon btn--soft` y `aria-label` por red.

#### UX

Ancla de confianza y salida a ecosistema externo. Redes con targets `_blank` + `rel="noopener noreferrer"` (**verificado**).

---

### 5.13 FABs globales (`index.html`)

#### Objetivo declarado

Atajos a “Habla con nuestra IA” y “Habla con servicio al cliente”.

#### Estructura

Dos anchors `.fab-ai` y `.fab-chat` con SVG, `href="#ia-chat"`, tooltips.

#### Hallazgo verificado

No existe `id="ia-chat"` en el código fuente buscado. Los FABs **no tienen destino ancla funcional** en el markup actual.

---

### 5.14 Página PQRSD

#### Objetivo

Orientar sobre qué es una PQRSD, cómo radicar, tipos, canales, documentos y FAQ — **sin formulario de radicación en la app** (**verificado**: no hay `<form>` ni validators en la feature).

#### Estructura destacada

Hero con breadcrumb, eyebrow, H1, CTAs (`Radicar una PQRSD` → fragment `#radicacion`, `Línea Vida 103`), highlights, hero-card; secciones definition, accesos (`app-pqrsd-card`), radicación paso a paso, tipos, etc.

#### UX

Excelente para educación y desambiguación (incluye advertencia de no usar PQRSD ante riesgo inminente). El CTA “Radicar” lleva a guía, no a un form Angular — coherente con el código, pero el copy puede sugerir radicación in-app (**tensión copy vs. implementación**, verificable).

---

### 5.15 Trámites y servicios

#### Objetivo

Listar trámites filtrables y ofrecer acciones “Ver requisitos” / “Realizar trámite”.

#### Estructura

Hero con `btn--primary` y `btn--white`; filtros `.category-btn`; cards con outline + primary sm.

#### UX

Patrón catálogo + filtro. Botones del hero no muestran `routerLink` en el fragmento HTML revisado (pueden ser estáticos) — **verificar comportamiento runtime** si se requiere certeza de navegación.

---

### 5.16 Noticias (listado y detalle)

#### Objetivo

Browse, filtrar/paginar y leer detalle por slug.

#### Estructura

Cards con “Leer más” visual (`span.btn` dentro de link), paginación `.news-page__pagination-btn`, detalle en ruta `:slug`.

#### UX

Flujo editorial clásico. El “botón” dentro del link evita anidar `<a>` (**patrón verificado**).

---

### 5.17 Quiénes somos / La UNP / Transparencia / Normativa / Línea Vida 103

Patrón común (**verificado** en muestras):

- Hero o encabezado con eyebrow + H1 + CTAs.
- Secciones en cards/paneles con elevación.
- Breadcrumbs en varias páginas (ej. PQRSD).
- Normativa: filtros + `Limpiar filtros` (`btn--secondary btn--sm`).
- Línea Vida 103: contenido de emergencia/orientación (HTML extenso).

Cada una cumple un rol de **profundización temática** dentro de la IA del menú.

---

### 5.18 Admin (Dashboard y Noticias)

#### Objetivo

Gestión interna (noticias) tras autenticación.

#### Estructura

Guards `AuthGuard` + `AdminGuard`. Panel de noticias: listado, crear/editar con muchos campos `ngModel` (título, SEO, imagen, estado, etc.), botones primary/ghost/secondary.

#### UX

Densidad alta, propia de back-office. Estilos locales aún con radios fijos en algunos paneles (p. ej. 16px) frente al sistema pill global — **inconsistencia parcial verificada** en SCSS de admin.

#### Hallazgo

`AdminGuard` redirige a `/acceso-denegado`, pero **esa ruta no está registrada** en `app.routes.ts`. El componente `access-denied` existe, pero el deep-link de error puede caer en redirect a home (**verificado** en rutas vs. guard).

---

## 6. Análisis exhaustivo de botones

### Sistema base (verificado)

Clase `.btn` en `_buttons.scss`:

- Forma: pill (`border-radius: 9999px`)
- Altura base: 2.5rem; padding x 1.375rem
- Peso: medium (500)
- Sin box-shadow decorativo
- Focus: `--btn-focus-ring`
- Loading: spinner CSS, color transparente en label

Variantes: `--primary`, `--secondary`, `--outline`, `--ghost`, `--danger`, `--success`, `--white`, `--soft`, `--icon`, `--chip`, tamaños `--sm`/`--lg`.

### Inventario de CTAs / botones relevantes

| Botón / control | Ubicación | Texto / aria | Variante | Acción / destino | Jerarquía | Notas |
| --- | --- | --- | --- | --- | --- | --- |
| Hero CTA | Home hero | p.ej. “Solicitar ahora” | `.hero-carousel__cta` | `navigateToSlide(ctaLink)` | Primaria en slide | Destino `/solicitar-proteccion` sin ruta |
| Hero prev/next | Home hero | aria Anterior/Siguiente | control icono | Cambia slide | Secundaria UI | Sin fondo |
| Banner “Ir al servicio” | Home banners | Ir al servicio | outline sm | `banner.enlace` | Secundaria | |
| Sections “Ver más” | Home sections | Ver más | outline sm | `section.enlace` | Secundaria | |
| News “Leer más” | Home news | Leer más + icon | outline sm | routerLink noticias | Secundaria | |
| News carousel btn | Home news | — | `.news-carousel__btn` | prev/next | Control | Sin fondo |
| Inst carousel nav | Home | — | `.inst-carousel__nav` | prev/next | Control | Sin fondo |
| FAQ question | Home FAQ | texto pregunta | `.faq-item__question` | toggle | Contenido | |
| PQRSD primary | PQRSD hero | Radicar una PQRSD | primary | fragment `#radicacion` | Primaria | Guía, no form |
| PQRSD secondary | PQRSD hero | Línea Vida 103 | secondary | `/linea-vida-103` | Secundaria | |
| Quiénes somos CTAs | Quiénes somos | Conocer la UNP / Ver trámites | primary / secondary | routerLinks | Primaria+sec | |
| Trámites hero | Trámites | Solicitar Protección / Línea Vida 103 | primary / white | (ver markup) | Primaria | |
| Trámite card | Trámites | Ver requisitos / Realizar trámite | outline sm / primary sm | link + button | Mixto | |
| Category filter | Trámites/noticias | categorías | `.category-btn` / chip-like | filtro | Filtro | |
| Normativa limpiar | Normativa | Limpiar filtros | secondary sm | `limpiarFiltros()` | Utilidad | |
| Paginación noticias | Noticias | números / prev next | pagination-btn | cambia página | Navegación | |
| Header icon buttons | Header | menú / search / close | icon + soft | UI chrome | Utilidad | |
| Footer social | Footer | aria por red | icon + soft | externos | Tertiary | |
| FAB AI / Chat | Global | aria labels | `.fab-*` | `#ia-chat` | Flotante | Ancla inexistente |
| Admin crear | Admin news | + Crear noticia | primary | `abrirCrear()` | Primaria | |
| Admin fila | Admin news | Editar / Publicar / Programar | ghost sm | acciones | Secundaria | |
| Admin guardar | Admin news | Guardar… | primary/secondary | `guardar()` | Primaria | |
| Logout | Admin dash | Cerrar sesión | ghost sm | — | Utilidad | |
| Access denied | AccessDenied | Ir al inicio / Volver | primary / secondary | `goHome` / `goBack` | Primaria | Componente sin ruta dedicada |

Estados hover/active/focus/disabled están centralizados en `_buttons.scss` e `_interactive.scss` para la familia `.btn` y controles legacy.

---

## 7. Análisis de componentes UI

| Componente | Propósito | Variantes / notas |
| --- | --- | --- |
| `.btn` | Acción primaria del DS | Ver sección 6 |
| `.card` | Contenedor de contenido | hero/stat/feature/flat/interactive |
| `.form-field` | Campo de formulario visual | estados focus/error en `_forms.scss` |
| Header | Nav + search | desktop/móvil |
| Footer | Cierre institucional | social soft icons |
| AccessibilityBar | Contraste + font size | GOV.CO naming |
| Hero carousel | Mensajes prioritarios | 3 slides |
| News carousel | Editorial home | translateX |
| Institutional carousel | Campaña visual | swipe |
| `app-pqrsd-card` | Accesos/tipos PQRSD | primary/secondary, featured |
| Banner / info / service cards | Home discovery | estilos en `main.css` |
| FAQ accordion | Dudas | home + patrones similares en otras páginas |
| Breadcrumb | Orientación | p.ej. PQRSD |
| Alerts / badges | DS partials | `_alerts`, `_badges` |
| AccessDenied | Error de acceso | no ruteado |
| Admin panels | CRUD noticias | forms template-driven |

---

## 8. Navegación y experiencia de usuario

### Capas de navegación

1. GOV.CO (contexto Estado)  
2. Accesibilidad (preferencias)  
3. Header (tarea principal)  
4. Contenido / CTAs contextuales  
5. Footer + FABs  

### Journey esperado (inferencia fundamentada en IA)

```text
Entrada
  ↓
Hero (prioridad / emergencia / PQRSD)
  ↓
Servicios y áreas UNP
  ↓
Noticias / confianza informativa
  ↓
Canales de contacto + FAQ
  ↓
Footer / redes / externos
```

### Scroll y anchors

- Fragmentos usados (ej. `#radicacion`, `#faq` en PQRSD).  
- FABs a `#ia-chat` sin destino (**verificado**).

---

## 9. Flujos de usuario

### Flujo A — Visitante busca protección / emergencia

1. Entra a Home.  
2. Ve slide Línea Vida 103 o card de emergencia.  
3. Navega a `/linea-vida-103` o usa teléfono del bloque de contacto.  
**Fricción posible:** CTA “Solicitar protección” del hero no tiene ruta dedicada.

### Flujo B — Visitante quiere presentar PQRSD

1. Menú Atención → PQRSD o CTA home.  
2. Lee definición y pasos en `#radicacion`.  
3. Debe salir a canal virtual/oficial externo (la app orienta, no radica).  
**Fricción:** expectativa de formulario vs. guía.

### Flujo C — Lectura de noticias

1. Home carrusel o menú Noticias.  
2. Listado → detalle por slug.  

### Flujo D — Navegación móvil

1. Hamburguesa → drawer.  
2. Búsqueda opcional.  
3. FABs pueden taparse contenido inferior (**no medido**; riesgo típico).

### Flujo E — Admin noticias

1. Acceso `/admin` con guards.  
2. Crear/editar con muchos campos.  
3. Si falla autorización: redirect a ruta inexistente `/acceso-denegado`.

---

## 10. Formularios

### Formulario ciudadano PQRSD

**No implementado** como formulario Angular en la feature PQRSD.

### Formulario Admin — Gestión de noticias (**verificado**)

Campos con `[(ngModel)]`: búsqueda, filtro estado, título, subtítulo, resumen, contenido, imagen (+ file `accept="image/*"`), slug, estado, categoría, autor, dependencia, etiquetas, fecha publicación, seoTitle, seoDescription.

- Tipo: template-driven (`FormsModule`).  
- `Validators.*` de Angular: **no aparecen** en el proyecto (grep sin matches).  
- Estilos de validez genéricos `.ng-invalid.ng-touched` en `styles.scss`.  
- Sistema visual `.form-field` disponible en DS para futuros forms.

### Experiencia de completar (admin)

Alta carga cognitiva por cantidad de campos SEO + editorial. Botones “Guardar borrador” / “Guardar y revisar” separan intención (**bueno para UX de CMS**).

---

## 11. Animaciones y motion design

| Elemento | Tipo | Evidencia | Disparador | Valor técnico |
| --- | --- | --- | --- | --- |
| Botones | color/opacity | `--btn-transition` | hover/active | 100ms ease |
| Cards interactive | translateY + shadow | `_cards.scss` | hover | `-1px`, elevation-2 |
| Header dropdown | transform/opacity | `main.css` | open | transition-smooth |
| Hero/news/inst carousels | slide change + autoplay | TS timers | auto/manual | 4–5s autoplay |
| FAQ toggle | rotate icon / expand | CSS classes | click | (detalle en CSS) |
| Main layout | `slideUp` | `@keyframes slideUp` | mount | 0.4s ease |
| btn loading | spin | `@keyframes btn-spin` | loading | ~0.55s linear |
| Carousel arrows | scale/opacity | CSS | hover | ~1.08 scale |

**Lectura UX:** el motion es mayormente **feedback y continuidad**, no espectáculo. Los autoplays de carrusel ayudan a cobertura de mensajes pero pueden distraer o dificultar lectura (**trade-off** conocido; no medido aquí).

No se inventan easings no leídos: donde solo aparece `ease` / `cubic-bezier` en legacy, se indica como tal.

---

## 12. Responsive design

Breakpoints observados con mayor frecuencia: **768px**, **480px**, **1024px**, además de 600/640/900/1200 en páginas específicas.

Patrones:

- Menú → drawer móvil.  
- Grillas de 3 columnas → 1 columna.  
- Botones full-width en stacks (`.hero-actions`, `.btn-group--stack` a 480px).  
- Controles de carrusel más pequeños.  
- Footer columnas apiladas.

**No verificable sin viewport lab:** exactitud visual en cada dispositivo físico; sí hay media queries explícitas en código.

---

## 13. Accesibilidad

### Observado (verificado)

- `lang="es"` en HTML.  
- Muchos `aria-label` en controles de carrusel, sociales, FABs, logout.  
- Breadcrumbs con `aria-current="page"` en PQRSD.  
- `.sr-only` en tipografía DS.  
- Focus ring en botones (`:focus-visible`).  
- Barra de contraste y tamaño de fuente.  
- Material icons con `aria-hidden="true"` cuando acompañan texto.

### Inferido

- Intención de cumplir lineamientos GOV.CO de accesibilidad operativa.

### Problemas / riesgos verificables o altamente evidentes

| Tema | Evidencia | Riesgo |
| --- | --- | --- |
| `user-scalable=no` | `index.html` viewport | Impide zoom gesto en algunos navegadores |
| FABs rotos | `#ia-chat` ausente | Enlace vacío |
| CTA hero roto | ruta inexistente | Frustración |
| Access denied sin ruta | guard vs routes | Fallback confuso |
| Duplicación accessibility bar | home + layout | Estados inconsistentes posibles |
| Contraste de flechas | depende de imagen + drop-shadow | Variable por slide |
| `console.log` en accessibility TS | código | Ruido; no a11y directo |

No se afirma cumplimiento WCAG 2.x sin auditoría formal.

---

## 14. Diseño orientado a conversión

En un portal público, “conversión” = **completar una tarea ciudadana** (llamar, radicar por canal oficial, iniciar trámite, informarse).

Señales verificadas:

- CTAs repetidos hacia Línea Vida 103 y PQRSD.  
- Teléfono nacional visible en home.  
- Cards de servicio con borde de color y CTA.  
- Eyebrows y heroes que clarifican propósito de página.  
- FAQ para reducir abandono por duda.

Prueba social clásica (testimonios, ratings) **no aparece** como patrón dominante en el código revisado.

Elementos de confianza: barra GOV.CO, datos de contacto completos, transpariencia/normativa en menú, tono institucional.

---

## 15. Arquitectura técnica observable

| Aspecto | Evidencia |
| --- | --- |
| Framework | Angular `^17.0.0` standalone |
| Routing | `app.routes.ts`, lazy `loadComponent` |
| Estado UI | Signals en varios componentes |
| Forms | `@angular/forms` (template-driven en admin) |
| HTTP / APIs | CSP permite `https://api.unp.gov.co`; servicios core presentes |
| Build | `ng build`, output `dist/web-unp` |
| Deploy tool | `angular-cli-ghpages` (devDependency) |
| Estilos | SCSS tokens + `main.css` legacy + partials ITCSS-like |
| Dark mode | clases body + `_dark-mode.scss` |
| Seguridad front | meta CSP, interceptors `security`/`csrf` en core |
| Guards | Auth + Admin |

Estructura de carpetas:

```text
src/app/
├── core/          (guards, services, interceptors, models)
├── features/      (páginas)
├── layout/        (shell)
└── shared/        (carousel, access-denied, …)
src/styles/        (design system)
src/assets/        (imágenes, main.css)
```

---

## 16. Relación entre diseño y desarrollo

El proyecto ya materializa un puente diseño→código vía:

- **Tokens CSS** como fuente de verdad (`_tokens.scss`).  
- **Componentes BEM** (`.btn`, `.card`, `.form-field`).  
- **Partials** importados en orden en `styles.scss`.  
- **Overrides dark** al final para ganar especificidad.

La convivencia con `main.css` legacy implica que no todo consume tokens (riesgo de divergencia). Admin y algunos SCSS de feature aún hardcodean radios/sombras.

Breakpoints no están tokenizados en una sola escala; se repiten literales en media queries.

---

## 17. Design System identificado

### Foundations

Colores, tipografía Nunito Sans, spacing 4px, radius, elevation 0–3, iconos Material, motion tokens (`--transition-fast/base/smooth`).

### Components

Button (familia completa), card, form-field, badge, alert, navigation patterns, accordion FAQ, carousels, chips/filters.

### Patterns

- Hero institucional + CTAs  
- Section header (title + subtitle)  
- Card grids  
- Eyebrow + H1 + actions  
- Contact channel row  
- GOV.CO chrome  

### Rules observables

- Botones pill, sin sombra.  
- Cards: borde + elevación sutil.  
- Dark mode por tokens de superficie, no solo inversión.  
- Primary = azul UNP; accent = naranja para énfasis/eyebrows.

---

## 18. Rendimiento percibido y técnico

### Observable / configurado

- Lazy routes (menos JS inicial por página).  
- Preload de `unp-logo.svg` y `gov-logo.png`.  
- `preconnect` / `dns-prefetch` a Google Fonts.  
- Imágenes hero/carrusel como assets estáticos (peso real **no medido** aquí).  
- Build production con hashing de archivos.

### Percibido (inferencia)

Carruseles con autoplay e imágenes full-bleed pueden sentirse “pesados” en móvil 3G; la arquitectura lazy mitiga JS de features no visitadas.

---

## 19. SEO y estructura semántica

### Verificado

- `title` por ruta en `app.routes.ts` (buen punto).  
- `index.html` title por defecto UNP.  
- Headings h1–h3 en páginas.  
- Landmarks: `header`, `main`, `nav`, `footer`, `section` con `aria-labelledby` en PQRSD.  

### No verificable

- Indexación real, Search Console, rich results.  
- Completitud de meta description por página (admin tiene campos SEO para noticias; páginas estáticas no muestran un servicio meta unificado en este análisis).

---

## 20. Microinteracciones

- Hover de botones: cambio de background/border (100ms).  
- Focus-visible: anillo azul.  
- Active: opacity ~0.88.  
- Disabled: opacity 0.4, `pointer-events: none`.  
- Chip/filter active: fondo primary-muted.  
- Card hover: 1px lift + sombra.  
- Dropdown header: translate/fade.  
- Indicadores de carrusel: estado activo.  
- Tooltips de barra accesibilidad y FABs.

Estas microinteracciones dan **feedback de affordance** sin depender de animaciones largas.

---

## 21. Consistencia del sistema

### Fortalezas de consistencia

- Tokens centralizados.  
- Familia `.btn` ampliamente adoptada en features nuevas.  
- Eyebrow + section headers recurrentes.  
- Material Icons como única librería dominante.

### Inconsistencias reales

| Área | Qué ocurre |
| --- | --- |
| Legacy `main.css` vs tokens | Sombras/radios históricos aún presentes en partes |
| Admin SCSS | Radios 16px / estilos propios |
| Cards home | Algunas clicables, otras no |
| Accessibility bar | Duplicada en home |
| Destinos CTA | Rutas/anclas rotas |
| Forms | DS `.form-field` vs admin `ngModel` sin validators |

---

## 22. Fortalezas del diseño

1. **Claridad institucional** — GOV.CO + paleta UNP generan reconocimiento de entidad pública.  
2. **Priorización de emergencia** — Línea 103 y contacto telefónico visibles.  
3. **Design tokens maduros** — facilitan dark mode y mantenimiento.  
4. **Botones unificados pill** — reduce ruido visual de CTAs.  
5. **IA de menú agrupada** — Atención vs Información.  
6. **PQRSD educativo** — reduce mal uso del canal ante emergencias (copy explícito).  
7. **Lazy loading Angular** — arquitectura escalable por feature.  
8. **Elevación en paneles, no en botones** — jerarquía de superficie más limpia.

---

## 23. Problemas y oportunidades de mejora

| # | Área | Qué ocurre | Por qué importa | Usuario afectado | Mejora sugerida |
| --- | --- | --- | --- | --- | --- |
| 1 | UX | CTA hero → `/solicitar-proteccion` sin ruta | Frustración / bounce | Solicitantes de protección | Crear ruta o apuntar a trámite existente |
| 2 | UX | FABs → `#ia-chat` inexistente | Controles muertos | Todos | Implementar chat o quitar FABs |
| 3 | UX | Access denied sin ruta | Error de auth confuso | Admins | Registrar ruta o redirigir a login |
| 4 | A11y | `user-scalable=no` | Zoom restringido | Baja visión | Permitir scalable |
| 5 | UX | Accessibility bar duplicada | Comportamiento impredecible | Home | Quitar instancia del home |
| 6 | Producto | PQRSD sin form in-app | Expectativa vs realidad | Ciudadanos | Ajustar copy o integrar canal |
| 7 | UI | Legacy vs tokens | Drift visual | Todos | Migrar restos a tokens |
| 8 | A11y/Dev | `console.log` en accesibilidad | Ruido / posible costo | Dev/prod | Limpiar logs |
| 9 | UX | Service cards mixtas (link/no link) | Affordance uneven | Home | Homogeneizar interacción |
| 10 | Conv. | Chat “disponible en web” sin UI clara | Promesa no cumplida | Contacto | Conectar a FAB real |

---

## 24. Evaluación profesional UX/UI

| Criterio | Valoración cualitativa | Razonamiento |
| --- | --- | --- |
| Claridad | Alta en páginas de contenido; media en home por volumen | Heroes y eyebrows ayudan; home es largo |
| Usabilidad | Buena navegación; CTAs rotos bajan score | Menú claro vs destinos rotos |
| Jerarquía | Sólida | Tokens tipográficos + primary/accent |
| Consistencia | Media-alta | DS fuerte, legacy residual |
| Accesibilidad | Media | Hay intención y controles; viewport y destinos restan |
| Estética | Profesional institucional | No “SaaS genérico”; GOV.CO + azul/naranja |
| Navegación | Buena | Grupos y footer |
| Responsive | Preparada en CSS | Breakpoints abundantes |
| Interacción | Refinada en botones/cards | Autoplay a vigilar |
| Conversión (tarea) | Media | Contacto visible; radicación no in-app |
| Escalabilidad DS | Alta | Tokens + partials |

---

## 25. Reconstrucción conceptual del proceso de diseño

> **Aviso:** lo siguiente es una **reconstrucción razonada** a partir del código (migración desde HTML legacy mencionada en comentarios del home), **no** un historial documentado del equipo.

```text
Portal institucional legacy (HTML/CSS)
        ↓
Migración a Angular 17 (features + layout)
        ↓
Conservación de patrones GOV.CO (barra, accesibilidad)
        ↓
Extracción de design tokens (_tokens.scss v1.0)
        ↓
Unificación de botones pill + elevación de paneles
        ↓
Dark mode por clases body
        ↓
Features de contenido (PQRSD, trámites, noticias…)
        ↓
Admin de noticias
        ↓
Deploy GitHub Pages (gh-pages)
```

---

## 26. Inventario completo de elementos

### Páginas / rutas

Home, La UNP, Quiénes somos, Línea Vida 103, Transparencia, Normativa, Trámites, PQRSD, Noticias, Noticia detalle, Admin, Admin noticias, redirects PQRSD y wildcard.

### Secciones Home

Accessibility (dup), Hero carousel, Banners, Sections UNP, Services routes, News carousel, Contact channels, Institutional carousel, FAQ.

### Componentes / patrones UI

Header, Footer, GOV bar, Accessibility bar, Buttons, Cards, Form fields, Badges, Alerts, Nav dropdowns, Search, Breadcrumbs, Carousels (3), FAQ accordion, PQRSD cards, Banner cards, Service cards, Info cards, Contact channels, FABs, Admin tables/forms, Access denied.

### Botones / CTAs

Ver tabla sección 6 (no se repite íntegra).

### Formularios

Admin news (único formulario de campos completo verificado). Sistema `.form-field` listo para reutilizar.

### Iconografía / media

Material Icons; SVG FABs; imágenes hero, banners, carrusel institucional, logos UNP/GOV.

### Animaciones

Transiciones de botón/card/nav; autoplay carousels; slideUp layout; btn-spin; toggles FAQ.

---

## 27. Conclusiones

La web UNP está construida como **portal institucional Angular 17** con un **sistema visual tokenizado** coherente (azul primario, acento naranja, Nunito Sans, botones pill, elevación en paneles) y una arquitectura de información centrada en **orientación ciudadana y canales de atención**.

Las mejores decisiones UX/UI visibles son la agrupación del menú, la educación en PQRSD, el soporte de contraste/tipografía, y la consolidación reciente del lenguaje de botones y sombras de cajones.

Los mayores riesgos de experiencia no son estéticos sino de **integridad de journey**: CTAs y FABs con destinos inexistentes, barra de accesibilidad duplicada, y la distancia entre el copy de “radicar” y la ausencia de formulario in-app.

En conjunto, el producto se lee como una **migración seria desde un sitio legacy** hacia un design system mantenible, aún en proceso de cerrar gaps entre UI polish y flujos completos de tarea ciudadana.

---

## 28. Matriz de evidencia

| Elemento | Evidencia observada | Inferencia | No verificable | Confianza |
| --- | --- | --- | --- | --- |
| Angular 17 standalone | `package.json`, routes | — | — | Alta |
| Tokens de color/tipo/space | `_tokens.scss` | — | — | Alta |
| Botones pill 9999px | `_buttons.scss` / tokens | Inspiración Linear (comentario) | — | Alta / media en “Linear” |
| Dark mode body classes | tokens + accessibility TS | Cumple GOV.CO | Auditoría oficial | Alta / baja |
| Home sections order | `home.component.html` | Journey ideal | Validación usuarios | Alta / baja |
| CTA `/solicitar-proteccion` roto | hero TS vs routes | Impacto en conversión | Analytics | Alta / media |
| FABs rotos | `index.html` vs ausencia `id` | — | Intención de chat futuro | Alta |
| PQRSD sin form | HTML feature | Copy puede confundir | Canales externos reales | Alta / media |
| Autoplay 4–5s | TS carousels | Puede distraer | Preferencia usuarios | Alta / media |
| Deploy gh-pages | herramienta + historial trabajo | URLs Pages | Uptime producción UNP | Media |
| Cumplimiento WCAG | parcial (aria, focus) | — | Score formal | Media / nula |
| API `api.unp.gov.co` | CSP connect-src | Uso real en runtime | Contratos API | Baja |

---

## 29. Glosario

| Término | Significado sencillo |
| --- | --- |
| **UX** | Cómo se siente y se completa una tarea en el producto |
| **UI** | Aspecto visual y controles concretos (botones, colores, layout) |
| **Design token** | Variable reutilizable (color, espacio, radio) que unifica el sistema |
| **Pill button** | Botón con esquinas totalmente redondeadas (cápsula) |
| **Elevación** | Sensación de “capa” mediante sombra o contraste de superficie |
| **Affordance** | Pista visual de que algo es interactuable |
| **Lazy loading** | Cargar código de una página solo cuando se visita |
| **Standalone (Angular)** | Componente autocontenido sin NgModule clásico |
| **CSP** | Política que limita qué scripts/recursos puede cargar la página |
| **GOV.CO** | Identidad/estándares del portal del Estado colombiano |
| **PQRSD** | Peticiones, Quejas, Reclamos, Sugerencias y Denuncias |
| **Eyebrow** | Texto pequeño superior que etiqueta una sección |
| **Focus-visible** | Contorno de foco visible al navegar con teclado |
| **Inferencia** | Conclusión razonable no demostrada como hecho de código |
| **Journey** | Camino típico del usuario entre pantallas hasta su objetivo |

---

*Fin del informe. Documento generado a partir del análisis del repositorio `web-unp` sin inventar funcionalidades no presentes en el código.*
