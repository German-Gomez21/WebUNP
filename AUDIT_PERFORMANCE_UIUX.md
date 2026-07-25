# 🛠️ Informe de Auditoría QA: UI/UX & Performance
**Proyecto:** web-unp — Unidad Nacional de Protección (Angular v17)  
**Fecha de auditoría:** 23 de julio de 2026  
**Auditor:** Kiro — Lead Frontend Architect & Senior QA Auditor  

---

## 1. Resumen Ejecutivo

| Eje | Puntuación (1–10) | Estado |
|---|---|---|
| **Consistencia Visual / Design System** | 5 / 10 | ⚠️ Fragmentado |
| **Performance / Velocidad de carga** | 6.5 / 10 | 🟡 Aceptable con mejoras pendientes |

### Diagnóstico general

El proyecto está construido sobre Angular 17 con componentes standalone, lazy loading de rutas y señales reactivas, lo cual es una base técnica sólida. Sin embargo, la arquitectura de estilos presenta una fragmentación severa: **no existe un Design System formal**. Cada feature page define sus propios tokens de color, valores de `border-radius`, variantes de botones y máximos de contenedor (`.container`) de manera independiente y contradictoria. El sistema de dark mode es el problema de mayor escala: más de **~600 líneas de overrides con `!important`** están repartidas entre `styles.scss` global y los SCSS de cada componente, creando una deuda técnica alta y haciéndolo muy frágil.

En performance, hay prácticas positivas (lazy loading de rutas, `ChangeDetectionStrategy.OnPush` en la mayoría de componentes, `trackBy` en listas, lazy loading de imágenes condicional). Los problemas críticos son: `setInterval` no limpiados, `console.log` masivos en producción, inline templates en componentes que mezclan lógica de negocio y vista, y un `.styles.scss` que actúa como hoja global de 2000+ líneas en lugar de tokens parciales.


### Principales hallazgos críticos

1. **Sin Design System unificado:** colores, radios y tipografía hardcodeados en al menos 8 archivos SCSS distintos.
2. **Botones sin componente global:** existen 3 implementaciones independientes de `.btn--primary` con colores diferentes (`#ff7a1a`, `#FF6B35`, `#3366CC`).
3. **Sistema de dark mode hiper-inflado:** ~600+ líneas de overrides `!important` en `styles.scss`; duplicadas parcialmente en `pqrsd.component.scss`, `quienes-somos.component.scss`, `linea-vida-103.component.scss`.
4. **`setInterval` sin cleanup:** `HeroComponent` y `NewsComponent` crean timers con `setInterval` en `AfterViewInit`/`ngOnInit` sin `clearInterval` en `ngOnDestroy`, causando memory leaks.
5. **50+ `console.log`** en código de producción, incluyendo datos de estado de la barra de accesibilidad que se ejecutan en cada interacción de usuario.
6. **Imágenes de assets sin dimensiones ni lazy loading:** `gov-logo.png`, logos en header y footer carecen de `width`/`height` y `loading="lazy"`.
7. **Contenedor `.container` redefinido** en al menos 4 archivos SCSS con diferentes anchos máximos (1120px, 1180px, 1200px).

---

## 2. Auditoría de Consistencia UI/UX & Design System

### 2.1 Botones y Jerarquía de CTAs

#### Inconsistencias detectadas

Se identificaron **3 implementaciones paralelas e incompatibles** del sistema de botones:

| Implementación | Archivo | Color primario | `border-radius` | Uso |
|---|---|---|---|---|
| **Instancia A** | `pqrsd.component.scss` | `#ff7a1a` | `999px` (pill) | PQRSD hero y CTA final |
| **Instancia B** | `tramites-servicios.component.scss` | `#FF6B35` | `8px` (rectangular) | Tramites hero y cards |
| **Instancia C** | `quienes-somos.component.scss` (`.about-page__primary-link`) | `#3366CC` (azul institucional) | `999px` (pill) | Quiénes Somos hero |

Adicionalmente en `tramites-servicios.component.html` aparece `.btn--white` (fondo blanco, texto azul `#004884`) que no existe en ninguna otra página.

**Jerarquía CTA por página:**

- `pqrsd.component.html`: CTA primario "Radicar una PQRSD" + CTA secundario "Línea Vida 103" en el hero **y** un tercer CTA primario "Consultar documento" más abajo. → **2 CTAs primarios en la misma vista** (viola el principio de jerarquía única).
- `tramites-servicios.component.html`: "Solicitar Protección" (primario) + "Línea Vida 103" (blanco) en el hero. Cada card de trámite tiene además 2 botones ("Ver requisitos" + "Realizar trámite"). → Carga de CTAs excesiva.
- `hero.component.ts`: 3 slides × 1 CTA cada uno → correcto, solo uno visible a la vez.

#### Definición propuesta del Estándar

```scss
// _tokens.scss (archivo a crear)
$btn-radius-pill:  999px;   // → botones primarios y de acción de hero
$btn-radius-rect:  8px;     // → botones dentro de cards/tablas
$btn-color-primary: var(--accent, #3366CC);     // azul institucional
$btn-color-secondary: transparent;              // ghost/outline
$btn-color-danger:  #dc3545;
$btn-color-white:   #ffffff;
```

