# 🎨 Design System — Unidad Nacional de Protección (UNP)
**Versión:** 1.0.0  
**Fecha:** Julio 2026  
**Stack:** Angular 17 · SCSS · CSS Custom Properties  
**Basado en:** Auditoría QA `AUDIT_PERFORMANCE_UIUX.md` + lineamientos GOV.CO

> Este documento es la **fuente única de verdad** para decisiones de diseño e implementación visual en el proyecto `web-unp`. Cualquier valor que no figure aquí no debe usarse en producción.

---

## 1. Fundamentos del Sistema — Tokens de Diseño

Los tokens son las variables atómicas del sistema. Todo componente, estilo y estado visual debe derivar **exclusivamente** de estos valores. Ningún componente define colores, tamaños o espaciados propios.

### 1.1 Paleta de Color

#### Colores Primarios — Marca Institucional

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-primary` | `#3366CC` | CTAs primarios, enlaces activos, acento principal |
| `--color-primary-dark` | `#2851A3` | Hover de botón primario, estados presionados |
| `--color-primary-light` | `#E7F1FF` | Fondos de elementos seleccionados, highlight sutil |
| `--color-primary-muted` | `rgba(51,102,204,0.12)` | Chip/pill de acento, iconos de fondo |

#### Colores de Acento — Naranja GOV.CO

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-accent` | `#FF6B35` | Barra decorativa del footer, estados activos de filtros, iconos de contacto |
| `--color-accent-dark` | `#E55A2B` | Hover del acento |
| `--color-accent-light` | `rgba(255,107,53,0.12)` | Fondos de badge de alerta/destacado |

> ⚠️ **Regla crítica:** `--color-accent` (naranja) es un color de **énfasis decorativo**, no de acción. Los botones de acción primaria usan `--color-primary` (azul). Esta distinción corrige el antipatrón detectado en la auditoría.

#### Colores de Texto

| Token CSS | Valor hex | Contraste sobre blanco | Uso |
|---|---|---|---|
| `--color-text-primary` | `#102A43` | 12.6:1 ✅ AAA | Títulos, contenido principal |
| `--color-text-secondary` | `#4B5563` | 7.2:1 ✅ AA+ | Párrafos, subtítulos, descripciones |
| `--color-text-muted` | `#6B7280` | 4.6:1 ✅ AA | Metadatos, labels, captions |
| `--color-text-disabled` | `#9CA3AF` | 2.5:1 ⚠️ Solo decorativo | Texto de elementos deshabilitados |
| `--color-text-inverse` | `#FFFFFF` | — | Texto sobre fondos oscuros/primarios |
| `--color-text-link` | `#3366CC` | 5.9:1 ✅ AA | Enlaces en cuerpo de texto |

#### Colores de Superficie / Fondo

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-surface-base` | `#FFFFFF` | Fondo base de página |
| `--color-surface-muted` | `#F7F9FC` | Secciones alternas, fondos de página de feature |
| `--color-surface-subtle` | `#F1F5F9` | Fondos de inputs, hover de filas |
| `--color-surface-card` | `#FFFFFF` | Cards, modales, paneles elevados |
| `--color-surface-overlay` | `rgba(0,0,0,0.4)` | Overlays de carrusel, modales |

#### Colores de Borde

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-border` | `#DFE7F3` | Bordes estándar de cards e inputs |
| `--color-border-strong` | `#C4CDD8` | Bordes en estado focus-adjacent |
| `--color-border-focus` | `#3366CC` | Borde de focus ring |

#### Colores de Estado / Semánticos

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-success` | `#17633A` | Texto de éxito |
| `--color-success-bg` | `#E7F7ED` | Fondo de badge/alert de éxito |
| `--color-warning` | `#92400E` | Texto de advertencia |
| `--color-warning-bg` | `#FEF3C7` | Fondo de badge/alert de advertencia |
| `--color-error` | `#DC3545` | Texto de error, borde de input inválido |
| `--color-error-bg` | `#FEE2E2` | Fondo de badge/alert de error |
| `--color-info` | `#0057A3` | Texto informativo |
| `--color-info-bg` | `#EDF5FF` | Fondo de badge/alert informativo |


#### Modo Oscuro — Overrides de tokens

Cuando el `<body>` tenga la clase `.modo_oscuro-govco`, los tokens se redefinen automáticamente. Los componentes **no necesitan** reglas adicionales si consumen los tokens correctamente.

```scss
// src/styles/_tokens.scss
:root {
  // Superficies
  --color-surface-base:    #FFFFFF;
  --color-surface-muted:   #F7F9FC;
  --color-surface-subtle:  #F1F5F9;
  --color-surface-card:    #FFFFFF;
  // Texto
  --color-text-primary:    #102A43;
  --color-text-secondary:  #4B5563;
  --color-text-muted:      #6B7280;
  // Bordes
  --color-border:          #DFE7F3;
  --color-border-strong:   #C4CDD8;
}

// Un solo bloque de dark mode — no se repite por componente
body.modo_oscuro-govco {
  --color-surface-base:    #1B2430;
  --color-surface-muted:   #232D3B;
  --color-surface-subtle:  #293445;
  --color-surface-card:    #232D3B;
  --color-text-primary:    #F5F7FA;
  --color-text-secondary:  #D4DBE7;
  --color-text-muted:      #8A97AA;
  --color-border:          #3B4757;
  --color-border-strong:   #4A5568;
  --color-primary:         #68A1FF;   // versión más clara para dark
  --color-primary-light:   rgba(104,161,255,0.18);
  --color-accent:          #FF8B53;   // naranja ligeramente más claro
}
```

---

### 1.2 Tipografía

#### Familia tipográfica

```scss
--font-family-base:    'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono:    'Courier New', Courier, monospace; // solo para código/datos técnicos
```

