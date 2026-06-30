import { Component, signal, computed, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.Emulated (default)
  template: `
<header class="header">
    <div class="container">
        <div class="header__content">
            <!-- Fila superior: Logo y buscador centrados -->
            <div class="header__top-row">
                <!-- Botón de menú móvil -->
                <button class="header__mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Abrir menú">
                    <i class="material-icons">menu</i>
                </button>
                
                <div class="header__brand header__brand--centered">
                    <a [routerLink]="'/'" class="header__logo-link" aria-label="Ir a la página de inicio">
                        <div class="header__logo header__logo--large">
                            <img src="assets/images/unp-logo.svg" alt="Logo Unidad Nacional de Protección" class="header__logo-img">
                        </div>
                    </a>
                </div>
                
                <!-- Buscador centrado -->
                <div class="header__search-wrapper">
                    <div class="header__search-container">
                        <i class="material-icons header__search-icon">search</i>
                        <input type="search" 
                               class="header__search-input" 
                               placeholder="Buscar en UNP..."
                               aria-label="Buscar"
                               [(ngModel)]="searchQuery"
                               (input)="handleSearch()"
                               (focus)="showSearchResults.set(true)"
                               (blur)="hideSearchResults()">
                        
                        <!-- Lista de resultados de búsqueda -->
                        <div class="header__search-results" 
                             *ngIf="showSearchResults() && searchResults().length > 0">
                            <ul class="header__search-list">
                                <li class="header__search-item" 
                                    *ngFor="let result of searchResults(); trackBy: trackByIndex"
                                    (click)="selectSearchResult(result)">
                                    <div class="header__search-item-content">
                                        <i class="material-icons header__search-item-icon">{{ result.icon }}</i>
                                        <div class="header__search-item-text">
                                            <span class="header__search-item-title">{{ result.title }}</span>
                                            <span class="header__search-item-description">{{ result.description }}</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Fila inferior: Menú de navegación -->
            <nav class="header__nav" role="navigation" aria-label="Menú principal">
                <ul class="header__nav-list">
                    <li class="header__nav-item" 
                        *ngFor="let item of menuItems(); trackBy: trackByIndex; let i = index"
                        [ngClass]="{ 
                            'header__nav-item--has-submenu': item.submenu.length > 0,
                            'header__nav-item--active': item.activo,
                            'header__nav-item--dropdown-open': activeMenu() === i
                        }"
                        (mouseenter)="handleMouseEnter(i)"
                        (mouseleave)="handleMouseLeave(i)">
                        
                        <a [routerLink]="item.enlace" 
                           class="header__nav-link" 
                           [ngClass]="{ 
                               'header__nav-link--active': item.activo,
                               'header__nav-link--dropdown-open': activeMenu() === i
                           }"
                           (click)="item.submenu.length > 0 && handleClick(i, $event)"
                                                      [attr.aria-current]="item.activo ? 'page' : undefined"
                           [attr.aria-haspopup]="item.submenu.length > 0 ? 'true' : 'false'"
                           [attr.aria-expanded]="isSubmenuOpen(i)">
                            <span class="header__nav-text">{{ item.nombre }}</span>
                            <span *ngIf="item.submenu.length > 0" class="header__nav-arrow material-icons">expand_more</span>
                        </a>
                        
                        <!-- Submenú desplegable -->
                        <div class="header__dropdown" 
                             *ngIf="item.submenu.length > 0 && isSubmenuOpen(i)"
                             (mouseenter)="handleMouseEnter(i)"
                             (mouseleave)="handleMouseLeave(i)">
                            <div class="header__dropdown-content">
                                <ul class="header__dropdown-list">
                                    <li class="header__dropdown-item" *ngFor="let subitem of item.submenu">
                                        <a [routerLink]="subitem.enlace" 
                                           class="header__dropdown-link">
                                            <span class="header__dropdown-text">{{ subitem.nombre }}</span>
                                            <i class="material-icons header__dropdown-icon">arrow_forward</i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
            
            <!-- Navegación móvil -->
            <div class="header__mobile-nav" *ngIf="mobileMenuOpen()">
                <div class="header__mobile-nav-content">
                    <div class="header__mobile-nav-header">
                        <h2 class="header__mobile-nav-title">Menú</h2>
                        <button class="header__mobile-nav-close" (click)="toggleMobileMenu()" aria-label="Cerrar menú">
                            <i class="material-icons">close</i>
                        </button>
                    </div>
                    <ul class="header__mobile-nav-list">
                        <li class="header__mobile-nav-item" *ngFor="let item of menuItems(); trackBy: trackByIndex">
                            <a [routerLink]="item.enlace" 
                               class="header__mobile-nav-link"
                               (click)="closeMobileMenu()">
                                {{ item.nombre }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</header>
  `
})
export class HeaderComponent {
    private router = inject(Router);
    
