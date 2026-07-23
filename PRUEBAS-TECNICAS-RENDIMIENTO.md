# Pruebas Técnicas y de Rendimiento — Sitio Web UNP

**Proyecto:** Unidad Nacional de Protección — Migración Angular v17+  
**Framework:** Angular 17 | Karma + Jasmine | Webpack Bundle Analyzer  
**Fecha de elaboración:** Julio 2026  
**Responsable:** Equipo de Desarrollo y QA

---

## Tabla de Contenidos

1. [Objetivo](#objetivo)
2. [Alcance](#alcance)
3. [Entorno de Pruebas](#entorno-de-pruebas)
4. [Pruebas Unitarias](#pruebas-unitarias)
5. [Pruebas de Integración](#pruebas-de-integración)
6. [Pruebas de Rendimiento](#pruebas-de-rendimiento)
7. [Pruebas de Accesibilidad](#pruebas-de-accesibilidad)
8. [Pruebas de Seguridad](#pruebas-de-seguridad)
9. [Registro de Incidencias](#registro-de-incidencias)
10. [Ajustes Propuestos](#ajustes-propuestos)
11. [Métricas Objetivo](#métricas-objetivo)
12. [Checklist de Verificación Final](#checklist-de-verificación-final)

---

## Objetivo

Validar el correcto funcionamiento técnico, la estabilidad y el rendimiento del sitio web de la Unidad Nacional de Protección (UNP), identificando incidencias y proponiendo ajustes que garanticen una experiencia de usuario óptima y el cumplimiento de estándares institucionales.

---

## Alcance

Las pruebas cubren las siguientes rutas y módulos de la aplicación:

| Ruta | Componente | Tipo |
|------|-----------|------|
| `/` | `HomeComponent` | Página principal |
| `/la-unp` | `LaUnpComponent` | Información institucional |
| `/quienes-somos` | `QuienesSomosComponent` | Identidad institucional |
| `/linea-vida-103` | `LineaVida103Component` | Servicio de emergencia |
| `/transparencia` | `TransparenciaComponent` | Transparencia |
| `/normativa` | `NormativaComponent` | Marco normativo |
| `/atencion-servicios/tramites` | `TramitesServiciosComponent` | Trámites y servicios |
| `/pqrsd` | `PqrsdComponent` | PQRSD |
| `/noticias` | `NoticiasComponent` | Listado de noticias |
| `/noticias/:slug` | `NoticiasDetailComponent` | Detalle de noticia |
| `/admin` | `AdminDashboardComponent` | Panel admin (protegido) |
| `/admin/noticias` | `AdminNewsPanelComponent` | Gestión de noticias (protegido) |

**Servicios evaluados:** `DataService`, `SearchService`, `PqrsdService`, `AdminNewsService`, `SecurityService`, `UploadService`, `ErrorHandlerService`, `LoggerService`

**Guards evaluados:** `AuthGuard`, `AdminGuard`

**Interceptores evaluados:** `CsrfInterceptor`, `SecurityInterceptor`

---

## Entorno de Pruebas

### Configuración de Herramientas

```bash
# Ejecutar suite de pruebas unitarias (modo único)
npm test -- --watch=false

# Ejecutar pruebas con cobertura
ng test --code-coverage

# Build de producción para pruebas de rendimiento
npm run build:production

# Analizar bundle
npm run analyze
```

### Requisitos del Entorno

| Elemento | Versión requerida |
|---------|------------------|
| Node.js | >= 18.0.0 < 21.0.0 |
| npm | >= 9.0.0 |
| Angular CLI | ^17.0.0 |
| Chrome (Karma) | Última versión estable |
| TypeScript | ~5.2.0 |

### Navegadores de Prueba

| Navegador | Versión | Resultado esperado |
|-----------|---------|-------------------|
| Chrome | Última estable | ✅ Funcional completo |
| Firefox | Última estable | ✅ Funcional completo |
| Edge | Última estable | ✅ Funcional completo |
| Safari (macOS/iOS) | Última estable | ✅ Funcional completo |
| Chrome Mobile (Android) | Última estable | ✅ Responsive |

---

## Pruebas Unitarias

Las pruebas unitarias usan **Karma + Jasmine**, configurado en `angular.json` bajo el builder `@angular-devkit/build-angular:karma`.

### 1. AppComponent

```typescript
describe('AppComponent', () => {
  it('debe crear el componente raíz', () => {
    expect(component).toBeTruthy();
  });

  it('debe actualizar el título de la página al navegar', () => {
    // Simular NavigationEnd hacia /la-unp
    expect(titleService.getTitle()).toContain('La UNP');
  });

  it('debe limpiar las subscriptions al destruirse (no memory leaks)', () => {
    spyOn(routerSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(routerSubscription.unsubscribe).toHaveBeenCalled();
  });
});
```

**Resultado esperado:** 3/3 pruebas en verde ✅

---

### 2. HeroComponent (Carrusel)

```typescript
describe('HeroComponent', () => {
  it('debe inicializar con el slide 0', () => {
    expect(component.currentSlide()).toBe(0);
  });

  it('nextSlide() debe avanzar al siguiente slide', () => {
    component.nextSlide();
    expect(component.currentSlide()).toBe(1);
  });

  it('prevSlide() desde el slide 0 debe ir al último slide', () => {
    component.prevSlide();
    const lastIndex = component.slides().length - 1;
    expect(component.currentSlide()).toBe(lastIndex);
  });

  it('debe limpiar el interval de auto-rotación al destruirse', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalled();
  });
});
```

**Resultado esperado:** 4/4 pruebas en verde ✅

---

### 3. DataService

```typescript
describe('DataService', () => {
  it('getNoticias() debe retornar un array de noticias', (done) => {
    service.getNoticias().subscribe(noticias => {
      expect(noticias.length).toBeGreaterThan(0);
      expect(noticias[0].id).toBeDefined();
      done();
    });
  });

  it('debe manejar errores HTTP retornando un array vacío', (done) => {
    httpMock.expectOne('/api/noticias').flush(null, { status: 500, statusText: 'Server Error' });
    service.getNoticias().subscribe(result => {
      expect(result).toEqual([]);
      done();
    });
  });
});
```

**Resultado esperado:** 2/2 pruebas en verde ✅

---

### 4. AuthGuard y AdminGuard

```typescript
describe('AuthGuard', () => {
  it('debe bloquear el acceso si el usuario no está autenticado', () => {
    authService.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
  });

  it('debe redirigir al login cuando no hay sesión', () => {
    authService.isAuthenticated.and.returnValue(false);
    guard.canActivate();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe permitir acceso cuando el usuario está autenticado', () => {
    authService.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });
});
```

**Resultado esperado:** 3/3 pruebas en verde ✅

---

### 5. PqrsdService

```typescript
describe('PqrsdService', () => {
  it('enviarPqrsd() debe aceptar una solicitud válida', (done) => {
    const pqrsd = { tipo: 'Petición', descripcion: 'Test', nombre: 'Usuario Test' };
    service.enviarPqrsd(pqrsd).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });
  });

  it('debe validar campos obligatorios antes de enviar', () => {
    expect(() => service.enviarPqrsd({})).toThrow();
  });
});
```

**Resultado esperado:** 2/2 pruebas en verde ✅

---

### 6. SecurityInterceptor y CsrfInterceptor

```typescript
describe('SecurityInterceptor', () => {
  it('debe agregar headers de seguridad en cada petición', () => {
    const req = new HttpRequest('GET', '/api/data');
    interceptor.intercept(req, handlerSpy);
    const capturedReq = handlerSpy.handle.calls.mostRecent().args[0];
    expect(capturedReq.headers.has('X-Requested-With')).toBeTrue();
  });
});

describe('CsrfInterceptor', () => {
  it('debe incluir el token CSRF en peticiones POST', () => {
    const req = new HttpRequest('POST', '/api/pqrsd', {});
    interceptor.intercept(req, handlerSpy);
    const capturedReq = handlerSpy.handle.calls.mostRecent().args[0];
    expect(capturedReq.headers.has('X-CSRF-Token')).toBeTrue();
  });
});
```

**Resultado esperado:** 2/2 pruebas en verde ✅

---

### Resumen de Pruebas Unitarias

| Suite | Pruebas | Esperadas ✅ | Fallidas ❌ |
|-------|---------|------------|-----------|
| AppComponent | 3 | 3 | 0 |
| HeroComponent | 4 | 4 | 0 |
| DataService | 2 | 2 | 0 |
| AuthGuard / AdminGuard | 3 | 3 | 0 |
| PqrsdService | 2 | 2 | 0 |
| Interceptores | 2 | 2 | 0 |
| **Total** | **16** | **16** | **0** |

---

## Pruebas de Integración

Verifican la interacción entre componentes, servicios y el router.

### 1. Navegación entre rutas (Router)

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| INT-01 | Navegar a `/` | Carga `HomeComponent`, título "Inicio - UNP" |
| INT-02 | Navegar a `/noticias` | Carga `NoticiasComponent`, lista de noticias visible |
| INT-03 | Navegar a `/noticias/slug-prueba` | Carga `NoticiasDetailComponent` con datos del slug |
| INT-04 | Navegar a `/admin` sin sesión | Redirige, no carga `AdminDashboardComponent` |
| INT-05 | Navegar a `/admin` con sesión válida | Carga `AdminDashboardComponent` correctamente |
| INT-06 | Navegar a ruta inexistente `/xyz` | Redirige a `/` sin error 404 en consola |
| INT-07 | Navegar a `/atencion-servicios/pqrsd` | Redirige a `/pqrsd` (alias configurado) |

---

### 2. Formulario PQRSD

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| INT-08 | Enviar formulario vacío | Muestra errores de validación en todos los campos requeridos |
| INT-09 | Enviar formulario con datos válidos | Muestra confirmación de envío exitoso |
| INT-10 | Enviar con email mal formado | Bloquea envío, muestra error de formato |
| INT-11 | Adjuntar archivo no permitido | Muestra mensaje de tipo de archivo inválido |
| INT-12 | Adjuntar archivo > límite de peso | Muestra mensaje de tamaño excedido |

---

### 3. Búsqueda Global

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| INT-13 | Buscar término existente en noticias | Muestra resultados relevantes |
| INT-14 | Buscar término inexistente | Muestra mensaje "Sin resultados" |
| INT-15 | Buscar con caracteres especiales | No rompe la aplicación, resultados vacíos o filtrados |
| INT-16 | Limpiar campo de búsqueda | Restaura listado completo |

---

## Pruebas de Rendimiento

### 1. Bundle Size (Webpack Bundle Analyzer)

Ejecutar con:

```bash
npm run analyze
```

| Métrica | Objetivo | Alerta | Error |
|---------|---------|--------|-------|
| Bundle inicial (gzipped) | < 500 KB | 500 KB – 2 MB | > 2 MB |
| Chunk de cualquier componente (CSS) | < 6 KB | 6 KB – 10 KB | > 10 KB |
| Chunks lazy (por ruta) | < 150 KB | 150 KB – 500 KB | > 500 KB |

> Los budgets están configurados en `angular.json` bajo `configurations.production.budgets`.

---

### 2. Core Web Vitals (Lighthouse / Chrome DevTools)

Ejecutar en Chrome DevTools → Lighthouse → modo "Navigation" sobre build de producción (`dist/web-unp`).

| Métrica | Objetivo ✅ | Alerta ⚠️ | Crítico ❌ |
|---------|------------|----------|----------|
| **LCP** (Largest Contentful Paint) | ≤ 1.5 s | 1.5 – 2.5 s | > 2.5 s |
| **FID** (First Input Delay) | ≤ 100 ms | 100 – 300 ms | > 300 ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |
| **FCP** (First Contentful Paint) | ≤ 1.0 s | 1.0 – 1.8 s | > 1.8 s |
| **TTI** (Time to Interactive) | ≤ 2.5 s | 2.5 – 5.0 s | > 5.0 s |
| **Lighthouse Performance Score** | ≥ 90 | 75 – 89 | < 75 |

---

### 3. Lazy Loading de Rutas

Verificar en Chrome DevTools → Network → tab "JS" que los chunks se cargan bajo demanda:

| Ruta navegada | Chunk esperado | Carga en primera visita | Carga en revisita |
|--------------|----------------|------------------------|------------------|
| `/` | `home-component.js` | ✅ Descargado | ✅ Desde caché |
| `/noticias` | `noticias-component.js` | ✅ Descargado | ✅ Desde caché |
| `/pqrsd` | `pqrsd-component.js` | ✅ Descargado | ✅ Desde caché |
| `/admin` | `admin-dashboard-component.js` | ✅ Solo si autenticado | ✅ Desde caché |

---

### 4. Tiempos de Carga de Imágenes

| Imagen | Tamaño máximo esperado | Atributo `loading` |
|--------|----------------------|-------------------|
| `carousel-1.jpg` | < 300 KB | `eager` (above the fold) |
| `carousel-2.png` | < 300 KB | `eager` |
| `hero-pqrsd.jpg` | < 200 KB | `lazy` |
| `unp-institution.jpg` | < 200 KB | `lazy` |
| SVGs (logos/iconos) | < 20 KB | N/A |

---

### 5. Comportamiento Bajo Conexión Lenta

Simular en Chrome DevTools → Network → "Slow 3G":

| Escenario | Resultado esperado |
|-----------|-------------------|
| Carga inicial de `/` | Esqueleto visible en < 3 s, contenido completo en < 8 s |
| Navegación a `/noticias` | Indicador de carga visible, no pantalla en blanco |
| Envío del formulario PQRSD | Botón deshabilitado durante envío, sin doble submit |
| Carga de imagen de noticia | Placeholder visible mientras carga |

---

## Pruebas de Accesibilidad

### 1. Automatizadas (axe-core / Lighthouse)

Ejecutar Lighthouse con categoría "Accessibility":

| Criterio | Puntaje objetivo |
|---------|-----------------|
| Lighthouse Accessibility Score | ≥ 95 |
| Contrastes de color (WCAG AA 4.5:1) | 100% de elementos verificados |
| Imágenes con `alt` descriptivo | 100% |
| Etiquetas `aria-label` en controles interactivos | 100% |
| Estructura de encabezados (`h1`→`h2`→`h3`) | Sin saltos |

---

### 2. Navegación por Teclado

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| ACCX-01 | Tab desde el inicio de la página | Foco visible en todos los elementos interactivos en orden lógico |
| ACCX-02 | Enter / Space sobre botones del carrusel | Avanza / retrocede slide |
| ACCX-03 | Tab en menú de navegación | Recorre todos los ítems y submenús |
| ACCX-04 | Escape en menú móvil abierto | Cierra el menú |
| ACCX-05 | Tab en formulario PQRSD | Recorre campos en orden correcto |

---

### 3. Barra de Accesibilidad (`AccessibilityBarComponent`)

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| ACCX-06 | Clic en "Aumentar fuente" | Tamaño de fuente aumenta en todos los textos |
| ACCX-07 | Clic en "Disminuir fuente" | Tamaño de fuente disminuye |
| ACCX-08 | Activar alto contraste | Paleta de colores cambia a alto contraste |
| ACCX-09 | Desactivar alto contraste | Paleta original restaurada |

---

## Pruebas de Seguridad

### 1. Protección de Rutas Administrativas

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| SEC-01 | Acceder a `/admin` sin sesión | Redirige, no expone ningún dato |
| SEC-02 | Manipular token de sesión expirado | Cierra sesión y redirige |
| SEC-03 | Acceder a `/admin/noticias` como usuario sin rol admin | Deniega acceso |

---

### 2. Sanitización y XSS

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| SEC-04 | Ingresar `<script>alert('xss')</script>` en campo PQRSD | Angular sanitiza; no se ejecuta el script |
| SEC-05 | Ingresar HTML en campo de búsqueda | Texto tratado como string, no renderizado como HTML |
| SEC-06 | Contenido de noticia con HTML externo | Renderizado vía `SafeHtml` o `DomPurify`, sin scripts activos |

---

### 3. Interceptores HTTP

| Prueba | Acción | Resultado esperado |
|--------|--------|-------------------|
| SEC-07 | Petición POST al API PQRSD | Header `X-CSRF-Token` presente |
| SEC-08 | Cualquier petición HTTP | Header `X-Requested-With` presente |
| SEC-09 | Respuesta 401 del servidor | `SecurityInterceptor` gestiona el error, no expone detalles sensibles |

---

## Registro de Incidencias

Usar la siguiente tabla para documentar cada incidencia encontrada durante las pruebas.

| ID | Módulo | Descripción | Severidad | Estado | Ajuste propuesto |
|----|--------|-------------|-----------|--------|-----------------|
| INC-001 | — | — | — | Abierto | — |

### Niveles de Severidad

| Nivel | Descripción |
|-------|-------------|
| 🔴 **Crítica** | Bloquea funcionalidad principal o expone vulnerabilidad de seguridad |
| 🟠 **Alta** | Afecta una funcionalidad importante pero tiene workaround |
| 🟡 **Media** | Degradación de experiencia de usuario no bloqueante |
| 🟢 **Baja** | Problema cosmético o de detalle menor |

---

## Ajustes Propuestos

Los siguientes ajustes se proponen de forma preventiva basándose en el análisis del código fuente y la arquitectura actual.

### AJ-01 — Agregar indicadores de carga en rutas lazy

**Área:** Router / UX  
**Descripción:** Al navegar entre rutas con lazy loading, la aplicación puede mostrar una pantalla en blanco brevemente mientras se descarga el chunk. Implementar un `RouterPreloadingStrategy` o un spinner global mejora la percepción de velocidad.

```typescript
// app.config.ts
import { PreloadAllModules } from '@angular/router';

provideRouter(routes, withPreloading(PreloadAllModules))
```

**Impacto esperado:** Reducción del tiempo percibido de navegación en conexiones lentas.

---

### AJ-02 — Añadir `loading="lazy"` en imágenes below-the-fold

**Área:** Rendimiento / Imágenes  
**Descripción:** Las imágenes de secciones que no son visibles en la carga inicial (`hero-pqrsd.jpg`, `unp-institution.jpg`, `normativity-documents.jpg`) deben tener el atributo `loading="lazy"` para diferir su descarga.

```html
<img src="assets/images/unp-institution.jpg" 
     alt="Sede institucional UNP" 
     loading="lazy" 
     width="800" height="450">
```

**Impacto esperado:** Mejora del LCP y reducción del peso en la carga inicial.

---

### AJ-03 — Ampliar cobertura de pruebas unitarias

**Área:** Testing  
**Descripción:** Los servicios `SearchService`, `UploadService` y `AdminNewsService` carecen de pruebas unitarias documentadas. Se recomienda agregar al menos casos básicos de éxito y error.

**Meta:** Cobertura de código > 80% en servicios críticos.

```bash
# Ver reporte de cobertura actual
ng test --code-coverage
# Resultado en: coverage/web-unp/index.html
```

---

### AJ-04 — Manejo de error 404 con componente dedicado

**Área:** Router / UX  
**Descripción:** La ruta wildcard `**` redirige silenciosamente a `/`. Se sugiere crear un componente `NotFoundComponent` que informe al usuario y ofrezca navegación hacia secciones principales, antes de redirigir automáticamente.

```typescript
{
  path: '**',
  loadComponent: () => import('./features/not-found/not-found.component')
    .then(m => m.NotFoundComponent),
  title: 'Página no encontrada - UNP'
}
```

---

### AJ-05 — Agregar `width` y `height` explícitos en imágenes del carrusel

**Área:** Rendimiento / CLS  
**Descripción:** Las imágenes del carrusel (`carousel-1.jpg`, `carousel-2.png`, `carousel-3.jpg`) sin dimensiones explícitas pueden causar *layout shift* mientras cargan, impactando la métrica CLS.

```html
<img [src]="slide.imagen" 
     [alt]="slide.titulo" 
     width="1440" 
     height="600"
     loading="eager">
```

**Impacto esperado:** Reducción del CLS por debajo de 0.1.

---

### AJ-06 — Registrar errores no controlados con `ErrorHandlerService`

**Área:** Estabilidad / Monitoreo  
**Descripción:** Conectar `ErrorHandlerService` como provider global de Angular (`ErrorHandler`) asegura que cualquier excepción no capturada quede registrada con contexto suficiente para depuración.

```typescript
// app.config.ts
import { ErrorHandler } from '@angular/core';
import { ErrorHandlerService } from './core/services/error-handler.service';

providers: [
  { provide: ErrorHandler, useClass: ErrorHandlerService }
]
```

---

## Métricas Objetivo

| Categoría | Métrica | Objetivo |
|-----------|---------|---------|
| Rendimiento | Lighthouse Performance | ≥ 90 |
| Accesibilidad | Lighthouse Accessibility | ≥ 95 |
| SEO | Lighthouse SEO | ≥ 90 |
| Buenas prácticas | Lighthouse Best Practices | ≥ 90 |
| Bundle | Tamaño inicial gzipped | < 500 KB |
| Cobertura | Pruebas unitarias (líneas) | > 80% |
| Carga | LCP | ≤ 1.5 s |
| Estabilidad | CLS | ≤ 0.1 |
| Interactividad | FID / INP | ≤ 100 ms |

---

## Checklist de Verificación Final

### Antes de despliegue a producción

- [ ] `npm run build:production` finaliza sin errores ni advertencias de budget
- [ ] Todos los tests unitarios pasan (`npm test -- --watch=false`)
- [ ] Cobertura de código > 80%
- [ ] Lighthouse Performance ≥ 90 sobre build de producción
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Sin errores en consola del navegador en ninguna ruta
- [ ] Formulario PQRSD valida y envía correctamente
- [ ] Rutas protegidas (`/admin`, `/admin/noticias`) bloquean acceso sin autenticación
- [ ] Lazy loading verificado en Network tab (chunks cargados bajo demanda)
- [ ] Imágenes del carrusel cargan correctamente en mobile y desktop
- [ ] Barra de accesibilidad funciona (fuente, contraste)
- [ ] Navegación completa posible solo con teclado
- [ ] Sin vulnerabilidades XSS en campos de texto libre
- [ ] Headers de seguridad presentes en peticiones HTTP

---

*Documento generado en el contexto de la migración Angular v17+ del sitio web institucional de la Unidad Nacional de Protección (UNP). Para consultar la arquitectura base, ver [DOCUMENTACION-TECNICA.md](./DOCUMENTACION-TECNICA.md).*
