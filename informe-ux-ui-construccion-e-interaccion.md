# Informe UX/UI — Construcción, ubicación e interacción

**Proyecto:** `web-unp` — Unidad Nacional de Protección  
**Alcance:** portal Angular 17 (código fuente local)  
**Fecha:** 26 de agosto de 2026  
**Objetivo:** documentar *dónde está*, *cómo está hecho*, *cómo se usa* y *qué ocurre* en cada interacción verificable.

### Convención de evidencia

| Etiqueta | Significado |
| --- | --- |
| **Verificado** | Comprobable en código/plantillas/estilos |
| **Inferencia** | Conclusión razonable, no explicitada como requisito |
| **No verificable** | No hay evidencia suficiente |

---

## 1. Visión general de la construcción

### Qué es la página

Portal institucional público de la UNP, implementado como SPA Angular 17 standalone con lazy loading de features.

### Cómo está armado el esqueleto (**Verificado**)

```text
index.html
  └── <app-root>
        └── MainLayout (main-layout.component.html)
              ├── .gov-bar
              ├── <app-accessibility-bar>
              ├── <header-component>
              ├── <main.main-content>
              │     └── <router-outlet>  ← páginas feature
              └── <app-footer>
  └── FABs (.fab-ai, .fab-chat) fuera de Angular
```

**Archivos clave:**

| Pieza | Ruta |
| --- | --- |
| Shell | `src/app/layout/main-layout/main-layout.component.html` |
| Header | `src/app/layout/header/header.component.ts` |
| Footer | `src/app/layout/footer/footer.component.html` |
| Accesibilidad | `src/app/layout/accessibility-bar/` |
| Tokens UI | `src/styles/_tokens.scss` |
| Botones | `src/styles/_buttons.scss` |
| Home | `src/app/features/home/home.component.html` |
| Rutas | `src/app/app.routes.ts` |

### Design system de interacción (botones)

Todos los `.btn` comparten geometría pill (`--btn-radius: 9999px`), altura 2.5rem, padding horizontal generoso, **sin sombra**, transición 100ms.

| Estado | Comportamiento verificado |
| --- | --- |
| default | Según variante (primary, secondary…) |
| hover | Cambia background/border/color |
| active | opacity 0.88 (primary: brightness 0.94) |
| focus-visible | `--btn-focus-ring` |
| disabled | opacity 0.4, `pointer-events: none` |
| loading | label transparente + spinner CSS |

---

## 2. Mapa interactivo de la interfaz (Home)

```text
┌──────────────────────────────────────────────────────────┐
│ GOV.BAR  [logo] [Portal Único #] [Gobierno en Línea #]   │
├──────────────────────────────────────────────────────────┤
│ ◀ BARRA ACCESIBILIDAD (flotante lateral)                 │
│    [contraste] [A-] [A+]  ← CLICK                        │
├──────────────────────────────────────────────────────────┤
│ HEADER                                                   │
│ [☰ menú] ← CLICK     [LOGO → /]     [🔍 buscar] ← CLICK │
│   ↓ drawer: grupos + links routerLink                    │
│   ↓ search: input + resultados mousedown                 │
├──────────────────────────────────────────────────────────┤
│ HERO CAROUSEL (full bleed)                               │
│   Título / subtítulo                                     │
│   [CTA slide] ← CLICK → router.navigate(ctaLink)         │
│   [‹] [›] ← CLICK    (• • •) ← CLICK                     │
│   autoplay cada 5s                                       │
├──────────────────────────────────────────────────────────┤
│ SERVICIOS PRINCIPALES                                    │
│   [CARD][CARD]…  CTA outline “Ir al servicio” ← CLICK    │
├──────────────────────────────────────────────────────────┤
│ CONOCE LA UNP                                            │
│   [INFO CARD]…  “Ver más” ← CLICK                        │
├──────────────────────────────────────────────────────────┤
│ SERVICIOS Y RUTAS                                        │
│   [SERVICE CARD] (algunas <a>, otras estáticas)          │
├──────────────────────────────────────────────────────────┤
│ NOTICIAS CAROUSEL                                        │
│   [Leer más] ← CLICK   [‹›] ← CLICK   autoplay 4s        │
├──────────────────────────────────────────────────────────┤
│ CANALES DE ATENCIÓN (fondo azul)                        │
│   teléfono / correo / dirección / chat (informativo)     │
├──────────────────────────────────────────────────────────┤
│ CARRUSEL INSTITUCIONAL                                   │
│   swipe / [‹›] / dots / CTA item ← CLICK                 │
├──────────────────────────────────────────────────────────┤
│ FAQ  [pregunta] ← CLICK → expand/collapse                │
├──────────────────────────────────────────────────────────┤
│ FOOTER (cajón elevado)                                   │
│   links externos | tel: | mailto: | redes ← CLICK        │
└──────────────────────────────────────────────────────────┘
         FABs flotantes → href="#ia-chat" (ancla NO existe)
```