> La fuente **Nunito Sans** se carga desde Google Fonts con `display=swap`. Las carpetas `/assets/fonts/Montserrat/` y `/assets/fonts/Work_Sans/` deben eliminarse del repositorio por estar vacías (ver auditoría §2.3).

#### Escala tipográfica

Todos los tamaños usan `clamp()` para escalar fluidamente sin breakpoints adicionales.

| Token | Valor `clamp` | Equivalente desktop | Uso |
|---|---|---|---|
| `--type-display-xl` | `clamp(2.5rem, 5vw, 3.5rem)` | ~56px | Título de hero principal (home) |
| `--type-display-lg` | `clamp(2rem, 4vw, 3.2rem)` | ~51px | `h1` de páginas de feature |
| `--type-display-sm` | `clamp(1.5rem, 2.5vw, 2rem)` | ~32px | `h2` de secciones principales |
| `--type-heading-lg` | `clamp(1.2rem, 2vw, 1.5rem)` | ~24px | `h3` de cards, títulos de panel |
| `--type-heading-sm` | `1.1rem` | ~17.6px | `h4`, subtítulos de card |
| `--type-body-lg` | `1.05rem` | ~16.8px | Párrafo de hero, texto introductorio |
| `--type-body` | `1rem` | 16px | Cuerpo de texto estándar |
| `--type-body-sm` | `0.95rem` | ~15.2px | Labels, metadatos, leyendas |
| `--type-caption` | `0.8rem` | 12.8px | Eyebrow/overline, timestamps |
| `--type-tag` | `0.78rem` | ~12.5px | Chips, badges, tags internos |

#### Pesos

| Token | Valor | Uso |
|---|---|---|
| `--font-weight-normal` | `400` | Cuerpo de texto |
| `--font-weight-medium` | `500` | Labels, sublabels |
| `--font-weight-semibold` | `600` | Títulos de columna, nav links |
| `--font-weight-bold` | `700` | Headings, CTAs, links |
| `--font-weight-extrabold` | `800` | Eyebrows, stat-values, overlines |

#### Altura de línea

| Token | Valor | Uso |
|---|---|---|
| `--line-height-tight` | `1.15` | Títulos grandes display |
| `--line-height-snug` | `1.35` | Headings de card |
| `--line-height-normal` | `1.6` | Cuerpo de texto general |
| `--line-height-relaxed` | `1.75` | Párrafos largos, listas |

---

### 1.3 Escala de Espaciado

Base de **4px**. Todos los márgenes, paddings y gaps deben ser múltiplos de esta escala.

| Token | Valor px | Valor rem | Uso típico |
|---|---|---|---|
| `--space-1` | 4px | 0.25rem | Gap entre icono y texto inline |
| `--space-2` | 8px | 0.5rem | Padding interno de badge/tag |
| `--space-3` | 12px | 0.75rem | Gap entre elementos de lista compacta |
| `--space-4` | 16px | 1rem | Padding interno de botón, gap de grid compacto |
| `--space-5` | 20px | 1.25rem | Padding interno de input, gap de formulario |
| `--space-6` | 24px | 1.5rem | Padding interno de card, gap de grid estándar |
| `--space-7` | 32px | 2rem | Margen entre secciones de card, gap de hero |
| `--space-8` | 48px | 3rem | Padding vertical de sección pequeña |
| `--space-9` | 64px | 4rem | Padding vertical de sección estándar |
| `--space-10` | 96px | 6rem | Padding vertical de hero/sección grande |

#### Contenedor de layout

```scss
--container-max:      1200px;
--container-padding:  clamp(1rem, 3vw, 2rem);

// Uso:
.container {
  width: min(var(--container-max), calc(100% - var(--container-padding) * 2));
  margin-inline: auto;
}
```

> **Regla:** esta es la **única** definición de `.container` en el proyecto. Las 4 redefiniciones locales detectadas en la auditoría (`pqrsd`, `noticias`, `noticias-detail`, `la-unp`) deben eliminarse.

---

### 1.4 Escala de Border-Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | `4px` | Tags de categoría inline, focus ring offset |
| `--radius-sm` | `8px` | Botones rectangulares, inputs, items de menú |
| `--radius-md` | `12px` | Cards de contenido (noticias, tramites) |
| `--radius-lg` | `18px` | Cards hero, stat-cards, panels destacados |
| `--radius-xl` | `24px` | Secciones con forma de card (quienes-somos) |
| `--radius-pill` | `999px` | Botones pill, badges, filtros, search inputs |
| `--radius-circle` | `50%` | Avatares, iconos circulares |

---

### 1.5 Sombras y Elevación

El sistema usa 4 niveles de elevación. Un nivel más alto implica mayor separación visual del fondo.

| Token | Valor | Nivel | Uso |
|---|---|---|---|
| `--shadow-xs` | `0 1px 3px rgba(0,0,0,0.06)` | 0 — Resting | Inputs en estado normal |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.08)` | 1 — Raised | Cards en reposo |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.12)` | 2 — Floating | Dropdowns, cards en hover |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.16)` | 3 — Overlay | Modales, search results |
| `--shadow-focus` | `0 0 0 3px rgba(51,102,204,0.35)` | Focus | Anillo de foco accesible |

---

### 1.6 Transiciones y Animación

| Token | Valor | Uso |
|---|---|---|
| `--transition-fast` | `150ms cubic-bezier(0.4,0,0.2,1)` | Hover de color, opacidad |
| `--transition-base` | `250ms cubic-bezier(0.4,0,0.2,1)` | Hover de transform, bordes |
| `--transition-smooth` | `350ms cubic-bezier(0.25,0.46,0.45,0.94)` | Apertura de dropdowns, carruseles |
| `--transition-enter` | `400ms cubic-bezier(0,0,0.2,1)` | Entrada de modales, paneles |

> No usar `transition: all` — siempre especificar las propiedades: `transition: transform var(--transition-base), box-shadow var(--transition-base)`.


---

## 2. Componentes Atómicos — Sistema de Botones

### 2.1 Anatomía del Botón

Un botón tiene tres partes opcionales: `[icono-izquierdo]` + `[etiqueta]` + `[icono-derecho]`. Solo la etiqueta es obligatoria.

```html
<!-- Estructura base -->
<button class="btn btn--primary" type="button">
  <span class="material-icons btn__icon btn__icon--left" aria-hidden="true">shield</span>
  <span class="btn__label">Solicitar protección</span>