Propuesta de variantes únicas: `btn--primary`, `btn--secondary` (outline), `btn--ghost` (transparente), `btn--danger`. Extraer a `src/app/shared/components/button/button.component.ts`.

**Regla de jerarquía:** máximo 1 CTA primario (`btn--primary`) por sección/héro. Acciones secundarias usan `btn--secondary`.


### 2.2 Geometría (Bordes) y Sistema de Espaciado

#### Desviaciones encontradas — `border-radius`

Se encontraron **11 valores distintos** de `border-radius` a lo largo del proyecto, sin ninguna lógica de token documentada:

| Valor | Archivos donde aparece | Contexto |
|---|---|---|
| `4px` | `home.component.scss`, `tramites` `.tag` | Error button, tag de tramite |
| `8px` | `tramites-servicios`, `main.css`, `admin-dashboard` | Botones, search input, nav links |
| `10px` | `normativa` select/reset, `normativa-result-card__meta` | Filtros |
| `12px` | `tramites-servicios` (cards, search-box, channel-card), `footer` | Cards y footer container |
| `14px` | `transparencia`, `normativa` (search, items) | Componentes de búsqueda |
| `16px` | `pqrsd` (cajas internas) | Boxes de definición |
| `18px` | `pqrsd` + `transparencia` + `normativa` (cards principales) | Cards hero de secciones |
| `1rem` | `noticias`, `noticias-detail` (imágenes, cards) | Modo rem |
| `1.2rem` | `quienes-somos`, `noticias-detail` | Cards de quiénes somos |
| `1.75rem` / `2rem` | `quienes-somos` (secciones), `pqrsd` (hero) | Secciones principales |
| `999px` | `pqrsd` botones, filtros de noticias, badges | Pills |

Hay mezcla de unidades `px` y `rem` sin regla definida. Los valores `10px`, `14px`, `16px` y `18px` no están en la escala de 4px/8px base.

#### Desviaciones encontradas — Contenedor `.container`

```
main.css global       → max-width: 1200px  (con padding: 0 20px)
pqrsd.component.scss  → width: min(1180px, calc(100% - 2rem))
noticias.component.scss → width: min(1120px, calc(100% - 2rem))
noticias-detail       → width: min(1120px, calc(100% - 2rem))
la-unp.component.scss → padding: 20px; text-align: center (incompleto)
```

Cuatro definiciones distintas del mismo `.container`, causando inconsistencia de layout entre páginas.

#### Desviaciones — Espaciado `padding` / `margin` en secciones

- `section` en `main.css`: `padding: 100px 0` (desktop) → reducido a `40px` en móvil
- `pqrsd-page__hero`: `padding: 3rem 0 4rem`
- `tramites-hero`: `padding: 60px 0 80px`
- `normativa-hero` / `transparencia-hero`: `padding: 56px 0 72px`
- No existe un token de espaciado vertical de sección compartido.

#### Matriz de Estandarización propuesta

```scss
// _tokens.scss
// Escala de espaciado base-8
$space-1:  4px;
$space-2:  8px;
$space-3: 12px;
$space-4: 16px;
$space-5: 24px;
$space-6: 32px;
$space-7: 48px;
$space-8: 64px;
$space-9: 96px;

// Radios — escala semántica
$radius-sm:   4px;   // chips inline, tags pequeños
$radius-md:   8px;   // botones rect, inputs, cards internas
$radius-lg:  12px;   // cards de contenido
$radius-xl:  18px;   // cards hero, stat-cards
$radius-pill: 999px; // botones pill, badges, filtros

// Contenedor único
$container-max:     1200px;
$container-padding: 0 clamp(1rem, 3vw, 2rem);
```


### 2.3 Tipografía y Estilos Visuales

#### Inconsistencias tipográficas

**Fuentes declaradas:**
- `index.html` carga **Nunito Sans** desde Google Fonts (pesos 300, 400, 500, 600, 700, 800).
- `main.css` declara `font-family: 'Nunito Sans', -apple-system, ...` en el `body`.
- Las carpetas `/assets/fonts/Montserrat/` y `/assets/fonts/Work_Sans/static/` existen en el proyecto pero están **vacías**. Estas fuentes no se usan ni se cargan, pero los directorios sugieren intención de uso local que nunca se completó.
- `hero.component.ts` y `main.css` declaran `font-family: 'Nunito Sans', sans-serif` en elementos del carrusel (correcto), pero en `tramites-servicios.component.scss` no hay declaración de fuente en ningún elemento → hereda del body.
- El `<head>` en `index.html` carga también **Material Icons** y declara sus estilos en línea, duplicando lo que ya define `main.css` (doble declaración de `.material-icons`).

**Escala tipográfica — inconsistencias detectadas:**

| Elemento | Valores encontrados en distintas páginas |
|---|---|
| `h1` página | `clamp(2rem, 3vw, 3.4rem)` (PQRSD) · `clamp(2rem, 4.5vw, 3.2rem)` (Normativa) · `42px` fixo (Tramites) · `clamp(2rem, 4vw, 3.25rem)` (Transparencia) |
| Subtítulo héro | `1.05rem` (PQRSD) · `1.1rem` (Normativa) · `18px` (Tramites) · `1.05rem` (Transparencia) |
| Eyebrow/overline | `0.8rem` (PQRSD, Noticias) · `0.78rem` (Normativa, Transparencia) · `13px` (Transparencia en bloque) |
| `section__title` en `main.css` | `2.8rem` · pero en `home.component.scss` también `32px` (duplicado) |