**Nota Home:** `home.component.html` monta **otra** `<app-accessibility-bar>`, duplicando la del layout (**Verificado**).

---

## 3. User journeys

### Journey A — Entrada → orientación de emergencia

```text
Entrada (/)
  ↓
Primera impresión: Hero (slides rotan)
  ↓
Usuario ve “Línea Vida 103” o “Llamar ahora”
  ↓
Click CTA → router.navigate(['/linea-vida-103'])  [Verificado]
  ↓
Página Línea Vida 103
```

**Fricción verificada:** en slide “Solicitar Protección”, CTA navega a `/solicitar-proteccion`, ruta **no registrada** → wildcard redirige a `/`.

### Journey B — PQRSD

```text
Menú Atención → PQRSD  o  Hero CTA “Enviar PQRSD”
  ↓
/pqrsd (página guía)
  ↓
Click “Radicar una PQRSD” → fragment #radicacion (misma página)
  ↓
Usuario lee pasos; no hay submit Angular
```

### Journey C — Navegación móvil

```text
Estado: menú cerrado (icono menu)
  ↓
Click ☰ → mobileMenuOpen=true, body overflow hidden
  ↓
Drawer dialog + backdrop
  ↓
Click enlace → routerLink + closeMobileMenu()
  ↓
NavigationEnd también cierra el menú
```

### Journey D — Búsqueda

```text
Click 🔍 → searchExpanded=true, focus input
  ↓
Usuario escribe → SearchService.performSearch
  ↓
Lista de resultados (si hay)
  ↓
mousedown en ítem → selectResult + collapseSearch
```

---

## 4. Fichas de sección (construcción + interacción)

---

## Sección: Barra GOV.CO

### Ubicación

Primera franja del documento, encima de todo el layout.

### Propósito

Señal de pertenencia al Estado colombiano.

### Estructura / construcción

```text
div.gov-bar > .container > .gov-bar__content
  ├── img.gov-bar__logo (assets/images/gov-logo.png)
  └── .gov-bar__links
        ├── a.gov-bar__link → href="#"
        └── a.gov-bar__link → href="#"
```

**Archivo:** `main-layout.component.html` L3–14.

### Diseño visual

Fondo institucional (`--color-govco-bar` / estilos asociados), logo + dos textos a la derecha.

### Interacción

```text
Estado inicial: enlaces visibles
  ↓
Click en “Portal Único…” o “Gobierno en Línea”
  ↓
href="#" → no navega a URL externa real (ancla vacía) [Verificado]
```

### UX

Cumple reconocimiento institucional. Los enlaces `#` **no completan** el journey externo (**hecho**).

### Relación

Enmarca el resto; no depende del router Angular.

---

## Sección: Barra de accesibilidad

### Ubicación

Flotante lateral (estilos GOV.CO `.barra-accesibilidad-govco`), presente en layout y **también** en Home.

### Propósito

Contraste (claro/oscuro) y tamaño de fuente.

### Construcción

- Componente: `AccessibilityBarComponent`  
- Ruta: `src/app/layout/accessibility-bar/`  
- Persistencia dark: `localStorage` key `unp-dark-mode`  
- Clases body: `modo_oscuro-govco` / `modo_claro-govco`  
- Font size: ±1px, límites 8–64  

### Flujo contraste