</button>
```

### 2.2 Variantes

| Variante | Clase | Cuándo usarlo |
|---|---|---|
| **Primary** | `btn--primary` | La acción principal y más importante de la vista. Máximo **uno** por sección. |
| **Secondary** | `btn--secondary` | Acción secundaria o alternativa al primario. |
| **Ghost** | `btn--ghost` | Acción terciaria, opciones de cancelar, links de bajo impacto visual. |
| **Danger** | `btn--danger` | Acciones destructivas (eliminar, revocar). Siempre requiere confirmación. |
| **White** | `btn--white` | Exclusivo para uso sobre fondos de color oscuro/gradiente (héroes azules). |

### 2.3 Tamaños

| Tamaño | Clase | Padding | Font-size | Uso |
|---|---|---|---|---|
| **Large** | `btn--lg` | `1rem 2rem` | `1.05rem` | CTAs de hero |
| **Medium** *(default)* | — | `0.75rem 1.5rem` | `1rem` | Botones estándar en cards y secciones |
| **Small** | `btn--sm` | `0.5rem 1rem` | `0.875rem` | Botones dentro de tablas, listas, badges de acción |

### 2.4 Estados

Cada variante debe implementar los 5 estados siguientes:

| Estado | CSS / clase | Comportamiento visual |
|---|---|---|
| **Default** | *(sin clase adicional)* | Color de fondo y texto estándar de la variante |
| **Hover** | `:hover` | `translateY(-1px)` + sombra `--shadow-md` + ligero cambio de color |
| **Focus** | `:focus-visible` | `outline` removido + `box-shadow: var(--shadow-focus)` (anillo azul) |
| **Active** | `:active` | `translateY(0)` + sombra reducida a `--shadow-xs` |
| **Disabled** | `[disabled]` o `.btn--disabled` | `opacity: 0.45`, `cursor: not-allowed`, sin transform ni shadow en hover |

> ⚠️ **Regla de accesibilidad:** nunca usar `outline: none` sin reemplazarlo por `box-shadow: var(--shadow-focus)`. El focus ring es obligatorio para navegación por teclado (WCAG 2.1 SC 2.4.7).

### 2.5 SCSS de referencia — implementación unificada

```scss
// src/styles/_buttons.scss

