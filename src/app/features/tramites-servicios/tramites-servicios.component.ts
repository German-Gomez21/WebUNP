import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { Tramite, CanalAtencionDetalle } from '../../core/models/noticia.model';
import { InstitutionalCarouselComponent } from '../../shared/components/institutional-carousel/institutional-carousel.component';

@Component({
    selector: 'app-tramites-servicios',
    standalone: true,
    imports: [CommonModule, FormsModule, InstitutionalCarouselComponent],
    template: `
<div class="tramites-page">
    <!-- Hero Section -->
    <section class="tramites-hero">
        <div class="container">
            <div class="tramites-hero__content">
                <nav class="breadcrumbs">
                    <a href="/">Inicio</a>
                    <span class="material-icons">chevron_right</span>
                    <span>Atención y Servicios a la Ciudadanía</span>
                </nav>
                <h1 class="tramites-hero__title">Trámites y Servicios</h1>
                <p class="tramites-hero__subtitle">
                    Centralizamos todos los servicios de la Unidad Nacional de Protección para facilitar tu acceso a la seguridad y justicia.
                </p>
                <div class="tramites-hero__actions">
                    <button class="btn btn--primary">Solicitar Protección</button>
                    <button class="btn btn--white">Línea Vida 103</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="search-section">
        <div class="container">
            <div class="search-box">
                <div class="search-box__input-wrapper">
                    <span class="material-icons">search</span>
                    <input type="text" 
                           [ngModel]="searchTerm()" 
                           (ngModelChange)="searchTerm.set($event)"
                           placeholder="¿Qué trámite estás buscando? Ej: Protección individual, PQRSD...">
                </div>
            </div>
            
            <div class="categories-filter">
                <button *ngFor="let cat of categories"
                        [class.active]="selectedCategory() === cat"
                        (click)="setCategory(cat)"
                        class="category-btn">
                    {{cat}}
                </button>
            </div>
        </div>
    </section>

    <!-- Results Section -->
    <section class="results-section">
        <div class="container">
            <div class="results-grid" *ngIf="!loading(); else loadingState">
                <div class="tramite-card" *ngFor="let tramite of filteredTramites()">
                    <div class="tramite-card__header">
                        <span class="tag">{{tramite.categoria}}</span>
                        <h3 class="tramite-card__title">{{tramite.nombre}}</h3>
                    </div>
                    <div class="tramite-card__body">
                        <p class="tramite-card__desc">{{tramite.descripcion}}</p>
                        <div class="tramite-card__meta">
                            <div class="meta-item">
                                <span class="material-icons">people</span>
                                <span>{{tramite.dirigidoA}}</span>
                            </div>
                            <div class="meta-item">
                                <span class="material-icons">schedule</span>
                                <span>Respuesta: {{tramite.tiempoRespuesta}}</span>
                            </div>
                            <div class="meta-item">
                                <span class="material-icons">payments</span>
                                <span>Costo: {{tramite.costo}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tramite-card__footer">
                        <a [href]="tramite.linkTramite" class="btn btn--outline btn--sm">Ver requisitos</a>
                        <button class="btn btn--primary btn--sm">Realizar trámite</button>
                    </div>
                </div>
                
                <div class="empty-state" *ngIf="filteredTramites().length === 0">
                    <span class="material-icons">search_off</span>
                    <p>No se encontraron trámites que coincidan con tu búsqueda.</p>
                </div>
            </div>
            
            <ng-template #loadingState>
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Cargando trámites...</p>
                </div>
            </ng-template>
        </div>
    </section>

    <!-- Institutional Contact Section (section--blue pattern) -->
    <section class="section section--blue">
        <div class="container">
            <div class="section__header section__header--white">
                <h2 class="section__title">Canales de Atención</h2>
                <p class="section__subtitle">Comunícate con nosotros cuando lo necesites</p>
            </div>
            
            <div class="contact-channels">
                <div class="contact-channel" *ngFor="let canal of canales()">
                    <div class="contact-channel__icon">
                        <i class="material-icons contact-channel__icon-text">{{canal.icono}}</i>
                    </div>
                    <div class="contact-channel__content">
                        <h3 class="contact-channel__title">{{canal.tipo}}</h3>
                        <p class="contact-channel__value">{{canal.valor}}</p>
                        <p class="contact-channel__description">{{canal.descripcion || canal.horario}}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Carrusel Institucional -->
    <app-institutional-carousel></app-institutional-carousel>
</div>
`,
    styleUrls: ['./tramites-servicios.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TramitesServiciosComponent implements OnInit {
    private dataService = inject(DataService);

    // States
    public tramites = signal<Tramite[]>([]);
    public canales = signal<CanalAtencionDetalle[]>([]);
    public searchTerm = signal<string>('');
    public selectedCategory = signal<string>('Todos');
    public loading = signal<boolean>(true);

    // Categories for filter
    public categories = ['Todos', 'Protección', 'Atención Ciudadana', 'Certificaciones', 'Normatividad'];

    constructor() { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.dataService.getTramites().subscribe(data => {
            this.tramites.set(data);
            this.loading.set(false);
        });

        this.dataService.getCanalesAtencionDetalle().subscribe(data => {
            this.canales.set(data);
        });
    }

    // Filtered list
    public filteredTramites = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const category = this.selectedCategory();

        return this.tramites().filter(t => {
            const matchesSearch = t.nombre.toLowerCase().includes(term) ||
                t.descripcion.toLowerCase().includes(term);
            const matchesCategory = category === 'Todos' || t.categoria === category;
            return matchesSearch && matchesCategory;
        });
    });

    public setCategory(category: string): void {
        this.selectedCategory.set(category);
    }
}