    // Estado del menú
    activeMenu = signal<number | null>(null);
    openSubmenus = signal<Record<number, boolean>>({});
    
    // Estado de búsqueda
    searchQuery = signal('');
    searchResults = signal<any[]>([]);
    showSearchResults = signal(false);
    
    // Estado del menú móvil
    mobileMenuOpen = signal(false);
    
    // Estado de navegación avanzada
    hoveredMenu = signal<number | null>(null);
    isHoveringDropdown = signal(false);
    dropdownTimeouts = signal<Record<string, any>>({});
    
    // Variables de configuración
    private readonly HOVER_DELAY = 150;
    private readonly HIDE_DELAY = 200;
    
    // Base de datos de búsqueda
    private searchDatabase = [
        { title: 'PQRSD', description: 'Presenta tus solicitudes', icon: 'send', url: 'pqrsd.html' },
        { title: 'La UNP', description: 'Conoce nuestra institución', icon: 'account_balance', url: 'index.html#la-unp' },
        { title: 'Transparencia', description: 'Accede a información pública', icon: 'visibility', url: 'index.html#transparencia' },
        { title: 'Normativa', description: 'Consulta el marco legal', icon: 'gavel', url: 'index.html#normativa' },
        { title: 'Director', description: 'Información del director', icon: 'person', url: 'index.html#director' },
        { title: '¿Quiénes somos?', description: 'Misión y visión', icon: 'help_outline', url: 'index.html#quienes-somos' },
        { title: '¿Qué hacemos?', description: 'Nuestras funciones', icon: 'work', url: 'index.html#que-hacemos' },
        { title: 'Sede Principal', description: 'Ubicación y contacto', icon: 'location_on', url: 'index.html#sede-principal' },
        { title: 'Sedes Regionales', description: 'Oficinas en el país', icon: 'location_city', url: 'index.html#sedes-regionales' },
        { title: 'Noticias', description: 'Últimas novedades', icon: 'article', url: 'index.html#noticias' },
        { title: 'Contratación', description: 'Procesos de contratación', icon: 'description', url: 'index.html#contratacion' },
        { title: 'Convocatorias', description: 'Oportunidades laborales', icon: 'work_outline', url: 'index.html#convocatorias' },
        { title: 'Trámites', description: 'Servicios y trámites', icon: 'assignment', url: 'index.html#tramites' },
        { title: 'Servicios', description: 'Oferta de servicios', icon: 'miscellaneous_services', url: 'index.html#servicios' },
        { title: 'Contacto', description: 'Información de contacto', icon: 'phone', url: 'index.html#contacto' },
        { title: 'Petición', description: 'Solicita información', icon: 'search', url: 'pqrsd.html#peticion' },
        { title: 'Queja', description: 'Reporta conductas', icon: 'warning', url: 'pqrsd.html#queja' },
        { title: 'Reclamo', description: 'Solicita soluciones', icon: 'report_problem', url: 'pqrsd.html#reclamo' },
        { title: 'Sugerencia', description: 'Envía propuestas', icon: 'lightbulb', url: 'pqrsd.html#sugerencia' },
        { title: 'Denuncia', description: 'Reporta irregularidades', icon: 'gavel', url: 'pqrsd.html#denuncia' }
    ];
    