```text
Estado: modo claro (o preferencia guardada)
  ↓
Click botón contraste
  ↓
Toggle clases body + estado visual botón
  ↓
Tokens dark/light reapuntan colores de toda la UI
```

### Flujo tipografía

```text
Click A+ o A-
  ↓
currentFontSize ± 1
  ↓
Aplicación al documento (lógica en el componente)
```

### Responsive

Control lateral pensado para permanecer accesible en viewport estrecho (**Inferencia** de patrón GOV.CO; posición exacta en CSS del componente).

### Relación UX→UI→dev

Necesidad de contraste/lectura → control persistente → botones laterales → clases CSS tokens → resultado visual global.

---

## Sección: Header

### Ubicación

Bajo GOV.CO y accesibilidad; sticky/contexto de navegación global.

### Propósito

Identidad UNP, acceso a rutas públicas, búsqueda.

### Construcción

**Archivo:** `src/app/layout/header/header.component.ts` (template inline).

Layout de fila:

```text
.header__top-row
  ├── izquierda: botón menú (btn--icon btn--soft)
  ├── centro: logo → routerLink '/'
  └── derecha: búsqueda expandible
```

Navegación **no** es una barra horizontal permanente de links: vive en **drawer** al abrir el menú (**Verificado** en template).

### Elementos interactivos

#### 1) Botón menú móvil / principal

| Campo | Valor |
| --- | --- |
| Clases | `header__mobile-menu-btn btn btn--icon btn--soft` |
| Icono | `menu` ↔ `close` según `mobileMenuOpen()` |
| Acción | `toggleMobileMenu()` |

**Flujo:**

```text
Cerrado → click → open (overflow:hidden) → drawer role=dialog
  ↓
Backdrop click / close / Escape / NavigationEnd → close
```

#### 2) Logo

- `routerLink="/"`  
- Click → Home  

#### 3) Búsqueda

- Toggle `toggleSearch()`  
- Input `ngModel` ↔ `SearchService`  
- Resultados con `mousedown` → `selectSearchResult`  
- Escape / click fuera (si query vacía) colapsa  

### Diseño

Icon buttons soft: fondo superficie + borde sutil, pill circular (`btn-radius-icon` 9999px), 2.5rem.

### Responsive

El patrón menú+drawer es el mecanismo de navegación verificado; no hay segundo menú desktop de links en el template actual.

### Relación

Puente entre cualquier página (router-outlet) y el mapa de rutas públicas.

---

## Sección: Hero carousel (Home)

### Ubicación

Primer bloque de contenido de Home, full-bleed bajo el header.

### Propósito

Priorizar tres mensajes: protección, emergencia 103, PQRSD.

### Construcción

- Componente: `HeroComponent`  
- Archivo: `src/app/features/home/components/hero/hero.component.ts`  
- Estado: `currentSlide` signal, array `slides` hardcodeado  
- Autoplay: `setInterval(..., 5000)`  

Estructura por slide:

```text
.hero-carousel__item (+ --active)
  ├── background image + overlay
  └── .hero-carousel__caption
        ├── h2.title
        ├── p.subtitle
        └── button.hero-carousel__cta (icon + text)
```

Controles: `.hero-carousel__control--prev/next`, indicadores `.hero-carousel__indicator`.

### Diseño visual

- Imagen + gradient + overlay  
- CTA pill blanco semitransparente (estilos `main.css` / interactive)  
- Flechas **sin fondo**, icono blanco + `drop-shadow` (**Verificado** en CSS de carrusel)

### Interacciones

#### CTA del slide

```text
Click → navigateToSlide(ctaLink)
  ↓
router.navigate([link])  (salvo rama legacy pqrsd.html)
```

| Slide | Texto CTA | Destino código | Resultado real |
| --- | --- | --- | --- |
| 0 | Solicitar ahora | `/solicitar-proteccion` | Wildcard → `/` (**Verificado**) |
| 1 | Llamar ahora | `/linea-vida-103` | Página Línea Vida |
| 2 | Enviar PQRSD | `/pqrsd` | Página PQRSD |

#### Prev / Next / Dots

```text
Click → prevSlide/nextSlide/goToSlide
  ↓
Cambia currentSlide → item --active
```