.btn {
  // Layout
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  // Tipografía
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  // Geometría
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  // Transición
  transition:
    transform var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-fast),
    border-color var(--transition-fast);
  cursor: pointer;

  // Focus accesible
  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  // Estado active
  &:active {
    transform: translateY(0) !important;
    box-shadow: var(--shadow-xs) !important;
  }

  // Estado disabled
  &:disabled,
  &.btn--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    pointer-events: none;
  }

  // ── Variantes ──────────────────────────────
  &--primary {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border-color: var(--color-primary);

    &:hover:not(:disabled) {
      background: var(--color-primary-dark);
      border-color: var(--color-primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }

  &--secondary {
    background: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);

    &:hover:not(:disabled) {
      background: var(--color-primary-light);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-text-secondary);
    border-color: transparent;

    &:hover:not(:disabled) {
      background: var(--color-surface-subtle);
      color: var(--color-text-primary);
    }
  }

  &--danger {
    background: var(--color-error);
    color: var(--color-text-inverse);
    border-color: var(--color-error);

    &:hover:not(:disabled) {
      background: #b91c1c;
      border-color: #b91c1c;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }

  &--white {
    background: rgba(255,255,255,0.95);
    color: var(--color-primary);
    border-color: transparent;

    &:hover:not(:disabled) {
      background: #ffffff;
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
  }

  // ── Tamaños ─────────────────────────────────
  &--lg {
    padding: 1rem 2rem;
    font-size: var(--type-body-lg);
  }

  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: var(--radius-sm);
  }

  // ── Icono ───────────────────────────────────
  &__icon {
    font-size: 1.1em;
    flex-shrink: 0;

    &--left  { margin-right: calc(var(--space-1) * -0.5); }
    &--right { margin-left:  calc(var(--space-1) * -0.5); }
  }
}
```


---

## 3. Componentes de UI — Catálogo de Referencia

### 3.1 Badges y Tags

Los badges comunican estado o categoría. No son elementos interactivos (si necesitan acción, usar un botón pequeño).

#### Variantes semánticas

| Clase | Color de fondo | Color de texto | Uso |
|---|---|---|---|
| `badge--success` | `--color-success-bg` | `--color-success` | Documento disponible, estado activo |
| `badge--warning` | `--color-warning-bg` | `--color-warning` | Próximamente, pendiente |
| `badge--error` | `--color-error-bg` | `--color-error` | Error, rechazado |
| `badge--info` | `--color-info-bg` | `--color-info` | Informativo, en revisión |
| `badge--neutral` | `--color-surface-subtle` | `--color-text-muted` | Estado neutro, categoría sin semántica |
| `badge--primary` | `--color-primary-light` | `--color-primary` | Destacado, categoría institucional |

```scss
// src/styles/_badges.scss
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-pill);
  font-size: var(--type-tag);
  font-weight: var(--font-weight-extrabold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;

  &--success  { background: var(--color-success-bg);  color: var(--color-success); }
  &--warning  { background: var(--color-warning-bg);  color: var(--color-warning); }
  &--error    { background: var(--color-error-bg);    color: var(--color-error); }
  &--info     { background: var(--color-info-bg);     color: var(--color-info); }
  &--neutral  { background: var(--color-surface-subtle); color: var(--color-text-muted); }
  &--primary  { background: var(--color-primary-light);  color: var(--color-primary); }
}
```

---

### 3.2 Controles de Formulario e Inputs

#### 3.2.1 Anatomía de un campo de formulario

```html
<div class="form-field">
  <label class="form-field__label" for="nombre">
    Nombre completo
    <span class="form-field__required" aria-hidden="true">*</span>
  </label>
  <div class="form-field__control">
    <span class="material-icons form-field__icon" aria-hidden="true">person</span>
    <input
      id="nombre"
      type="text"
      class="form-field__input"
      placeholder="Ej. Juan García"
      aria-describedby="nombre-hint nombre-error"
      required />
  </div>
  <p id="nombre-hint"  class="form-field__hint">Ingrese su nombre como aparece en su documento.</p>
  <p id="nombre-error" class="form-field__error" role="alert" aria-live="polite">
    <!-- Se muestra solo en estado de error -->
  </p>
</div>
```

#### 3.2.2 Input — 5 estados

| Estado | Clase en `.form-field` | Borde | Sombra de focus |
|---|---|---|---|
| **Inactivo** | *(default)* | `--color-border` 1px | — |
| **En foco** | *(`:focus-within` en `.form-field__control`)* | `--color-border-focus` 2px | `--shadow-focus` |
| **Con valor** | `.form-field--filled` | `--color-border-strong` 1px | — |
| **Error** | `.form-field--error` | `--color-error` 2px | `0 0 0 3px rgba(220,53,69,0.25)` |
| **Deshabilitado** | `.form-field--disabled` | `--color-border` 1px, `opacity: 0.5` | — |

#### 3.2.3 SCSS de referencia

```scss
// src/styles/_forms.scss
.form-field {
  display: grid;
  gap: var(--space-2);

  &__label {
    font-size: var(--type-body-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
  }

  &__required { color: var(--color-error); margin-left: var(--space-1); }

  &__control {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--color-surface-base);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);

    &:focus-within {
      border-color: var(--color-border-focus);
      border-width: 2px;
      box-shadow: var(--shadow-focus);
    }
  }

  &__icon {
    position: absolute;
    left: var(--space-4);
    color: var(--color-text-muted);
    font-size: 1.1rem;
    pointer-events: none;
  }

  &__input,
  &__select,
  &__textarea {
    width: 100%;
    padding: var(--space-5) var(--space-4);
    padding-left: calc(var(--space-4) * 2 + 1.1rem); // espacio para icono si existe
    font-family: var(--font-family-base);
    font-size: var(--type-body);
    color: var(--color-text-primary);
    background: transparent;
    border: none;
    outline: none;
    appearance: none;

    &::placeholder { color: var(--color-text-disabled); }
  }

  &__hint {
    font-size: var(--type-caption);
    color: var(--color-text-muted);
    margin: 0;
  }

  &__error {
    font-size: var(--type-caption);
    color: var(--color-error);
    font-weight: var(--font-weight-semibold);
    margin: 0;
    display: none; // oculto por defecto
  }

  // Estado error
  &--error .form-field__control {
    border-color: var(--color-error);
    border-width: 2px;
    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
  }
  &--error .form-field__error { display: block; }
  &--error .form-field__hint  { display: none; }

  // Estado deshabilitado
  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
  &--disabled .form-field__control { background: var(--color-surface-subtle); }
}
```

#### 3.2.4 Select

Usar la misma estructura `.form-field` con el elemento `<select class="form-field__select">`. Añadir un icono de flecha decorativo via CSS `::after` en `.form-field__control` para reemplazar la flecha nativa del sistema operativo.

#### 3.2.5 Checkbox y Toggle

```html
<!-- Checkbox accesible -->
<label class="checkbox">
  <input type="checkbox" class="checkbox__input" />
  <span class="checkbox__indicator" aria-hidden="true"></span>
  <span class="checkbox__label">Acepto los términos y condiciones</span>
</label>

<!-- Toggle / Switch -->
<label class="toggle">
  <input type="checkbox" class="toggle__input" role="switch" />
  <span class="toggle__track" aria-hidden="true">
    <span class="toggle__thumb"></span>
  </span>
  <span class="toggle__label">Activar notificaciones</span>
</label>
```

**Estados del Toggle:**

| Estado | Visual |
|---|---|
| Off / Inactivo | Track: `--color-surface-subtle`; Thumb: `#FFFFFF` |
| On / Activo | Track: `--color-primary`; Thumb: `#FFFFFF` |
| Focus | `box-shadow: var(--shadow-focus)` en el track |
| Disabled | `opacity: 0.45`, `cursor: not-allowed` |


---

### 3.3 Tarjetas, Paneles y Contenedores de Superficie

#### 3.3.1 Estructura de Card

Una card tiene tres zonas opcionales. Solo el `body` es obligatorio.

```html
<article class="card">
  <!-- Header (opcional) -->
  <header class="card__header">
    <span class="badge badge--primary">Categoría</span>
    <h3 class="card__title">Título de la tarjeta</h3>
  </header>

  <!-- Body (obligatorio) -->
  <div class="card__body">
    <p class="card__description">Descripción del contenido de la tarjeta.</p>
  </div>

  <!-- Footer (opcional) -->
  <footer class="card__footer">
    <a routerLink="/ruta" class="btn btn--secondary btn--sm">Ver más</a>
  </footer>
</article>
```

#### 3.3.2 Variantes de Card

| Variante | Clase | `border-radius` | Sombra | Uso |
|---|---|---|---|---|
| **Default** | `card` | `--radius-md` (12px) | `--shadow-sm` | Cards de noticias, trámites, documentos |
| **Hero** | `card card--hero` | `--radius-lg` (18px) | `--shadow-lg` | Card destacada en hero de sección |
| **Stat** | `card card--stat` | `--radius-lg` (18px) | `--shadow-md` | Contadores/estadísticas en héroes |
| **Feature** | `card card--feature` | `--radius-xl` (24px) | `--shadow-md` | Cards de quiénes somos, highlights |
| **Flat** | `card card--flat` | `--radius-xs` (4px) | ninguna, border 1px | Items de lista, filas de tabla |