    // Datos del menú de navegación principal - Estructura UNP.gov.co
    menuItems = signal([
        {
            nombre: 'Inicio',
            enlace: '/',
            activo: true,
            submenu: []
        },
        {
            nombre: 'La UNP',
            enlace: '#/la-unp',
            activo: false,
            submenu: [
                { nombre: 'El director', enlace: '#/la-unp/el-director' },
                { nombre: '¿Quiénes somos?', enlace: '#/la-unp/quienes-somos' },
                { nombre: '¿Qué Hacemos?', enlace: '#/la-unp/que-hacemos' },
                { nombre: '¿Cómo lo hacemos?', enlace: '#/la-unp/como-lo-hacemos' },
                { nombre: 'Organigrama', enlace: '#/la-unp/organigrama' },
                { nombre: 'Símbolos', enlace: '#/la-unp/simbolos' },
                { nombre: 'Gestión Humana', enlace: '#/la-unp/gestion-humana' },
                { nombre: 'Sistema de Gestión Integrada (SGI)', enlace: '#/la-unp/sgi' },
                { nombre: 'Directorio funcionarios (SIGEP)', enlace: '#/la-unp/sigep' },
                { nombre: 'Contratos colaboradores UNP', enlace: '#/la-unp/contratos' },
                { nombre: 'Directorio Entidades Sector', enlace: '#/la-unp/directorio-entidades' },
                { nombre: 'Directorio agremiaciones', enlace: '#/la-unp/agremiaciones' },
                { nombre: 'Reconocimiento Elementos Identificación', enlace: '#/la-unp/reconocimiento' }
            ]
        },
        {
            nombre: 'Transparencia y acceso',
            enlace: '#/transparencia',
            activo: false,
            submenu: [
                { nombre: '1. Información de la Entidad', enlace: '#/transparencia/informacion-entidad' },
                { nombre: '2. Normativa', enlace: '#/transparencia/normativa' },
                { nombre: '3. Contratación', enlace: '#/transparencia/contratacion' },
                { nombre: '4. Planeación, Presupuesto e Informes', enlace: '#/transparencia/planeacion' },
                { nombre: '5. Trámites', enlace: '#/transparencia/tramites' },
                { nombre: '6. Participa', enlace: '#/transparencia/participa' },
                { nombre: '7. Datos Abiertos', enlace: '#/transparencia/datos-abiertos' },
                { nombre: '8. Información grupos interés', enlace: '#/transparencia/grupos-interes' },
                { nombre: '9. Reporte información específica', enlace: '#/transparencia/reporte-especifico' }
            ]
        },
        {
            nombre: 'Atención y Servicios',
            enlace: '#/atencion-servicios',
            activo: false,
            submenu: [
                { nombre: 'Trámites y Procedimientos', enlace: '#/atencion/tramites' },
                { nombre: 'Canales de Atención', enlace: '#/atencion/canales' },
                { nombre: 'Línea vida 103', enlace: '#/linea-vida-103' },
                { nombre: 'Reportes Operativos COPP', enlace: '#/atencion/reportes-copp' },
                { nombre: 'PQRSD', enlace: '#/atencion/pqrsd' },
                { nombre: 'Los ABC de la protección', enlace: '#/atencion/abc-proteccion' },
                { nombre: 'Preguntas frecuentes', enlace: '#/atencion/preguntas-frecuentes' },
                { nombre: 'Glosario', enlace: '#/atencion/glosario' },
                { nombre: 'Caracterizaciones de Usuarios', enlace: '#/atencion/caracterizaciones' },
                { nombre: 'Ofertas de empleo', enlace: '#/atencion/empleo' },
                { nombre: 'Notificaciones', enlace: '#/atencion/notificaciones' },
                { nombre: 'Calendario de actividades', enlace: '#/atencion/calendario' },
                { nombre: 'Datos Abiertos', enlace: '#/atencion/datos-abiertos' }
            ]
        },
        {
            nombre: 'Planeación, Gestión y Control',
            enlace: '#/planeacion-gestion',
            activo: false,
            submenu: [
                { nombre: 'Planes y Programas', enlace: '#/planeacion/planes-programas' },
                { nombre: 'Informes Nacionales', enlace: '#/planeacion/informes-nacionales' },
                { nombre: 'Informes Sentencia T-469', enlace: '#/planeacion/informes-t469' },
                { nombre: 'Documentos Técnicos', enlace: '#/planeacion/documentos-tecnicos' },
                { nombre: 'Reingeniería UNP', enlace: '#/planeacion/reingenieria' },
                { nombre: 'Boletín de Reingeniería', enlace: '#/planeacion/boletin-reingenieria' }
            ]
        },
        {
            nombre: 'Participa',
            enlace: '#/participa',
            activo: false,
            submenu: [
                { nombre: 'Descripción general menú participa', enlace: '#/participa/descripcion-general' },
                { nombre: 'Identificación de problemas', enlace: '#/participa/identificacion-problemas' },
                { nombre: 'Planeación presupuestario participativo', enlace: '#/participa/planeacion-presupuesto' },
                { nombre: 'Consulta ciudadana', enlace: '#/participa/consulta-ciudadana' },
                { nombre: 'Colaboración e innovación abierta', enlace: '#/participa/colaboracion-innovacion' },
                { nombre: 'Rendición de Cuentas', enlace: '#/participa/rendicion-cuentas' },
                { nombre: 'Control social', enlace: '#/participa/control-social' }
            ]
        },
        {
            nombre: 'Normativa',
            enlace: '#/normativa',
            activo: false,
            submenu: [
                { nombre: 'Políticas de Seguridad y Datos', enlace: '#/normativa/politicas-seguridad' },
                { nombre: 'Decreto Único Sectorial 1066', enlace: '#/normativa/decreto-1066' },
                { nombre: 'Leyes y Decretos', enlace: '#/normativa/leyes-decretos' },
                { nombre: 'Proyectos de normas', enlace: '#/normativa/proyectos-normas' },
                { nombre: 'Sentencias y Directivas', enlace: '#/normativa/sentencias-directivas' },
                { nombre: 'Resoluciones y Circulares', enlace: '#/normativa/resoluciones-circulares' },
                { nombre: 'Sucop', enlace: '#/normativa/sucop' },
                { nombre: 'Suin - Juriscol', enlace: '#/normativa/suin-juriscol' },
                { nombre: 'Normograma', enlace: '#/normativa/normograma' },
                { nombre: 'Información población vulnerable', enlace: '#/normativa/poblacion-vulnerable' }
            ]
        }
    ]);
    