Autoplay continúa en paralelo (no se resetea en hero como en institucional) (**Verificado**: solo `setInterval` sin reset en métodos prev/next).

### Responsive

Controles y tipografía reducen en media queries 768/480 (`main.css`).

### UX

Alta jerarquía de conversión/tarea. La coherencia falla en el CTA de protección por ruta ausente.

---

## Sección: Servicios principales (Banners)

### Ubicación

Debajo del Hero.

### Construcción

- `banners.component.ts`  
- Datos: `DataService` → `banners()` signal  
- Grid `.banners-grid` → `.banner-card` (+ `--destacado`)  

Contenido card: icono coloreado, título, descripción, `a.btn.btn--outline.btn--sm` “Ir al servicio”, flecha decorativa.

### Interacción

```text
Hover card (estilos legacy main.css: lift/shadow según reglas)
  ↓
Click “Ir al servicio”
  ↓
Navegación por href=banner.enlace (interno o externo según dato)
```

**Destinos exactos:** dependen del servicio de datos (**contenido no fijado aquí**).

### Relación

Segundo nivel de descubrimiento tras el hero; CTA outline = jerarquía secundaria respecto al primary del hero.

---

## Sección: Conoce la UNP (Sections)

### Ubicación

Tras banners.

### Construcción

`sections.component.ts` + `DataService` → `.info-section-card` (imagen, título, bullets `check_circle`, “Ver más” outline sm).

### Interacción

Click “Ver más” → `href=section.enlace`.

### UX

Profundización institucional con prueba visual (imagen) + checklist.

---

## Sección: Servicios y rutas de atención

### Ubicación

Tras “Conoce la UNP”.

### Construcción

`services.component.ts` — cards `.service-card`.  
Al menos una es `<a href="/linea-vida-103/" target="_blank">` (**Verificado**). Otras son `div` informativos sin CTA.

### Interacción

```text
Card enlace: click → abre /linea-vida-103/ en nueva pestaña
Card estática: sin acción de navegación
```

**Affordance mixta** (**Inferencia** de riesgo UX; el markup mixto es hecho).

---

## Sección: Noticias (carrusel Home)

### Ubicación

Tras servicios.

### Construcción

`news.component.ts` — carrusel, datos `DataService`, autoplay **4000 ms**, desplazamiento `344px`.

CTA: `a.btn.btn--outline.btn--sm` + icon `arrow_forward` → `['/noticias', slug]` o `/noticias`.

Controles: `.news-carousel__btn` prev/next (sin fondo, contraste por filter).

### Flujo

```text
Autoplay avanza
  ↓
Usuario puede leer card / click Leer más → detalle o listado
  ↓
O usar flechas para controlar
```

---

## Sección: Canales de atención

### Ubicación

Bloque azul antes del carrusel institucional.

### Construcción

`contact.component.ts` — 4 `.contact-channel` (phone, email, business, chat) con valores en template.

### Interacción

Mayormente **informativa** (texto visible). No hay `tel:`/`mailto:` en este bloque home (sí existen en footer) (**Verificado** por comparación).

### UX

Refuerza confianza y canales; el ítem “Chat en línea” declara disponibilidad web, mientras FABs apuntan a ancla inexistente → **desalineación copy/UI** (**Inferencia** + hechos parciales).

---

## Sección: Carrusel institucional

### Ubicación

Tras canales, dentro de `contact-component` via `<app-institutional-carousel>`.

### Construcción

| Item | Detalle |
| --- | --- |
| Archivo | `shared/components/institutional-carousel/` |
| Inputs | `items`, `autoPlayInterval` (default 5000), `sectionTitle` |
| Estado | `currentIndex` signal |
| Touch | swipe threshold 50px |
| Nav | `prev()` / `next()` resetean autoplay |
| CTA | `navigate(link)` → `router.navigate` o `window.open` si http |

### Interacción

```text
Hover flecha → opacity/scale (CSS)
Click flecha/dot → cambia índice + reset timer
Swipe → cambia slide
Click CTA (si hay link) → ruta interna o externa
```

---

## Sección: FAQ (Home)

### Ubicación

Último bloque de contenido home antes del footer.

### Construcción

Botones `.faq-item__question` llaman `toggleFAQ(index)` en `contact.component.ts`.