La página de Tramites usa `42px` fijo para `h1` mientras todas las demás usan `clamp()`, lo que causa inconsistencia de escala responsive.

**Colores de texto hardcodeados fuera de variables:**

Se encontraron al menos **12 colores de texto distintos** sin usar las variables CSS definidas en `:root`:

| Color | Semántica | Archivos |
|---|---|---|
| `#102a43` | Texto primario oscuro | `noticias`, `noticias-detail` |
| `#1f2937` | Texto primario oscuro (ligeramente distinto) | `noticias`, `noticias-detail`, `pqrsd` |
| `#0f2c47` | Texto primario oscuro (otro matiz) | `pqrsd` múltiples elementos |
| `#0d2e4f` | Texto primario oscuro | `normativa`, `transparencia` |
| `#003b6d` | Azul institucional oscuro | `transparencia`, `normativa` stat-cards |
| `#004884` | Azul institucional (variante) | `tramites-servicios` títulos y botones |
| `#4b5563` | Texto secundario | `noticias`, `pqrsd`, `transparencia` |
| `#59657b` | Texto secundario (ligeramente distinto) | `normativa`, `transparencia` párrafos |
| `#6c757d` | Texto muted | `tramites-servicios` |
| `#64748b` | Texto muted | `noticias` meta |
| `#ff7a1a` | Acento naranja | `pqrsd` eyebrow/btn |
| `#FF6B35` | Acento naranja (variante) | `tramites`, `footer`, global |

Las variables `--text-primary: #102a43` y `--text-secondary: #4b5563` están definidas en `:root` dentro de `styles.scss` pero **no se consumen** en los componentes. Cada componente hardcodea su propio color.

#### Mapeo de jerarquía tipográfica recomendado

```scss
// _typography.scss
$type-display-lg: clamp(2.2rem, 4vw, 3.2rem);   // h1 de páginas
$type-display-sm: clamp(1.4rem, 2.5vw, 2rem);   // h2 de secciones
$type-heading:    clamp(1.1rem, 1.8vw, 1.45rem); // h3 de cards
$type-body-lg:    1.05rem;  // párrafos de hero
$type-body:       1rem;     // cuerpo
$type-body-sm:    0.95rem;  // meta, labels
$type-caption:    0.8rem;   // eyebrow, overlines
$type-tag:        0.78rem;  // chips, badges

// Pesos: 400 (body), 600 (subheadings), 700 (headings, CTAs), 800 (overlines, stat-values)
```


---

## 3. Auditoría de Rendimiento y Velocidad

### 3.1 Carga de Assets y Multimedia

#### Imágenes sin optimización

| Archivo | Problema | Impacto |
|---|---|---|
| `assets/images/gov-logo.png` | PNG (formato obsoleto para logotipo), sin `width`/`height`, sin `loading` en `main-layout.component.html` | Layout shift (CLS), bloqueo de render |
| `assets/images/unp-logo.png` | PNG duplicado junto a `unp-logo.svg` (mismo logotipo en dos formatos) | Peso de bundle innecesario |
| `assets/images/carousel-1.jpg` / `carousel-2.png` / `carousel-3.jpg` | Formatos `.jpg` y `.png` para imágenes de carrusel hero — no se sirven en WebP/AVIF. Sin `width`/`height` declarados en el componente `hero.component.ts` (background-image vía CSS) | Sin capacidad de `srcset`, sin dimensiones para CLS |
| `assets/images/unp-institution.jpg`, `hero-protection.jpg`, `hero-pqrsd.jpg`, `hero-linea-vida.jpg` | JPG sin conversión a WebP, referenciados como `background-image` en CSS inline → sin control de lazy loading | Carga innecesaria en páginas que no las usan |
| `assets/images/gov-logo.png` en `main-layout` | Sin atributos `width="..."` y `height="..."` | Provoca CLS score negativo en Core Web Vitals |
| `footer.component.html` — logos de redes sociales SVG | SVGs cargados como `<img>` sin `loading="lazy"` ni dimensiones explícitas en el template | Sin mejora percibida, pero sí evitable |
| `header.component.ts` — logo UNP | `<img>` sin `loading` (debería ser `eager` con `fetchpriority="high"` al ser above-the-fold) | Potencial LCP degradado si el browser lo trata como lazy |

#### Imágenes bien implementadas (referencia positiva)
- `noticias.component.html`: usa `[attr.loading]="$index < 2 ? 'eager' : 'lazy'"`, `[attr.fetchpriority]`, `width`/`height` explícitos y `decoding="async"`. ✅
- `news.component.ts`: usa `[ngSrc]` de Angular con `sizes` responsive. ✅
- `noticias-detail.component.html`: `fetchpriority="high"` + `loading="eager"` para la imagen hero. ✅

**Recomendación:** estandarizar el patrón de `noticias` en todos los componentes. Convertir JPGs/PNGs de assets a WebP con fallback PNG. Añadir `width` y `height` al `gov-logo.png` en `main-layout`.