    constructor() {
        console.log('HeaderComponent: Constructor llamado');
        // Cerrar al hacer clic fuera del header
        document.addEventListener('click', (event) => {
            if (this.activeMenu() !== null) {
                const target = event.target as Element;
                if (!target.closest('.header__nav')) {
                    this.closeAllDropdowns();
                }
            }
        });
    }

    // Métodos utilitarios para evitar repetición
    private clearTimeout(menuIndex: number): void {
        const timeouts = this.dropdownTimeouts();
        if (timeouts[menuIndex]) {
            clearTimeout(timeouts[menuIndex]);
        }
    }

    private clearAllTimeouts(): void {
        const timeouts = this.dropdownTimeouts();
        Object.keys(timeouts).forEach((key: string) => {
            if (timeouts[key]) {
                clearTimeout(timeouts[key]);
            }
        });
    }

    private setTimeout(menuIndex: number, callback: () => void, delay: number): void {
        const timeouts = this.dropdownTimeouts();
        timeouts[menuIndex] = setTimeout(callback, delay);
        this.dropdownTimeouts.set(timeouts);
    }

    private closeAllSubmenus(): void {
        const openSubmenus = this.openSubmenus();
        Object.keys(openSubmenus).forEach((key: string) => {
            openSubmenus[parseInt(key)] = false;
        });
        this.openSubmenus.set(openSubmenus);
    }
    