#### 3.3.3 SCSS de referencia

```scss
// src/styles/_cards.scss
.card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-base), box-shadow var(--transition-base);

  &:hover { // solo si la card es interactiva
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &__header {
    padding: var(--space-6) var(--space-6) 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__title {
    margin: 0;
    font-size: var(--type-heading-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-primary);
    line-height: var(--line-height-snug);
  }

  &__body {
    padding: var(--space-5) var(--space-6);
    flex: 1;
  }

  &__description {
    margin: 0;
    color: var(--color-text-secondary);
    line-height: var(--line-height-normal);
  }

  &__footer {
    padding: var(--space-4) var(--space-6) var(--space-6);
    border-top: 1px solid var(--color-border);
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    align-items: center;
  }

  // Variantes
  &--hero    { border-radius: var(--radius-lg);  box-shadow: var(--shadow-lg); }
  &--stat    { border-radius: var(--radius-lg);  box-shadow: var(--shadow-md); }
  &--feature { border-radius: var(--radius-xl);  box-shadow: var(--shadow-md); }
  &--flat    { border-radius: var(--radius-xs);  box-shadow: none; }
}
```

#### 3.3.4 Reglas de anidación de superficies

Para evitar la saturación visual por capas de cards dentro de cards:

| Nivel | Superficie | Fondo recomendado |
|---|---|---|
| **Nivel 0** — Página | `<body>`, `<main>` | `--color-surface-muted` (#F7F9FC) |
| **Nivel 1** — Sección | `<section>` | `--color-surface-base` (#FFF) o `--color-surface-muted` alterno |
| **Nivel 2** — Card principal | `.card` | `--color-surface-card` (#FFF) + `--shadow-sm` |
| **Nivel 3** — Elemento interno | `.card__body > .inner-box` | `--color-surface-subtle` (#F1F5F9) + border 1px + `--radius-xs` |
| **Nivel 4** — ❌ Prohibido | Otra card dentro de nivel 3 | — Usar lista plana o tabla en su lugar |

> **Regla:** no anidar más de 3 niveles de superficie. Si el diseño lo requiere, la solución correcta es un modal o una vista de detalle nueva, no una card dentro de una card dentro de una card.

---

### 3.4 Elementos de Navegación y Feedback

#### 3.4.1 Breadcrumbs

```html
<nav class="breadcrumb" aria-label="Ruta de navegación">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a routerLink="/" class="breadcrumb__link">Inicio</a>
    </li>
    <li class="breadcrumb__item" aria-hidden="true">
      <span class="material-icons breadcrumb__separator">chevron_right</span>
    </li>
    <li class="breadcrumb__item">
      <a routerLink="/transparencia" class="breadcrumb__link">Transparencia</a>
    </li>
    <li class="breadcrumb__item" aria-hidden="true">
      <span class="material-icons breadcrumb__separator">chevron_right</span>
    </li>
    <li class="breadcrumb__item">
      <span class="breadcrumb__current" aria-current="page">Normativa</span>
    </li>
  </ol>
</nav>
```

**Reglas:**
- Usar `<nav>` con `aria-label` descriptivo.
- El ítem actual lleva `aria-current="page"` y no es un enlace.
- Los separadores son `aria-hidden="true"`.
- Color de links: `--color-text-link`. Color del ítem actual: `--color-text-muted`.

#### 3.4.2 Tabs

```scss
.tabs {
  &__list    { display: flex; border-bottom: 2px solid var(--color-border); gap: var(--space-1); }
  &__trigger {
    padding: var(--space-4) var(--space-5);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-muted);
    border: none; background: none; cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px; // solapar el borde del contenedor
    transition: color var(--transition-fast), border-color var(--transition-fast);

    &:hover { color: var(--color-text-primary); }

    &[aria-selected="true"] {
      color: var(--color-primary);
      border-bottom-color: var(--color-primary);
    }
    &:focus-visible { box-shadow: var(--shadow-focus); outline: none; border-radius: var(--radius-xs); }
  }
  &__panel   { padding: var(--space-7) 0; }
}
```

#### 3.4.3 Tooltips

Los tooltips son informativos, no interactivos. Solo se activan en hover/focus y no contienen elementos clicables.

```html
<span class="tooltip-wrapper">
  <button class="btn btn--ghost btn--sm" aria-describedby="tip-1">
    <span class="material-icons" aria-hidden="true">info</span>
  </button>
  <span id="tip-1" role="tooltip" class="tooltip">
    Este proceso tarda entre 5 y 15 días hábiles.
  </span>
</span>
```

```scss
.tooltip-wrapper { position: relative; display: inline-flex; }
.tooltip {
  position: absolute;
  bottom: calc(100% + var(--space-2));
  left: 50%; transform: translateX(-50%);
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  font-size: var(--type-caption);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-xs);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0; visibility: hidden;
  transition: opacity var(--transition-fast);
  z-index: 100;

  .tooltip-wrapper:hover &,
  .tooltip-wrapper:focus-within & { opacity: 1; visibility: visible; }
}
```

#### 3.4.4 Alertas y Toasts

```html
<!-- Alerta inline (permanente, dentro del flujo) -->
<div class="alert alert--warning" role="alert">
  <span class="material-icons alert__icon" aria-hidden="true">warning</span>
  <div class="alert__content">
    <strong class="alert__title">Atención</strong>
    <p class="alert__message">El plazo de respuesta vence en 3 días hábiles.</p>
  </div>
  <button class="alert__close btn btn--ghost btn--sm" aria-label="Cerrar alerta">
    <span class="material-icons" aria-hidden="true">close</span>
  </button>
</div>
```

```scss
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-radius: var(--radius-sm);
  border: 1px solid transparent;

  &__icon  { flex-shrink: 0; font-size: 1.25rem; margin-top: 2px; }
  &__content { flex: 1; }
  &__title   { display: block; font-weight: var(--font-weight-bold); margin-bottom: var(--space-1); }
  &__message { margin: 0; font-size: var(--type-body-sm); line-height: var(--line-height-normal); }
  &__close   { margin-left: auto; flex-shrink: 0; }

  &--success { background: var(--color-success-bg); border-color: var(--color-success); color: var(--color-success); }
  &--warning { background: var(--color-warning-bg); border-color: var(--color-warning); color: var(--color-warning); }
  &--error   { background: var(--color-error-bg);   border-color: var(--color-error);   color: var(--color-error); }
  &--info    { background: var(--color-info-bg);    border-color: var(--color-info);    color: var(--color-info); }
}
```


---

## 4. Guía de Implementación para Desarrolladores

### 4.1 Estructura de archivos de estilos

La arquitectura de estilos propuesta sigue el patrón **ITCSS** (Inverted Triangle CSS), que garantiza que los estilos de mayor especificidad siempre anulen a los de menor especificidad de forma predecible.

```
src/styles/
├── _tokens.scss        ← Variables CSS (custom properties + SCSS vars)
├── _reset.scss         ← Reset/normalize base
├── _typography.scss    ← Escala tipográfica global, h1–h6, body, links
├── _layout.scss        ← .container, grids de layout, .section
├── _buttons.scss       ← Sistema de botones (.btn)
├── _forms.scss         ← Sistema de formularios (.form-field)
├── _cards.scss         ← Sistema de cards (.card)
├── _badges.scss        ← Badges y tags (.badge)
├── _alerts.scss        ← Alertas y toasts (.alert)
├── _navigation.scss    ← Breadcrumbs, tabs (.breadcrumb, .tabs)
├── _utilities.scss     ← Clases de utilidad mínimas
└── _dark-mode.scss     ← UN SOLO bloque de overrides de dark mode

src/styles.scss         ← Solo @forward / @use de los parciales anteriores
```

**`src/styles.scss` propuesto:**
```scss
// src/styles.scss — archivo de entrada único
@use 'styles/tokens';
@use 'styles/reset';
@use 'styles/typography';
@use 'styles/layout';
@use 'styles/buttons';
@use 'styles/forms';
@use 'styles/cards';
@use 'styles/badges';
@use 'styles/alerts';
@use 'styles/navigation';
@use 'styles/dark-mode';
// Los componentes feature NO importan nada de aquí —
// solo consumen los tokens via var(--...)
```

> Los componentes Angular individuales **no deben** importar `styles.scss`. Solo usan propiedades `var(--token)` en sus SCSS propios. Esto elimina la necesidad de `!important` en dark mode.

---

### 4.2 Configuración de Variables CSS — `:root`

Archivo completo de referencia para `src/styles/_tokens.scss`:

```scss
// src/styles/_tokens.scss
:root {
  // ── COLOR ──────────────────────────────────────────
  --color-primary:        #3366CC;
  --color-primary-dark:   #2851A3;
  --color-primary-light:  #E7F1FF;
  --color-primary-muted:  rgba(51,102,204,0.12);

  --color-accent:         #FF6B35;
  --color-accent-dark:    #E55A2B;
  --color-accent-light:   rgba(255,107,53,0.12);

  --color-text-primary:   #102A43;
  --color-text-secondary: #4B5563;
  --color-text-muted:     #6B7280;
  --color-text-disabled:  #9CA3AF;
  --color-text-inverse:   #FFFFFF;
  --color-text-link:      #3366CC;

  --color-surface-base:   #FFFFFF;
  --color-surface-muted:  #F7F9FC;
  --color-surface-subtle: #F1F5F9;
  --color-surface-card:   #FFFFFF;
  --color-surface-overlay: rgba(0,0,0,0.4);

  --color-border:         #DFE7F3;
  --color-border-strong:  #C4CDD8;
  --color-border-focus:   #3366CC;

  --color-success:        #17633A;
  --color-success-bg:     #E7F7ED;
  --color-warning:        #92400E;
  --color-warning-bg:     #FEF3C7;
  --color-error:          #DC3545;
  --color-error-bg:       #FEE2E2;
  --color-info:           #0057A3;
  --color-info-bg:        #EDF5FF;

  // ── TIPOGRAFÍA ──────────────────────────────────────
  --font-family-base:     'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-weight-normal:   400;
  --font-weight-medium:   500;
  --font-weight-semibold: 600;
  --font-weight-bold:     700;
  --font-weight-extrabold:800;

  --line-height-tight:    1.15;
  --line-height-snug:     1.35;
  --line-height-normal:   1.6;
  --line-height-relaxed:  1.75;

  // ── ESPACIADO ───────────────────────────────────────
  --space-1:  0.25rem;   // 4px
  --space-2:  0.5rem;    // 8px
  --space-3:  0.75rem;   // 12px
  --space-4:  1rem;      // 16px
  --space-5:  1.25rem;   // 20px
  --space-6:  1.5rem;    // 24px
  --space-7:  2rem;      // 32px
  --space-8:  3rem;      // 48px
  --space-9:  4rem;      // 64px
  --space-10: 6rem;      // 96px

  --container-max:     1200px;
  --container-padding: clamp(1rem, 3vw, 2rem);

  // ── GEOMETRÍA ───────────────────────────────────────
  --radius-xs:     4px;
  --radius-sm:     8px;
  --radius-md:     12px;
  --radius-lg:     18px;
  --radius-xl:     24px;
  --radius-pill:   999px;
  --radius-circle: 50%;

  // ── SOMBRAS ─────────────────────────────────────────
  --shadow-xs:    0 1px 3px rgba(0,0,0,0.06);
  --shadow-sm:    0 2px 8px rgba(0,0,0,0.08);
  --shadow-md:    0 4px 16px rgba(0,0,0,0.12);
  --shadow-lg:    0 8px 32px rgba(0,0,0,0.16);
  --shadow-focus: 0 0 0 3px rgba(51,102,204,0.35);

  // ── TRANSICIONES ────────────────────────────────────
  --transition-fast:   150ms cubic-bezier(0.4,0,0.2,1);
  --transition-base:   250ms cubic-bezier(0.4,0,0.2,1);
  --transition-smooth: 350ms cubic-bezier(0.25,0.46,0.45,0.94);
  --transition-enter:  400ms cubic-bezier(0,0,0.2,1);
}

// Dark mode — override de tokens de color únicamente
body.modo_oscuro-govco {
  --color-primary:          #68A1FF;
  --color-primary-dark:     #4A85F0;
  --color-primary-light:    rgba(104,161,255,0.18);
  --color-primary-muted:    rgba(104,161,255,0.12);
  --color-accent:           #FF8B53;
  --color-text-primary:     #F5F7FA;
  --color-text-secondary:   #D4DBE7;
  --color-text-muted:       #8A97AA;
  --color-text-disabled:    #5A6475;
  --color-text-link:        #68A1FF;
  --color-surface-base:     #1B2430;
  --color-surface-muted:    #232D3B;
  --color-surface-subtle:   #293445;
  --color-surface-card:     #232D3B;
  --color-border:           #3B4757;
  --color-border-strong:    #4A5568;
  --color-border-focus:     #68A1FF;
  --shadow-focus:           0 0 0 3px rgba(104,161,255,0.4);
}
```

---

### 4.3 Nomenclatura BEM

Este proyecto usa **BEM estricto** (Block\_\_Element--Modifier).

```
.bloque                   → el componente
.bloque__elemento         → parte interna del componente
.bloque--modificador      → variante o estado del bloque
.bloque__elemento--estado → variante de un elemento específico
```

**Ejemplos correctos:**
```scss
.news-card { }                        // Bloque
.news-card__image { }                 // Elemento
.news-card__title { }                 // Elemento
.news-card--featured { }              // Modificador de bloque
.news-card__title--truncated { }      // Modificador de elemento
```

**Reglas:**
1. El nombre del bloque refleja el componente Angular (`news-card` ↔ `NewsCardComponent`).
2. Los elementos solo existen dentro de su bloque — nunca se usa `.news-card__title` fuera de `.news-card`.
3. Los estados dinámicos de Angular se expresan como modificadores: `[class.news-card--loading]="loading()"`.
4. Clases de utilidad globales (`.sr-only`, `.visually-hidden`) son la **única** excepción a BEM.

---

### 4.4 Convenciones en Angular

#### Consumo de tokens en SCSS de componente

```scss
// ✅ CORRECTO — usa tokens
.pqrsd-page__hero {
  background: linear-gradient(135deg, #0f2c47, #1f4b73); // ← excepción: gradiente único de marca
  padding: var(--space-10) 0;
  color: var(--color-text-inverse);
}

.btn-primary-local {
  background: var(--color-primary); // ← token, no hardcode
  border-radius: var(--radius-pill);
}

// ❌ INCORRECTO — hardcode de color fuera de tokens
.pqrsd-page__hero {
  color: #ffffff;
  padding: 3rem 0 4rem; // ← valor arbitrario fuera de la escala
}
```

#### Binding de clases de estado

```typescript
// ✅ CORRECTO — Angular class binding para estados
@Component({
  template: `
    <div class="form-field"
         [class.form-field--error]="hasError()"
         [class.form-field--disabled]="isDisabled()">
    </div>
  `
})
```

```typescript
// ❌ INCORRECTO — manipulación directa del DOM
document.getElementById('myField').classList.add('error');
```


---

## 5. Reglas de Antipatrones (Lo que NUNCA se debe hacer)

Estas reglas están en vigor para todo el equipo. Su violación debe bloquearse en code review.

---

### ❌ AP-01 — PROHIBIDO usar valores de color hardcodeados en componentes

Ningún componente puede declarar un color directamente. Todo color debe provenir de un token CSS.

```scss
// ❌ MAL — valor hardcodeado
.tramite-card__title { color: #004884; }
.section-card { background: #f7f8fa; }
.btn-local { background: #ff7a1a; }

// ✅ BIEN — token de design system
.tramite-card__title { color: var(--color-text-primary); }
.section-card        { background: var(--color-surface-muted); }
.btn-local           { background: var(--color-primary); }
```

**Excepción única aceptada:** gradientes de héros de marca que no tienen equivalente en la paleta estándar (ej. `linear-gradient(135deg, #0f2c47, #1f4b73)`). Estos deben documentarse en un comentario inline explicando por qué no pueden ser un token.

---

### ❌ AP-02 — PROHIBIDO usar `border-radius` arbitrarios fuera de la escala

Solo se permiten los 7 valores definidos en los tokens. Valores como `10px`, `14px`, `16px`, `20px`, `1.2rem`, `1.75rem` no existen en el sistema.

```scss
// ❌ MAL
.my-card    { border-radius: 10px; }   // no existe en la escala
.my-search  { border-radius: 14px; }   // no existe en la escala
.my-section { border-radius: 1.75rem;} // no existe en la escala

// ✅ BIEN
.my-card    { border-radius: var(--radius-sm);  }  // 8px
.my-search  { border-radius: var(--radius-pill); } // 999px
.my-section { border-radius: var(--radius-xl);  }  // 24px
```

---

### ❌ AP-03 — PROHIBIDO colocar más de un botón primario compitiendo en el mismo viewport

Cada sección o vista debe tener **exactamente un** `btn--primary` visible y dominante. Los demás CTAs deben degradarse a `btn--secondary` o `btn--ghost`.

```html
<!-- ❌ MAL — dos primarios en la misma sección -->
<div class="hero-actions">
  <a class="btn btn--primary">Radicar una PQRSD</a>
  <a class="btn btn--primary">Consultar documento</a>  ← degradar a secondary
</div>

<!-- ✅ BIEN — jerarquía clara -->
<div class="hero-actions">
  <a class="btn btn--primary">Radicar una PQRSD</a>
  <a class="btn btn--secondary">Consultar documento</a>
</div>
```

**Regla extendida:** en un card-grid con múltiples cards, cada card puede tener su propio `btn--primary` ya que cada una es su propio contexto visual aislado. El antipatrón aplica cuando dos primarios compiten *en la misma sección o hero*.

---

### ❌ AP-04 — PROHIBIDO usar márgenes externos (`margin`) en componentes atómicos

Los componentes atómicos (`.btn`, `.badge`, `.card`, `.form-field`) no deben tener `margin` definido en su SCSS. El espaciado entre componentes es responsabilidad del **contenedor de layout**, no del componente.

```scss
// ❌ MAL — el botón se da su propio margen
.btn { margin-top: 24px; } // esto rompe el botón en otros contextos

// ✅ BIEN — el contenedor gestiona el espaciado
.hero-actions {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-7);

  // Los .btn internos no saben nada de este gap
}
```

**Excepción:** `margin-inline: auto` para centrar un componente en un contexto de bloque es aceptable.

---

### ❌ AP-05 — PROHIBIDO eliminar el `outline` de focus sin proveer un reemplazo accesible

El outline de foco es el indicador visual principal para usuarios que navegan con teclado. Eliminarlo sin reemplazarlo viola WCAG 2.1 SC 2.4.7 (Focus Visible).

```scss
// ❌ MAL — elimina el focus sin reemplazo
* { outline: none; }
.btn:focus { outline: 0; }

// ✅ BIEN — reemplaza con focus ring personalizado
.btn:focus-visible {
  outline: none;                    // elimina el feo outline del browser
  box-shadow: var(--shadow-focus);  // reemplaza con ring del design system
}

// ✅ TAMBIÉN BIEN — enfoque en input dentro de contenedor
.form-field__control:focus-within {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}
```

**Nota:** usar `:focus-visible` en lugar de `:focus` para que el ring solo aparezca en navegación por teclado, no al hacer clic con ratón (comportamiento esperado en browsers modernos).

---

### ❌ AP-06 — PROHIBIDO redefinir `.container` en SCSS de componentes

Existe una única definición global de `.container` en `_layout.scss`. Ningún componente puede sobreescribirla o redeclararla.

```scss
// ❌ MAL — redefinición local que rompe la consistencia
// pqrsd.component.scss
.container {
  width: min(1180px, calc(100% - 2rem)); // ← diferente al estándar
}

// ✅ BIEN — usar el .container global y, si se necesita estrechar, envolver:
.pqrsd-page__content {
  max-width: 960px;     // restricción específica de la página
  margin-inline: auto;  // dentro del .container estándar
}
```

---

### ❌ AP-07 — PROHIBIDO dejar `console.log` en código de producción

Todo `console.log`, `console.warn` o `console.error` debe eliminarse antes de hacer merge a `main`. Para logging condicional en desarrollo:

```typescript
// ✅ BIEN — solo en desarrollo
import { isDevMode } from '@angular/core';

if (isDevMode()) {
  console.log('Debug info:', data);
}
```

Configurar la siguiente regla en `.eslintrc`:
```json
{ "no-console": ["error", { "allow": ["warn", "error"] }] }
```

---

### ❌ AP-08 — PROHIBIDO usar `!important` en SCSS de componentes

El uso de `!important` es señal de un problema de especificidad. La única excepción permitida es en `_dark-mode.scss` para overrides que compiten con estilos de librerías externas que no se pueden controlar.

```scss
// ❌ MAL — especificidad parchada con !important
.news-card__title { color: var(--color-text-primary) !important; }

// ✅ BIEN — estructura BEM correcta evita colisiones
.news-card .news-card__title { color: var(--color-text-primary); }
// o simplemente:
.news-card__title { color: var(--color-text-primary); }
```

---

### ❌ AP-09 — PROHIBIDO crear `setInterval` o `setInterval` sin limpiarlos en `ngOnDestroy`

```typescript
// ❌ MAL — memory leak garantizado
ngAfterViewInit(): void {
  setInterval(() => this.nextSlide(), 5000);
}

// ✅ BIEN — ciclo de vida completo
private timer: ReturnType<typeof setInterval> | null = null;

ngAfterViewInit(): void {
  this.timer = setInterval(() => this.nextSlide(), 5000);
}

ngOnDestroy(): void {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
}
```

---

### ❌ AP-10 — PROHIBIDO mezclar estilos inline en templates Angular

Los estilos visuales deben vivir en el SCSS del componente, no en atributos `style=""` del template.

```html
<!-- ❌ MAL — estilos en template que escapan al dark mode y SCSS -->
<div [style.background-image]="'url(' + img + ')'"
     style="background-size: cover; display: flex; position: relative;">

<!-- ✅ BIEN — clase CSS con el background gestionado en SCSS -->
<div class="info-card__image"
     [style.--card-image]="'url(' + img + ')'">
```

```scss
// info-card__image en el SCSS del componente
.info-card__image {
  background-image: var(--card-image);
  background-size: cover;
  background-position: center;
  display: flex;
  position: relative;
}
```

La técnica de CSS custom property inline (`--card-image`) permite pasar la URL dinámica sin mezclar estilos en el template.

---

*Design System UNP v1.0.0 — Documento vivo. Actualizar ante cualquier adición de componentes nuevos al proyecto.*  
*Referencia cruzada: `AUDIT_PERFORMANCE_UIUX.md` — hallazgos que originaron estas reglas.*