### Flujo

```text
Cerrado
  ↓
Click pregunta
  ↓
Toggle clase/estado abierto
  ↓
Respuesta visible; icono toggle rota (CSS)
```

---

## Sección: Footer

### Ubicación

Final del layout, fuera del `router-outlet`.

### Construcción

`footer.component.html` — `.footer__card-container` con elevación (`elevation-3` en SCSS).

Columnas: marca, Servicios (externos unp.gov.co), Contacto (`tel:`, `mailto:`), Institucional (externos), Redes (`btn--icon btn--soft`, `target=_blank`).

### Interacciones verificadas

| Elemento | Acción | Resultado |
| --- | --- | --- |
| Logo footer | click `href="/"` | Home |
| Links Servicios/Institucional | click | Sitio unp.gov.co externo |
| PBX / Línea | click | Esquema `tel:` |
| Correo | click | `mailto:` |
| Redes | click | Nueva pestaña red social |

### Responsive

Columnas apilan en breakpoints del SCSS footer (576/600/768).

---

## Sección: FABs globales

### Ubicación

Esquina flotante del viewport (`index.html`, fuera de Angular).

### Construcción

```html
<a href="#ia-chat" class="fab-ai">…</a>
<a href="#ia-chat" class="fab-chat">…</a>
```

### Interacción

```text
Click
  ↓
Navegación hash #ia-chat
  ↓
No existe id="ia-chat" en el proyecto → sin destino útil [Verificado]
```

---

## Sección: PQRSD (página)

### Ubicación

Ruta `/pqrsd`.

### Construcción

`features/pqrsd/pqrsd.component.html` + `PqrsdCardComponent` + `PqrsdService` (datos mock).

### Elementos interactivos clave

| Elemento | Destino / acción |
| --- | --- |
| Breadcrumb Inicio | `routerLink="/"` |
| CTA primary “Radicar…” | `routerLink="/pqrsd" fragment="radicacion"` |
| CTA secondary | `/linea-vida-103` |
| Cards acceso | según `acceso.enlace` del servicio |
| Links internos FAQ | fragment `#faq` |

**No hay formulario submit** en esta feature (**Verificado**).

### Flujo “Radicar”

```text
Click CTA
  ↓
Scroll/navegación a #radicacion
  ↓
Usuario lee pasos y canales
  ↓
Debe continuar fuera de la SPA (canal oficial) — no hay post Angular
```

---

## Sección: Trámites y servicios

### Ubicación

`/atencion-servicios/tramites`.

### Interacciones

- Filtros `.category-btn` (activo vía clases en interactive).  
- “Ver requisitos” → `tramite.linkTramite`.  
- “Realizar trámite” → `button.btn--primary.btn--sm` (sin `routerLink` en markup revisado; **comportamiento de navegación no verificado** más allá del botón visual).  
- Hero: botones primary/white (**acción de navegación no atada en el HTML revisado**).

---

## Sección: Noticias listado / detalle

### Ubicación

`/noticias`, `/noticias/:slug`.

### Interacción

- Filtros / clear / paginación (clases `news-page__*`, estilos `_interactive.scss`).  
- Card → detalle por slug.  
- “Leer más” a menudo es `span.btn` dentro de link (evita anidar anchors).

---

## Sección: Admin noticias

### Ubicación

`/admin/noticias` (guards).

### Formulario (**Verificado**)

Template-driven `[(ngModel)]` con campos editoriales + SEO + imagen.

### Flujo

```text
Listado → Crear/Editar
  ↓
Usuario completa campos
  ↓
Click Guardar borrador / Guardar y revisar / Subir imagen
  ↓
Métodos del componente (guardar, triggerImageUpload, cambiarEstado)
```

**Validadores Angular `Validators.*`:** no presentes en el repo (**Verificado** por búsqueda).

---

## 5. Documentación de botones (sistema + instancias)

### Sistema reutilizable `.btn`

**Archivo:** `src/styles/_buttons.scss`  
**Tokens:** `src/styles/_tokens.scss` (`--btn-*`)