    // Función para alternar menú móvil
    toggleMobileMenu() {
        this.mobileMenuOpen.set(!this.mobileMenuOpen());
    }
    
    // Función para cerrar menú móvil
    closeMobileMenu() {
        this.mobileMenuOpen.set(false);
    }
    
    // Manejar evento mouse enter en item del menú
    handleMouseEnter(menuIndex: number) {
        this.hoveredMenu.set(menuIndex);
        this.isHoveringDropdown.set(true);
        
        this.clearTimeout(menuIndex);
        
        // Mostrar dropdown por hover si no hay menú sticky activo
        if (this.activeMenu() === null) {
            this.setTimeout(menuIndex, () => {
                if (this.hoveredMenu() === menuIndex && this.activeMenu() === null) {
                    this.showDropdown(menuIndex);
                }
            }, this.HOVER_DELAY);
        }
    }
    
    // Manejar evento mouse leave en item del menú
    handleMouseLeave(menuIndex: number) {
        this.hoveredMenu.set(null);
        this.isHoveringDropdown.set(false);
        
        // Ocultar dropdown por hover si no hay menú sticky activo
        if (this.activeMenu() === null) {
            this.setTimeout(menuIndex, () => {
                if (this.hoveredMenu() === null && this.activeMenu() === null) {
                    this.hideDropdown(menuIndex);
                }
            }, this.HIDE_DELAY);
        }
    }
    
    // Manejar evento click en item del menú
    handleClick(menuIndex: number, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        
        this.clearAllTimeouts();
        
        // Si se hace click en el mismo menú que ya está activo, cerrarlo
        if (this.activeMenu() === menuIndex) {
            this.activeMenu.set(null);
            this.hideDropdown(menuIndex);
            return;
        }
        
        this.closeAllSubmenus();
        
        // Establecer el nuevo menú activo
        this.activeMenu.set(menuIndex);
        this.showDropdown(menuIndex);
    }
    
    // Mostrar dropdown
    showDropdown(menuIndex: number) {
        const openSubmenus = this.openSubmenus();
        openSubmenus[menuIndex] = true;
        this.openSubmenus.set(openSubmenus);
    }
    
    // Ocultar dropdown
    hideDropdown(menuIndex: number) {
        const openSubmenus = this.openSubmenus();
        openSubmenus[menuIndex] = false;
        this.openSubmenus.set(openSubmenus);
    }
    
    // Verificar si un submenú está abierto
    isSubmenuOpen(menuIndex: number): boolean {
        return this.openSubmenus()[menuIndex] || false;
    }
    
    // Cerrar todos los dropdowns
    closeAllDropdowns() {
        this.clearAllTimeouts();
        this.closeAllSubmenus();
        
        // Resetear estados
        this.activeMenu.set(null);
        this.hoveredMenu.set(null);
        this.isHoveringDropdown.set(false);
    }
    
    // Función de búsqueda
    handleSearch() {
        const query = this.searchQuery().toLowerCase().trim();
        
        if (query.length < 2) {
            this.searchResults.set([]);
            return;
        }
        
        // Filtrar resultados
        const results = this.searchDatabase.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        ).slice(0, 5); // Limitar a 5 resultados
        
        this.searchResults.set(results);
    }
    
    // Función para seleccionar resultado de búsqueda
    selectSearchResult(result: any) {
        this.searchQuery.set(result.title);
        this.showSearchResults.set(false);
        
        // Redirigir a la URL del resultado
        window.location.href = result.url;
    }
    
    // Función para ocultar resultados (con delay para permitir clics)
    hideSearchResults() {
        setTimeout(() => {
            this.showSearchResults.set(false);
        }, 200);
    }
    
    // Track by functions
    trackByIndex(index: number, item: any): number {
        return index;
    }
}