---

### 3.2 Estrategia de Carga y Code Splitting

#### Lo que está bien

Todas las rutas en `app.routes.ts` usan `loadComponent()` con `import()` dinámico — lazy loading correcto a nivel de ruta. ✅

#### Problemas detectados

**`setInterval` sin limpieza — memory leaks críticos:**

```typescript
// hero.component.ts — línea 146
private startAutoRotate(): void {
  setInterval(() => {            // ← NO se guarda la referencia
    this.nextSlide();
  }, 5000);
}
// No existe ngOnDestroy → el timer sigue corriendo después de destruir el componente
```

```typescript
// news.component.ts — línea 117 (mismo patrón)
private startAutoRotate(): void {
  setInterval(() => {
    if (this.newsItems().length > 0) { this.nextSlide(); }
  }, 4000);                      // ← misma situación
}
```

Cada vez que el usuario navega fuera y vuelve al home, se acumula un timer adicional. Con 5 visitas al home: 10 timers activos en paralelo.

**Inline templates excesivamente largos:**

| Componente | Líneas de template inline | Problema |
|---|---|---|
| `header.component.ts` | ~135 líneas de HTML en `template:` | No permite tree-shaking de template, dificulta mantenimiento, no hay separación de concerns |
| `services.component.ts` | ~80 líneas de HTML con datos hardcodeados | Contenido estático embebido que debería ser un archivo `.html` + datos en servicio |
| `sections.component.ts` | ~60 líneas con estilos inline (`style="background-size: cover..."`) | Estilos inline que no pueden optimizarse ni sobreescribirse desde SCSS |
| `hero.component.ts` | ~45 líneas de template | Aceptable, pero deseable separar |

**`sections.component.ts` — estilos inline en template:**
```html
<div class="info-section-card__image" 
     [style.background-image]="'url(' + section.imagen + ')'" 
     style="background-size: cover; background-position: center; 
            background-repeat: no-repeat; display: flex; 
            align-items: center; justify-content: center;
            position: relative;">
```
Estos estilos deberían estar en el SCSS del componente, no en el template. Además el div interno con `style="position:absolute..."` también hardcodea estilos, impidiendo que el dark mode los sobreescriba.

**`document.addEventListener` en constructor del Header sin cleanup:**
```typescript
// header.component.ts — constructor
document.addEventListener('click', (event) => {
  if (this.activeMenu() !== null) { ... }
});
// No se llama removeEventListener en ngOnDestroy → event listener leak
```

**`accessibility-bar.component.ts` — manipulación directa del DOM:**
El componente usa `document.getElementById()` extensivamente para gestionar estado visual, en lugar de enlazar clases Angular con `[class.active]`. Esto rompe la detección de cambios de Angular y hace el componente difícil de testear. Además tiene **>50 llamadas a `console.log`** activas en producción, incluyendo callbacks de `mouseenter`/`mouseleave` que se disparan en cada hover.


### 3.3 Optimizaciones de Código y Renderizado

#### `styles.scss` global — 2000+ líneas monolíticas

El archivo `src/styles.scss` actúa como hoja de estilos global única con:
- Overrides de dark mode para **todas** las páginas (~600 líneas con `!important`)
- Variables CSS en `:root`
- Estilos de layout de `tramites-servicios` embebidos (líneas ~1900-1970)
- Reglas de sección `.home .section:nth-of-type(n)` que solo aplican al home pero están en el global

Esto provoca que **el parser CSS del browser cargue y evalúe todo este CSS en cada página**, incluso cuando la mayoría de reglas no aplican. El approach correcto es que cada componente SCSS gestione sus propios dark mode overrides mediante la encapsulación de Angular, o usando `@layer` con lazy imports.

#### Duplicación de dark mode overrides

Los overrides de dark mode están **triplicados** en tres capas:

1. `styles.scss` global: overrides completos para `about-page`, `news-page`, `pqrsd`, `tramites`, `transparencia`, `normativa`, `footer`, `header`, `accessibility-bar`...
2. `pqrsd.component.scss`: repite overrides de `body.modo_oscuro-govco .pqrsd-page`, `.hero-card`, `.section-card`, etc. (ya cubiertos en global)
3. `quienes-somos.component.scss`: repite overrides de `body.modo_oscuro-govco .about-page__*` (ya cubiertos en global)
4. `linea-vida-103.component.scss`: repite parcialmente overrides de `.eyebrow` en modo oscuro

Esto aumenta el tamaño total del CSS parseado y crea conflictos potenciales de especificidad.

#### Reglas CSS comentadas/zombies en `styles.scss`

```scss
//body.modo_oscuro-govco .transparencia-page,
//body.modo_oscuro-govco .transparencia-hero,
//body.modo_oscuro-govco .transparencia-main,
//body.modo_oscuro-govco .transparencia-toolbox,
```
Hay bloques de reglas comentadas con `//` dentro de archivos `.css` (no `.scss`). En CSS puro `//` no es un comentario válido — si alguna regla se procesa como CSS plano podría romper el parseo.

#### `news-card__category` — color incorrecto