| Variante | Aspecto default | Hover |
| --- | --- | --- |
| primary | fondo `#3366CC`, texto blanco | primary-dark |
| secondary | superficie + borde | subtle + borde strong |
| outline | transparente, texto primary | primary-light |
| ghost | transparente | subtle |
| soft | superficie + borde | subtle (icon tools) |
| white | blanco translúcido | blanco sólido |
| icon | 2.5rem circular soft/transparente | subtle |

### Instancias relevantes

#### Hero CTA

- **Qué:** botón por slide (`.hero-carousel__cta`).  
- **Dónde:** sobre imagen, zona de caption.  
- **Click:** `navigateToSlide`.  
- **UX:** acción principal del viewport.  
- **Riesgo:** destino inválido en slide 0.

#### Header icon soft

- Menú / buscar / cerrar drawer.  
- Click: toggles de UI chrome, no rutas.

#### Outline sm en cards Home

- “Ir al servicio”, “Ver más”, “Leer más”.  
- Jerarquía secundaria; llevan a profundidad o externo.

#### PQRSD primary / secondary

- Primary: ancla interna de guía.  
- Secondary: emergencia 103.

#### Footer social icon soft

- Click: redes externas nueva pestaña.

#### Admin primary / ghost / secondary

- Acciones CMS (crear, editar, publicar, guardar).

---

## 6. Documentación de links

| Tipo | Ejemplos | Comportamiento |
| --- | --- | --- |
| Interno router | Header drawer, PQRSD, noticias | SPA navigation |
| Externo https | Footer servicios/institucional/redes | Nueva navegación / `_blank` en redes |
| `tel:` / `mailto:` | Footer contacto | Abre app nativa |
| Hash / fragment | `#radicacion`, `#faq`, `#ia-chat` | Scroll o fallo si no hay id |
| `href="#"` | GOV.BAR links | Sin destino útil |

---

## 7. Formularios

### Ciudadano

No hay form de radicación PQRSD in-app.

### Admin noticias

Ver sección Admin. Feedback visual genérico `.ng-invalid.ng-touched` en `styles.scss`; sin schema Validators.

### DS `.form-field`

Disponible en `src/styles/_forms.scss` (label, required, focus ring) para formularios futuros.

---

## 8. Cards y componentes reutilizables

| Componente | Archivo / origen | Interactivo | Notas |
| --- | --- | --- | --- |
| `.btn` | `_buttons.scss` | Sí | Sistema global |
| `.card` | `_cards.scss` | `--interactive` hover | Elevación |
| Banner card | `banners.component.ts` | CTA + hover | DataService |
| Info section card | `sections.component.ts` | CTA | |
| Service card | `services.component.ts` | Parcial | |
| News card/carousel | `news.component.ts` | Sí | |
| Contact channel | `contact.component.ts` | Informativo | |
| FAQ item | `contact.component.ts` | Toggle | |
| `app-pqrsd-card` | `pqrsd/components/...` | Según link | |
| Institutional carousel | `shared/...` | Sí | Inputs |
| Access denied | `shared/...` | Botones home/back | Sin ruta dedicada |

---

## 9. Animaciones / motion

| Qué | Cuándo | Efecto | UX |
| --- | --- | --- | --- |
| `--btn-transition` 100ms | hover/active | color/borde | Feedback rápido |
| Card interactive | hover | translateY(-1px)+shadow | Affordancia |
| Hero/news/inst autoplay | timer | cambio de slide | Cobertura mensajes |
| FAQ icon | open | rotate (CSS) | Estado abierto |
| btn-spin | loading | spinner | Espera |
| layout slideUp | mount | entrada | Continuidad |
| Drawer/search | open | overlays/listas | Contexto |

Duraciones exactas solo se afirman cuando están en código (100ms botones, 5s/4s autoplay, 0.55s spin, 0.4s slideUp).

---

## 10. Header y navegación (detalle móvil)

```text
Estado inicial
  icono menu, drawer no renderizado (*ngIf false)
        ↓
Usuario pulsa menú
  mobileMenuOpen=true
  body.overflow=hidden
  dialog + backdrop + grupos Principal/Atención/Información
        ↓
Usuario elige opción
  routerLink navega
  (click) closeMobileMenu()
        ↓
NavigationEnd
  cierra menú por si quedó abierto
        ↓
Escape / backdrop
  cierra sin navegar
```

