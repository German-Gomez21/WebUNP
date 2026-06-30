import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { BannerPrincipal } from '../../../../core/models/noticia.model';

@Component({
  selector: 'banners-component',
  standalone: true,
  imports: [CommonModule],
  template: `
        <!-- Banners Principales -->
        <section class="section">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">Servicios Principales</h2>
                    <p class="section__subtitle">Accede a nuestros servicios más importantes</p>
                </div>
                
                <div class="banners-grid">
                    <div *ngFor="let banner of banners()" 
                         class="banner-card" 
                         [class.banner-card--destacado]="banner.destacado"
                         [style.border-left]="'4px solid ' + banner.color">
                        <div class="banner-card__icon" [style.background-color]="banner.color + '20'">
                            <i class="material-icons banner-card__icon-text" [style.color]="banner.color">{{banner.icono}}</i>
                        </div>
                        <div class="banner-card__content">
                            <h3 class="banner-card__title">{{banner.titulo}}</h3>
                            <p class="banner-card__description">{{banner.descripcion}}</p>
                            <a [href]="banner.enlace" class="banner-card__link">Ir al servicio</a>
                        </div>
                        <div class="banner-card__arrow">
                            <i class="material-icons banner-card__arrow-icon">arrow_forward</i>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  `
})
export class BannersComponent implements OnInit {
  private dataService = inject(DataService);
  public banners = signal<BannerPrincipal[]>([]);

  ngOnInit(): void {
    this.dataService.getBannersPrincipales().subscribe(data => {
      this.banners.set(data);
    });
  }
}