```scss
// noticias.component.scss — línea 202
.news-card__category {
  font-weight: 700;
  color: #e0e0e0;  // ← gris muy claro sobre fondo blanco → ratio de contraste WCAG AA: FALLO
}
```
El color `#e0e0e0` sobre `#ffffff` tiene un ratio de contraste de **1.45:1**, muy por debajo del mínimo 4.5:1 requerido por WCAG AA para texto normal. Este es un **fallo de accesibilidad crítico**.

#### `la-unp.component.scss` — implementación incompleta

```scss
// la-unp.component.scss
.container {
  padding: 20px;
  text-align: center;
}
```
Solo 4 líneas de CSS. La página de "La UNP" es prácticamente un placeholder sin estilos propios, lo que probablemente resulta en una página visualmente muy diferente al resto de la aplicación.

#### `adjustFontSize()` en `accessibility-bar.component.ts` — operación costosa

El método itera sobre **todos** los `<p>`, `<h1>`–`<h6>`, `<span>`, `<div>`, `<li>` y `<a>` del documento completo para ajustar `font-size` individualmente. En una página con 200+ elementos esto es una operación O(n) aplicada al DOM completo en cada click, sin debounce ni `requestAnimationFrame`. La solución correcta es cambiar la propiedad `font-size` del `<html>` raíz (que usa `rem` como unidad base) en lugar de iterar cada elemento.

#### Ausencia de `DestroyRef` / `takeUntilDestroyed` en subscripciones

En `home.component.ts`, `banners.component.ts`, `sections.component.ts` y `noticias.component.ts` se usan `.subscribe()` en `ngOnInit` sin unsubscribe explícito. Aunque los servicios devuelven Observables que completan (`HttpClient`), cualquier refactor a Observables de larga vida podría causar leaks.

#### `header.component.ts` — `dropdownTimeouts` como Signal de Record

```typescript
dropdownTimeouts = signal<Record<string, any>>({});
// Se muta el objeto interno y se re-asigna en cada setTimeout/clearTimeout
```
Usar un `signal` para almacenar referencias a timers y mutarlas es un patrón incorrecto. Los timers deberían estar en propiedades privadas del componente, no en signals reactivos (que pueden disparar re-renders).


---

## 4. Matriz de Componentes y Páginas Auditadas

| Componente / Página | Archivo principal | Problema UI/UX | Problema Performance | Prioridad |
|---|---|---|---|---|
| **Hero Carrusel** | `home/components/hero/hero.component.ts` | Ningún botón de pausa — accesibilidad (WCAG 2.1 SC 2.2.2). Template inline largo | `setInterval` sin `clearInterval` en `ngOnDestroy` → memory leak | 🔴 Alta |
| **Header / Navegación** | `layout/header/header.component.ts` | Menú activo (`activo: true`) hardcodeado en el signal de datos — no refleja la ruta actual dinámicamente | `document.addEventListener` sin cleanup. `dropdownTimeouts` almacenado como Signal (incorrecto). Template de 135 líneas inline | 🔴 Alta |
| **Barra de Accesibilidad** | `layout/accessibility-bar/accessibility-bar.component.ts` | Manipulación directa del DOM con `getElementById` en lugar de bindings Angular | 50+ `console.log` activos en producción, incluidos en callbacks `mouseenter`/`mouseleave`. `setTimeout` de diagnóstico que no se limpia | 🔴 Alta |
| **Home Page** | `home/home.component.ts` | Delegación completa a sub-componentes sin estructura semántica propia | 8 subscripciones en `loadData()` sin `takeUntilDestroyed`. 8+ `console.log` en producción | 🟡 Media |
| **Noticias Component** | `features/noticias/noticias.component.ts/.html` | `news-card__category` color `#e0e0e0` — falla WCAG AA (contraste 1.45:1) | `setInterval` en `news.component.ts` (sub-componente) sin cleanup | 🔴 Alta |
| **Tramites y Servicios** | `features/tramites-servicios/` | `.btn--primary` naranja `#FF6B35` vs `.btn--primary` azul `#3366CC` en otras páginas. Botón "Solicitar Protección" no tiene `routerLink` — es un `<button>` sin acción | `.btn` redefinido localmente en lugar de reusar componente global | 🟡 Media |
| **PQRSD** | `features/pqrsd/` | 2 CTAs primarios en la misma vista. `.btn--primary` usa `#ff7a1a` (diferente al sistema). Dark mode overrides duplicados con `styles.scss` | Overrides dark mode duplicados aumentan CSS parseado | 🟡 Media |
| **Quiénes Somos** | `features/quienes-somos/` | Botón primario usa `#3366CC` (correcto) pero con clase propia `.about-page__primary-link` en lugar del sistema de botones | Dark mode overrides duplicados con `styles.scss` (~50 líneas extra) | 🟡 Media |
| **Transparencia** | `features/transparencia/` | `.transparencia-filter.is-active` usa `#ff6b35` como activo — consistente con el resto del sistema de filtros | `.container` no redefinido — usa el global correctamente ✅ | 🟢 Baja |
| **Normativa** | `features/normativa/` | Mismos patrones de diseño que Transparencia. Botón `.normativa-reset` usa `#ff6b35` directamente | Bien estructurado. Sin problemas de performance críticos | 🟢 Baja |
| **Línea Vida 103** | `features/linea-vida-103/` | `border-radius` con variable CSS `var(--border-radius-md)` (correcto), pero duplicada dos veces en misma regla | `.eyebrow` con `color: #ff7a1a` hardcodeado (inconsistente con PQRSD que usa `#ff7a1a` también, pero diferente de footer `#FF6B35`) | 🟢 Baja |
| **Noticias Detail** | `features/noticias/noticias-detail.component.*` | Imagen hero `<img>` aparece **triplicada** en el HTML renderizado (línea 22 tiene 3 instancias del mismo tag `<img>`) — posible bug de template | `fetchpriority="high"` y `loading="eager"` bien implementados ✅ | 🔴 Alta |
| **La UNP** | `features/la-unp/` | Página con CSS de 4 líneas — visualmente incompleta. Sin estructura semántica propia | Sin impacto de performance, pero experiencia de usuario degradada | 🔴 Alta |
| **Footer** | `layout/footer/footer.component.*` | Social icons como `<img>` sin `loading="lazy"`. `footer__social-link` definido DOS veces en el mismo SCSS (conflicto de estilos: `width: 40px` vs `width: 44px`) | `transform: translateY(-50px)` en `.footer__card-container` fuerza un nuevo stacking context y puede causar repaint en scroll | 🟡 Media |
| **Main Layout** | `layout/main-layout/` | `<a href="#">` para links "Portal Único del Estado" y "Gobierno en Línea" → sin destinos reales | `console.log` en constructor | 🟡 Media |
| **Admin Dashboard** | `features/admin/` | Sin relación de diseño con el sistema visual del sitio público — usa variables SCSS locales (`$primary-blue`) desconectadas de los tokens globales | `console.log` en producción | 🟢 Baja |
| **Banners (Home)** | `home/components/banners/banners.component.ts` | `banner-card__link` → texto genérico "Ir al servicio" en todos los banners — falla de accesibilidad (contexto de enlace insuficiente) | Template inline sin separar | 🟡 Media |
| **Sections (Home)** | `home/components/sections/sections.component.ts` | Estilos inline embebidos en template (`style="background-size: cover..."`) | No separable por dark mode. Mezcla de concerns | 🟡 Media |
| **Services (Home)** | `home/components/services/services.component.ts` | `<a href="pqrsd.html">` usa ruta relativa de archivo HTML antiguo en lugar de `routerLink="/pqrsd"` → enlace roto en Angular routing | Datos de servicios hardcodeados en template (no en servicio) | 🔴 Alta |
| **Institutional Carousel** | `shared/components/institutional-carousel/` | Único componente shared con `ChangeDetectionStrategy.OnPush` y `autoPlayTimer` correctamente tipado ✅ | Timer correctamente almacenado como propiedad privada ✅ | 🟢 Baja |
| **styles.scss global** | `src/styles.scss` | `body.modo_oscuro-govco *` con `color: var(--dark-text-primary) !important` — selector universal con `!important` sobre todos los elementos → especificidad nuclear | 2000+ líneas procesadas en cada página. Reglas de `.home .section:nth-of-type()` en global en lugar de `home.component.scss` | 🔴 Alta |