Grupos y rutas: ver `navGroups` en `header.component.ts` (sección 3 de este informe / código L178–201).

---

## 11. Footer (detalle)

Ver ficha de sección Footer. Jerarquía: cajón blanco elevado sobre franja azul del footer; columnas de 5 bloques; redes como icon buttons soft.

---

## 12. Matriz de interacciones

| Elemento | Ubicación | Acción usuario | Respuesta sistema | Resultado |
| --- | --- | --- | --- | --- |
| GOV links | Top bar | Click | `href="#"` | Sin navegación útil |
| Contraste | Accesibilidad | Click | Toggle body class + storage | Tema claro/oscuro |
| A+ / A- | Accesibilidad | Click | ± font size | Texto más grande/chico |
| Menú ☰ | Header izq. | Click | Abre/cierra drawer | Navegación disponible |
| Logo UNP | Header centro | Click | `routerLink /` | Home |
| Buscar 🔍 | Header der. | Click | Expande input | Búsqueda |
| Resultado búsqueda | Dropdown | mousedown | `selectResult` | Navega + colapsa |
| Escape | Global | Tecla | Cierra menú/search | UI limpia |
| Hero CTA | Hero | Click | `navigate([link])` | Página o home (si rota rota) |
| Hero ‹ › / dots | Hero | Click | Cambia slide | Nuevo mensaje |
| Autoplay hero | Hero | — | next cada 5s | Rotación |
| Banner CTA | Banners | Click | `href` dato | Destino del banner |
| Section CTA | Conoce UNP | Click | `href` | Destino sección |
| Service card link | Servicios | Click | `target=_blank` | Línea 103 |
| News Leer más | News | Click | routerLink | Listado/detalle |
| News ‹ › | News | Click | Mueve carrusel | Otras noticias |
| FAQ | Home | Click | toggleFAQ | Abre/cierra respuesta |
| Inst. nav/swipe/CTA | Carrusel inst. | Click/swipe | Índice / navigate | Slide o URL |
| PQRSD CTAs | /pqrsd | Click | routerLink/fragment | Guía / 103 |
| Footer tel/mail | Footer | Click | tel/mailto | App nativa |
| Footer redes | Footer | Click | `_blank` | Red social |
| FAB AI/Chat | Flotante | Click | `#ia-chat` | Sin ancla |
| Admin guardar | Admin | Click | métodos TS | Persiste según servicio |
| Filtros trámites/noticias | Features | Click | estado activo | Lista filtrada |

---

## 13. Matriz de componentes

| Componente | Ubicación | Función | Reutilizable | Interactivo | Estado |
| --- | --- | --- | --- | --- | --- |
| MainLayout | App shell | Orquesta chrome | Sí | Parcial | Estático+outlet |
| AccessibilityBar | Lateral (+dup home) | A11y prefs | Sí | Sí | contrast/font |
| HeaderComponent | Top | Nav+search | Sí | Sí | menu/search signals |
| Footer | Bottom | Contacto+links | Sí | Sí | — |
| HeroComponent | Home | Mensajes clave | Feature | Sí | currentSlide |
| BannersComponent | Home | Servicios | Feature | Sí | data signal |
| SectionsComponent | Home | Áreas UNP | Feature | Sí | data |
| ServicesComponent | Home | Rutas atención | Feature | Parcial | — |
| NewsComponent | Home | Editorial | Feature | Sí | carousel |
| ContactComponent | Home | Canales+FAQ+inst | Feature | Sí | FAQ index |
| InstitutionalCarousel | Shared | Campaña | Sí | Sí | index+autoplay |
| PqrsdCard | PQRSD | Acceso/tipo | Sí | Según link | variants |
| `.btn` | Global CSS | CTA system | Sí | Sí | hover/focus/… |
| `.card` | Global CSS | Contenedor | Sí | Opcional | elevation |
| AdminNewsPanel | Admin | CMS | Feature | Sí | form model |

---

## 14. Relación UX → UI → desarrollo (patrón recurrente)

