import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewChecked
} from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { SearchResult } from '../../core/models/noticia.model';
import { filter } from 'rxjs/operators';

interface NavLink {
  nombre: string;
  enlace: string;
}

interface NavGroup {
  label: string;
  items: NavLink[];
}

@Component({
  selector: 'header-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<header class="header">
  <div class="container">
    <div class="header__content">
      <div class="header__top-row">
        <!-- Menú a la izquierda -->
        <div class="header__nav-tools header__nav-tools--start">
          <button
            type="button"
            class="header__mobile-menu-btn btn btn--icon btn--soft"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-controls="header-primary-menu"
            [attr.aria-label]="mobileMenuOpen() ? 'Cerrar menú' : 'Abrir menú'">
            <i class="material-icons" aria-hidden="true">{{ mobileMenuOpen() ? 'close' : 'menu' }}</i>
          </button>
        </div>

        <!-- Logo al centro -->
        <div class="header__brand header__brand--centered">
          <a [routerLink]="'/'" class="header__logo-link" aria-label="Ir a la página de inicio">
            <div class="header__logo header__logo--large">
              <img
                src="assets/images/unp-logo.svg"
                alt="Logo Unidad Nacional de Protección"
                class="header__logo-img" />
            </div>
          </a>
        </div>

        <!-- Buscador a la derecha -->
        <div class="header__nav-tools header__nav-tools--end">
          <div
            class="header__search"
            [class.header__search--expanded]="searchExpanded()"
            (click)="$event.stopPropagation()">
            <div class="header__search-field" [attr.aria-hidden]="!searchExpanded()">
              <input
                #searchInput
                type="search"
                class="header__search-input"
                placeholder="Buscar en UNP..."
                aria-label="Buscar en UNP"
                [ngModel]="searchQuery()"
                (ngModelChange)="onSearchQueryChange($event)"
                (keydown.escape)="onSearchEscape($event)" />
            </div>

            <button
              type="button"
              class="header__search-toggle btn btn--icon btn--soft"
              (click)="toggleSearch()"
              [attr.aria-expanded]="searchExpanded()"
              aria-label="Buscar">
              <i class="material-icons" aria-hidden="true">search</i>
            </button>

            <div
              class="header__search-results"
              *ngIf="searchExpanded() && showSearchResults() && searchResults().length > 0">
              <ul class="header__search-list">
                <li
                  class="header__search-item"
                  *ngFor="let result of searchResults(); trackBy: trackByIndex"
                  (mousedown)="selectSearchResult(result)">
                  <div class="header__search-item-content">
                    <i class="material-icons header__search-item-icon" aria-hidden="true">{{ result.icon }}</i>
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

      <!-- Drawer de navegación esencial -->
      <div
        class="header__mobile-nav"
        id="header-primary-menu"
        *ngIf="mobileMenuOpen()"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal">
        <button
          type="button"
          class="header__mobile-nav-backdrop"
          (click)="closeMobileMenu()"
          aria-label="Cerrar menú"></button>

        <div class="header__mobile-nav-content" (click)="$event.stopPropagation()">
          <div class="header__mobile-nav-header">
            <h2 class="header__mobile-nav-title">Menú</h2>
            <button
              type="button"
              class="header__mobile-nav-close btn btn--icon btn--soft"
              (click)="closeMobileMenu()"
              aria-label="Cerrar menú">
              <i class="material-icons" aria-hidden="true">close</i>
            </button>
          </div>

          <nav class="header__drawer-nav" aria-label="Navegación principal">
            <div class="header__drawer-group" *ngFor="let group of navGroups; trackBy: trackByGroup">
              <p class="header__drawer-label">{{ group.label }}</p>
              <ul class="header__mobile-nav-list">
                <li class="header__mobile-nav-item" *ngFor="let item of group.items; trackBy: trackByLink">
                  <a
                    [routerLink]="item.enlace"
                    routerLinkActive="header__mobile-nav-link--active"
                    [routerLinkActiveOptions]="{ exact: item.enlace === '/' }"
                    class="header__mobile-nav-link"
                    (click)="closeMobileMenu()">
                    {{ item.nombre }}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
</header>
  `
})
export class HeaderComponent implements AfterViewChecked {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  searchQuery = this.searchService.searchQuery;
  searchResults = this.searchService.searchResults;
  showSearchResults = this.searchService.showSearchResults;

  mobileMenuOpen = signal(false);
  searchExpanded = signal(false);

  private focusSearchPending = false;

  /** Navegación esencial — solo rutas públicas únicas (sin duplicados ni admin). */
  readonly navGroups: NavGroup[] = [
    {
      label: 'Principal',
      items: [
        { nombre: 'Inicio', enlace: '/' },
        { nombre: 'La UNP', enlace: '/la-unp' },
        { nombre: 'Quiénes somos', enlace: '/quienes-somos' },
        { nombre: 'Noticias', enlace: '/noticias' }
      ]
    },
    {
      label: 'Atención',
      items: [
        { nombre: 'Trámites y servicios', enlace: '/atencion-servicios/tramites' },
        { nombre: 'PQRSD', enlace: '/pqrsd' },
        { nombre: 'Línea Vida 103', enlace: '/linea-vida-103' }
      ]
    },
    {
      label: 'Información',
      items: [
        { nombre: 'Transparencia', enlace: '/transparencia' },
        { nombre: 'Normativa', enlace: '/normativa' }
      ]
    }
  ];

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileMenu();
        if (!this.searchQuery().trim()) {
          this.collapseSearch();
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.focusSearchPending && this.searchInput?.nativeElement) {
      this.focusSearchPending = false;
      this.searchInput.nativeElement.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (target?.closest('.header__search') || target?.closest('.header__nav-tools')) {
      return;
    }
    if (this.searchExpanded() && !this.searchQuery().trim()) {
      this.collapseSearch();
    }
  }

  @HostListener('document:keydown.escape')
  onDocumentEscape(): void {
    if (this.mobileMenuOpen()) {
      this.closeMobileMenu();
      return;
    }
    if (this.searchExpanded() && !this.searchQuery().trim()) {
      this.collapseSearch();
    }
  }

  toggleMobileMenu(): void {
    const next = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(next);
    document.body.style.overflow = next ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    if (!this.mobileMenuOpen()) return;
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  toggleSearch(): void {
    if (this.searchExpanded()) {
      if (!this.searchQuery().trim()) {
        this.collapseSearch();
      } else {
        this.focusSearchPending = true;
      }
      return;
    }
    this.openSearch();
  }

  openSearch(): void {
    this.searchExpanded.set(true);
    this.showSearchResults.set(true);
    this.focusSearchPending = true;
  }

  collapseSearch(): void {
    this.searchExpanded.set(false);
    this.searchService.hideResults();
  }

  onSearchQueryChange(value: string): void {
    this.searchQuery.set(value);
    this.searchService.performSearch(value).subscribe();
    this.showSearchResults.set(true);
  }

  onSearchEscape(event: Event): void {
    event.stopPropagation();
    if (!this.searchQuery().trim()) {
      this.collapseSearch();
    } else {
      this.searchQuery.set('');
      this.searchService.performSearch('').subscribe();
    }
  }

  selectSearchResult(result: SearchResult): void {
    this.searchService.selectResult(result);
    this.collapseSearch();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByGroup(_index: number, group: NavGroup): string {
    return group.label;
  }

  trackByLink(_index: number, item: NavLink): string {
    return item.enlace;
  }
}