---

## 5. Plan de Acción y Hoja de Ruta (Roadmap de Implementación)

Los pasos están ordenados por impacto y riesgo. Cada fase puede ejecutarse de forma independiente sin romper la aplicación.

---

### 🔴 FASE 1 — Correcciones críticas (sin impacto visual) · Estimado: 1–2 días

Estas correcciones no cambian la apariencia del sitio pero eliminan bugs, memory leaks y riesgos de producción.

**1.1 Eliminar `console.log` de producción**
- Archivos: `home.component.ts`, `header.component.ts`, `footer.component.ts`, `main-layout.component.ts`, `accessibility-bar.component.ts`, `admin-dashboard.component.ts`
- Acción: reemplazar por `environment.production ? null : console.log(...)` o eliminar completamente. Configurar ESLint rule `no-console`.

**1.2 Corregir memory leaks de `setInterval`**
- Archivos: `hero.component.ts`, `news.component.ts` (sub-componente de home)
- Acción: guardar referencia del timer e implementar `ngOnDestroy`:
```typescript
private autoRotateTimer: ReturnType<typeof setInterval> | null = null;

ngAfterViewInit(): void {
  this.autoRotateTimer = setInterval(() => this.nextSlide(), 5000);
}

ngOnDestroy(): void {
  if (this.autoRotateTimer) clearInterval(this.autoRotateTimer);
}
```

**1.3 Corregir `document.addEventListener` sin cleanup en Header**
- Archivo: `header.component.ts` — constructor
- Acción: mover a `ngAfterViewInit` con `DestroyRef` y `inject(DestroyRef).onDestroy(...)`, o usar `@HostListener('document:click')`.

**1.4 Corregir enlace roto en Services**
- Archivo: `services.component.ts` (home sub-componente)
- Línea: `<a href="pqrsd.html" class="service-card">`
- Acción: cambiar a `<a routerLink="/pqrsd" class="service-card">`. Requiere importar `RouterModule`.

**1.5 Corregir imagen triplicada en Noticias Detail**
- Archivo: `noticias-detail.component.html` — verificar y eliminar las 2 instancias duplicadas del `<img>` en línea 22.

