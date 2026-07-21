import { Component, signal, computed, inject, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';

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
                               [ngModel]="searchQuery()"
                               (ngModelChange)="searchQuery.set($event)"
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
    private readonly searchService = inject(SearchService);
    
    // Estado del menú
    activeMenu = signal<number | null>(null);
    openSubmenus = signal<Record<number, boolean>>({});
    
    // Estado de búsqueda
    searchQuery = this.searchService.searchQuery;
    searchResults = this.searchService.searchResults;
    showSearchResults = this.searchService.showSearchResults;
    
    // Estado del menú móvil
    mobileMenuOpen = signal(false);
    
    // Estado de navegación avanzada
    hoveredMenu = signal<number | null>(null);
    isHoveringDropdown = signal(false);
    dropdownTimeouts = signal<Record<string, any>>({});
    
    // Variables de configuración
    private readonly HOVER_DELAY = 150;
    private readonly HIDE_DELAY = 200;
    
    
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
            enlace: '/la-unp',
            activo: false,
            submenu: [
                { nombre: 'El director', enlace: '/la-unp' },
                { nombre: '¿Quiénes somos?', enlace: '/quienes-somos' },
                { nombre: '¿Qué Hacemos?', enlace: '/quienes-somos' },
                { nombre: '¿Cómo lo hacemos?', enlace: '/la-unp' },
                { nombre: 'Organigrama', enlace: '/la-unp' },
                { nombre: 'Símbolos', enlace: '/la-unp' },
                { nombre: 'Gestión Humana', enlace: '/la-unp' },
                { nombre: 'Sistema de Gestión Integrada (SGI)', enlace: '/la-unp' },
                { nombre: 'Directorio funcionarios (SIGEP)', enlace: '/la-unp' },
                { nombre: 'Contratos colaboradores UNP', enlace: '/la-unp' },
                { nombre: 'Directorio Entidades Sector', enlace: '/la-unp' },
                { nombre: 'Directorio agremiaciones', enlace: '/la-unp' },
                { nombre: 'Reconocimiento Elementos Identificación', enlace: '/la-unp' }
            ]
        },
        {
            nombre: 'Transparencia y acceso',
            enlace: '/transparencia',
            activo: false,
            submenu: [
                { nombre: '1. Información de la Entidad', enlace: '/transparencia' },
                { nombre: '2. Normativa', enlace: '/normativa' },
                { nombre: '3. Contratación', enlace: '/transparencia' },
                { nombre: '4. Planeación, Presupuesto e Informes', enlace: '/transparencia' },
                { nombre: '5. Trámites', enlace: '/atencion-servicios/tramites' },
                { nombre: '6. Participa', enlace: '/transparencia' },
                { nombre: '7. Datos Abiertos', enlace: '/transparencia' },
                { nombre: '8. Información grupos interés', enlace: '/transparencia' },
                { nombre: '9. Reporte información específica', enlace: '/transparencia' }
            ]
        },
        {
            nombre: 'Atención y Servicios',
            enlace: '/atencion-servicios/tramites',
            activo: false,
            submenu: [
                { nombre: 'Trámites y Procedimientos', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Canales de Atención', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Línea vida 103', enlace: '/linea-vida-103' },
                { nombre: 'Reportes Operativos COPP', enlace: '/atencion-servicios/tramites' },
                { nombre: 'PQRSD', enlace: '/pqrsd' },
                { nombre: 'Los ABC de la protección', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Preguntas frecuentes', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Glosario', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Caracterizaciones de Usuarios', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Ofertas de empleo', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Notificaciones', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Calendario de actividades', enlace: '/atencion-servicios/tramites' },
                { nombre: 'Datos Abiertos', enlace: '/atencion-servicios/tramites' }
            ]
        },
        {
            nombre: 'Planeación, Gestión y Control',
            enlace: '/transparencia',
            activo: false,
            submenu: [
                { nombre: 'Planes y Programas', enlace: '/transparencia' },
                { nombre: 'Informes Nacionales', enlace: '/transparencia' },
                { nombre: 'Informes Sentencia T-469', enlace: '/transparencia' },
                { nombre: 'Documentos Técnicos', enlace: '/transparencia' },
                { nombre: 'Reingeniería UNP', enlace: '/transparencia' },
                { nombre: 'Boletín de Reingeniería', enlace: '/transparencia' }
            ]
        },
        {
            nombre: 'Participa',
            enlace: '/transparencia',
            activo: false,
            submenu: [
                { nombre: 'Descripción general menú participa', enlace: '/transparencia' },
                { nombre: 'Identificación de problemas', enlace: '/transparencia' },
                { nombre: 'Planeación presupuestario participativo', enlace: '/transparencia' },
                { nombre: 'Consulta ciudadana', enlace: '/transparencia' },
                { nombre: 'Colaboración e innovación abierta', enlace: '/transparencia' },
                { nombre: 'Rendición de Cuentas', enlace: '/transparencia' },
                { nombre: 'Control social', enlace: '/transparencia' }
            ]
        },
        {
            nombre: 'Normativa',
            enlace: '/normativa',
            activo: false,
            submenu: [
                { nombre: 'Políticas de Seguridad y Datos', enlace: '/normativa' },
                { nombre: 'Decreto Único Sectorial 1066', enlace: '/normativa' },
                { nombre: 'Leyes y Decretos', enlace: '/normativa' },
                { nombre: 'Proyectos de normas', enlace: '/normativa' },
                { nombre: 'Sentencias y Directivas', enlace: '/normativa' },
                { nombre: 'Resoluciones y Circulares', enlace: '/normativa' },
                { nombre: 'Sucop', enlace: '/normativa' },
                { nombre: 'Suin - Juriscol', enlace: '/normativa' },
                { nombre: 'Normograma', enlace: '/normativa' },
                { nombre: 'Información población vulnerable', enlace: '/normativa' }
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
        this.searchService.performSearch(this.searchQuery()).subscribe();
    }
    
    // Función para seleccionar resultado de búsqueda
    selectSearchResult(result: any) {
        this.searchService.selectResult(result);
    }
    
    // Función para ocultar resultados (con delay para permitir clics)
    hideSearchResults() {
        this.searchService.hideResults();
    }
    
    // Track by functions
    trackByIndex(index: number, item: any): number {
        return index;
    }
}