```text
Necesidad: llegar rápido a un servicio crítico
        ↓
UX: CTA primario en hero + menú Atención
        ↓
UI: .btn--primary / .hero-carousel__cta + contraste sobre foto
        ↓
Componente: HeroComponent + tokens botón
        ↓
Interacción: click → Router.navigate
        ↓
Resultado: página destino (o fallo si la ruta no existe)
```

Otro ejemplo:

```text
Necesidad: navegar en móvil sin saturar header
        ↓
UX: menú hamburguesa + drawer agrupado
        ↓
UI: btn--icon soft + dialog fullscreen parcial
        ↓
HeaderComponent signals + body overflow
        ↓
Click link → navegación + cierre
```

---

## 15. Árbol técnico verificado

```text
src/app/
├── app.routes.ts
├── layout/
│   ├── main-layout/
│   ├── header/header.component.ts
│   ├── footer/
│   └── accessibility-bar/
├── features/
│   ├── home/ (+ hero, banners, sections, services, news, contact)
│   ├── pqrsd/
│   ├── tramites-servicios/
│   ├── noticias/
│   ├── quienes-somos/ la-unp/ transparencia/ normativa/ linea-vida-103/
│   └── admin/
├── shared/components/
│   ├── institutional-carousel/
│   └── access-denied/
└── core/ (services, guards, models)
src/styles/
├── _tokens.scss
├── _buttons.scss
├── _cards.scss
├── _forms.scss
├── _interactive.scss
└── _dark-mode.scss
src/assets/css/main.css   ← legacy coexistente
```

---

## 16. Cómo se comporta en desktop / tablet / mobile

| Zona | Desktop | Tablet/Mobile (código) |
| --- | --- | --- |
| Header | Logo centro + tools | Mismo patrón; drawer es la nav |
| Hero | Controles laterales grandes | Controles más pequeños (media 768/480) |
| Grids cards | multi-columna | 1 columna (media frecuentes 768) |
| Botones en stacks | inline | `width:100%` en `.hero-actions` ≤480px |
| Footer | multi-columna | apilado |
| FABs | flotantes | flotantes (pueden solapar; **no medido**) |

---

## 17. Hallazgos que afectan la interacción real

1. **CTA Hero “Solicitar ahora”** → ruta inexistente → vuelve a Home.  
2. **FABs** → `#ia-chat` inexistente.  
3. **GOV.BAR links** → `href="#"`.  
4. **Accessibility bar duplicada** en Home.  
5. **Access denied** referenciado por guard sin ruta en `app.routes.ts`.  
6. **PQRSD** educa pero no envía formulario in-app.  
7. **viewport `user-scalable=no`** puede limitar zoom nativo.

---

## 18. Conclusión operativa

La página está construida como **shell institucional + features lazy** con un **sistema de botones/tokens** coherente. La interacción principal es **navegación Angular**, **toggles de UI** (menú, search, FAQ, contraste) y **carruseles con autoplay**.

Para reconstruir la experiencia hay que implementar, en orden:

1. Layout GOV + accesibilidad + header drawer/search + footer.  
2. Tokens y `.btn` / cards / elevation.  
3. Home por bloques (hero → banners → sections → services → news → contact/FAQ/carousel).  
4. Rutas feature y CTAs con destinos **válidos**.  
5. Dark mode por clases body.  

Este documento prioriza **ubicación, construcción e interacción verificables** para servir de referencia de reconstrucción, no como catálogo superficial de elementos.

---

## 19. Matriz de evidencia (resumen)

| Afirmación | Nivel |
| --- | --- |
| Estructura MainLayout | Verificado |
| Drawer navigation + overflow hidden | Verificado |
| Search expand/collapse + Escape | Verificado |
| Hero slides y autoplay 5s | Verificado |
| Destinos CTA hero | Verificado (incl. ruta rota) |
| FABs sin ancla | Verificado |
| Footer tel/mailto/redes | Verificado |
| PQRSD sin form Angular | Verificado |
| Intención de “conversión ciudadana” | Inferencia |
| Cumplimiento WCAG formal | No verificable |
| Métricas de uso reales | No verificable |

---

*Documento: `informe-ux-ui-construccion-e-interaccion.md` — basado exclusivamente en el repositorio `web-unp`.*