**1.6 Corregir color de contraste WCAG en `.news-card__category`**
- Archivo: `noticias.component.scss`
- Cambiar `color: #e0e0e0` por `color: #6b7280` (ratio 4.6:1 sobre blanco → pasa WCAG AA).

---

### 🟡 FASE 2 — Design Tokens y Sistema de Variables · Estimado: 1–3 días

No cambia la apariencia del sitio, solo centraliza los valores existentes.

**2.1 Crear archivo de tokens `src/styles/_tokens.scss`**
Definir en él todas las variables que actualmente están hardcodeadas o duplicadas:
- Colores: `--color-primary`, `--color-accent-orange`, `--color-text-primary`, `--color-text-secondary`, `--color-bg-surface`, etc.
- Radios: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (18px), `--radius-pill` (999px)
- Espaciado: `--space-1` a `--space-9`
- Tipografía: `--type-display-lg`, `--type-heading`, `--type-body`, `--type-caption`
- Sombras: `--shadow-sm`, `--shadow-md`, `--shadow-lg` (ya en `main.css`, mover a tokens)

**2.2 Unificar definición de `.container`**
- Eliminar las 4 redefiniciones en `pqrsd`, `noticias`, `noticias-detail`, `la-unp`
- Mantener una única definición en `main.css` o `_layout.scss`:
  ```css
  .container {
    width: min(1200px, calc(100% - clamp(1rem, 3vw, 2rem) * 2));
    margin: 0 auto;
  }
  ```

**2.3 Migrar colores hardcodeados de componentes a tokens**
Prioridad alta: `transparencia.component.scss`, `normativa.component.scss`, `tramites-servicios.component.scss`. Reemplazar `#0d2e4f`, `#59657b`, `#FF6B35`, etc. por las variables definidas en 2.1.

---

### 🟡 FASE 3 — Sistema de Botones Unificado · Estimado: 1 día

**3.1 Crear `ButtonComponent` compartido** en `src/app/shared/components/button/`
Con `@Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger'` y `@Input() size: 'sm' | 'md' | 'lg'`.

**3.2 Unificar color del botón primario**
- Decisión: usar `#3366CC` (azul institucional, ya presente en `main.css` y `quienes-somos`) como único color de CTA primario, reservando `#FF6B35` (naranja) exclusivamente para **acentos y estados activos de filtros**, no para botones de acción principal.
- Migrar `pqrsd.component.scss` (`.btn--primary { background: #ff7a1a }`) y `tramites-servicios.component.scss` (`.btn--primary { background: #FF6B35 }`) al token unificado.

**3.3 Corregir jerarquía de CTAs en PQRSD**
- `pqrsd.component.html` línea 229: cambiar el segundo `btn--primary` ("Consultar documento") por `btn--secondary` para mantener un único CTA primario visible por sección.

---

### 🟡 FASE 4 — Optimización de Assets · Estimado: 2–3 horas

**4.1 Añadir dimensiones y atributos a imágenes sin optimizar**
```html
<!-- main-layout.component.html -->
<img src="assets/images/gov-logo.png" alt="Gobierno de Colombia" 
     class="gov-bar__logo" width="120" height="24" loading="eager">

<!-- header.component.ts -->
<img src="assets/images/unp-logo.svg" alt="Logo UNP" 
     class="header__logo-img" width="144" height="96" 
     fetchpriority="high" loading="eager">
```

**4.2 Añadir `loading="lazy"` a imágenes below-the-fold**
- Footer social icons: `<img ... loading="lazy">`
- Logo en footer: `<img ... loading="lazy" width="200" height="80">`

**4.3 Eliminar carpetas vacías**
- `src/assets/fonts/Montserrat/` y `src/assets/fonts/Work_Sans/` están vacías. Si no se van a usar, eliminar para no generar confusión. Si se planean usar, completar la integración con `@font-face` en `_tokens.scss`.

---

### 🟠 FASE 5 — Refactorización del Dark Mode · Estimado: 3–5 días

Esta es la deuda técnica más grande y la que más impacta el mantenimiento a largo plazo.

**5.1 Eliminar el selector nuclear `body.modo_oscuro-govco *`**
```scss
// ELIMINAR de styles.scss:
body.modo_oscuro-govco,
body.modo_oscuro-govco * {
  color: var(--dark-text-primary) !important;  // ← cobertura excesiva
}
```
Reemplazar por la estrategia de CSS custom properties en `:root`:
```scss
:root {
  --color-text: #102a43;
  --color-bg: #ffffff;
}
body.modo_oscuro-govco {
  --color-text: #f5f7fa;
  --color-bg: #333333;
}
```
Los componentes que usen `color: var(--color-text)` heredarán automáticamente ambos modos sin `!important`.

**5.2 Mover overrides de dark mode duplicados de vuelta a componentes**
- Eliminar de `styles.scss` los overrides de `.about-page__*`, `.news-page__*`, `.pqrsd-page__*` que ya están en sus respectivos SCSS de componente.
- Usar la encapsulación de Angular: en `quienes-somos.component.scss`, los selectores `body.modo_oscuro-govco .about-page__*` funcionan correctamente con `ViewEncapsulation.None` (ya activo en la barra de accesibilidad) o sin encapsulación en el SCSS de componentes `standalone`.

**5.3 Refactorizar `accessibility-bar.component.ts`**
- Reemplazar `document.getElementById()` por referencias con `@ViewChild` o bindings Angular `[class.active]="isContrastActive()"`.
- Eliminar todos los `console.log` de diagnóstico (preparados durante desarrollo).
- Reemplazar `adjustFontSize()` con mutación del `font-size` del elemento `<html>`:
```typescript
adjustFontSize(op: 'aumentar' | 'disminuir'): void {
  const html = document.documentElement;
  const current = parseFloat(getComputedStyle(html).fontSize);
  const next = op === 'aumentar' ? Math.min(current + 1, 22) : Math.max(current - 1, 12);
  html.style.fontSize = `${next}px`;
}
```

---

### 🟢 FASE 6 — Mejoras de Tipografía y Accesibilidad · Estimado: 1–2 días

**6.1 Unificar escala tipográfica**
- Reemplazar el `h1` de `tramites-servicios` (`font-size: 42px` fijo) por `font-size: clamp(2.2rem, 4vw, 3.2rem)` como las demás páginas.
- Aplicar las variables tipográficas de `_tokens.scss` a los eyebrow/overline (`0.78rem` vs `0.8rem` → unificar a `0.8rem`).

**6.2 Completar la página La UNP**
- `la-unp.component.scss` tiene 4 líneas — añadir estructura visual coherente con el resto de páginas, al menos un hero y breadcrumbs.

**6.3 Añadir botón de pausa al carrusel hero**
- Requisito WCAG 2.1 SC 2.2.2: contenido que se mueve automáticamente debe poder pausarse.
```html
<button class="hero-carousel__pause" (click)="togglePause()" 
        [attr.aria-label]="isPaused() ? 'Reanudar carrusel' : 'Pausar carrusel'">
  <i class="material-icons">{{ isPaused() ? 'play_arrow' : 'pause' }}</i>
</button>
```

**6.4 Corregir links placeholder en Main Layout**
- `<a href="#">Portal Único del Estado</a>` → `<a href="https://www.gov.co" target="_blank" rel="noopener">Portal Único del Estado</a>`
- `<a href="#">Gobierno en Línea</a>` → `<a href="https://www.gobiernoenlinea.gov.co" target="_blank" rel="noopener">Gobierno en Línea</a>`

**6.5 Corregir textos de enlace genéricos en Banners**
- `banner-card__link` con texto "Ir al servicio" en todos los banners → cambiar a textos descriptivos por banner, o usar `aria-label` para proporcionar contexto adicional al lector de pantalla.

---

### 🟢 FASE 7 — Optimizaciones finales de rendimiento · Estimado: 1–2 días

**7.1 Separar templates inline a archivos `.html`**
- Prioridad: `header.component.ts` (135 líneas) → mover a `header.component.html`
- Opcional: `hero.component.ts`, `banners.component.ts`, `sections.component.ts`, `services.component.ts`

**7.2 Mover estilos inline de `sections.component.ts`**
- Extraer todos los `style="..."` del template a clases CSS en el SCSS del componente.

**7.3 Mover datos hardcodeados de `services.component.ts` a `DataService`**
- Los 8 service-cards del componente de servicios están hardcodeados en el template. Moverlos al servicio de datos para facilitar mantenimiento sin tocar código de template.

**7.4 Configurar ESLint con reglas de calidad**
- El proyecto ya tiene `@typescript-eslint` en devDependencies pero no hay archivo `.eslintrc`. Añadir `no-console`, `@angular-eslint/no-lifecycle-call`, y reglas de `@angular-eslint`.

**7.5 Limpiar carpetas vacías y archivos `.scss.new`**
- `src/styles.scss.new` — archivo con sufijo `.new` probablemente de un intento de refactorización. Revisar su contenido y eliminar si es redundante.

---

## Resumen de Prioridades

| Fase | Tipo | Impacto | Riesgo de regresión | Tiempo est. |
|---|---|---|---|---|
| **Fase 1** — Bugs críticos y memory leaks | 🔴 Corrección | Alto (estabilidad) | Muy bajo | 1–2 días |
| **Fase 2** — Design tokens centralizados | 🟡 Arquitectura CSS | Alto (mantenimiento) | Muy bajo | 1–3 días |
| **Fase 3** — Sistema de botones | 🟡 UI/UX | Medio (consistencia) | Bajo | 1 día |
| **Fase 4** — Optimización de assets | 🟡 Performance | Medio (CLS/LCP) | Nulo | 2–3 horas |
| **Fase 5** — Refactorización dark mode | 🟠 Deuda técnica | Muy alto (mantenibilidad) | Medio | 3–5 días |
| **Fase 6** — Tipografía y accesibilidad | 🟢 Calidad | Medio | Bajo | 1–2 días |
| **Fase 7** — Optimizaciones finales | 🟢 DX / Performance | Bajo | Bajo | 1–2 días |

---

*Informe generado por auditoría estática de código (modo read-only). Las puntuaciones y estimaciones de tiempo asumen un desarrollador frontend con conocimiento del proyecto. La validación completa de accesibilidad requiere pruebas manuales con tecnologías de asistencia (NVDA, VoiceOver) y revisión experta de WCAG 2.1.*
