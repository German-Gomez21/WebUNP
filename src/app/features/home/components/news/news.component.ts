import { Component, signal, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../../../core/services/data.service';
import { Noticia } from '../../../../core/models/noticia.model';

@Component({
  selector: 'news-component',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
        <!-- Noticias -->
        <section class="section section--gray">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">Noticias</h2>
                    <p class="section__subtitle">Mantente informado sobre las últimas novedades de la UNP</p>
                </div>
                
                <div class="news-carousel">
                    <div class="news-carousel__container" 
                         [style.transform]="'translateX(-' + (currentSlide() * 344) + 'px)'">
                        <div class="news-carousel__track">
                            @for (item of newsItems(); track item.id; let i = $index) {
                                <div class="news-carousel__item">
                                    <div class="news-card">
                                        <div class="news-card__image">
                                            <img [ngSrc]="item.imagen || fallbackImage" [alt]="item.titulo" width="640" height="400" [attr.loading]="i < 2 ? 'eager' : 'lazy'" [attr.fetchpriority]="i < 2 ? 'high' : 'auto'" [attr.sizes]="'(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'" decoding="async" (error)="onImageError($event)" />
                                        </div>
                                        <div class="news-card__content">
                                            <div class="news-card__meta">
                                                <span class="news-card__date">{{ item.fecha | date:'dd MMM yyyy':'':'es' }}</span>
                                                <span class="news-card__category">{{ item.categoria }}</span>
                                            </div>
                                            <h3 class="news-card__title">{{ item.titulo }}</h3>
                                            <p class="news-card__description">{{ item.resumen }}</p>
                                            <a [routerLink]="item.slug ? ['/noticias', item.slug] : ['/noticias']" class="news-card__link">Leer más <i class="material-icons">arrow_forward</i></a>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    
                    <!-- Controles del carrusel -->
                    <div class="news-carousel__controls">
                        <button class="news-carousel__btn" 
                                (click)="prevSlide()" 
                                aria-label="Anterior">
                            <i class="material-icons">chevron_left</i>
                        </button>
                        <button class="news-carousel__btn" 
                                (click)="nextSlide()" 
                                aria-label="Siguiente">
                            <i class="material-icons">chevron_right</i>
                        </button>
                    </div>
                    
                    <!-- Indicadores -->
                    <div class="news-carousel__indicators">
                        @for (item of newsItems(); track item.id; let i = $index) {
                            <button class="news-carousel__indicator" 
                                    [class.news-carousel__indicator--active]="currentSlide() === i"
                                    (click)="goToSlide(i)" 
                                    [attr.aria-label]="'Ir a slide ' + (i + 1)"></button>
                        }
                    </div>
                </div>
            </div>
        </section>
  `
})
export class NewsComponent implements OnInit, AfterViewInit {
  public currentSlide = signal<number>(0);
  public newsItems = signal<Noticia[]>([]);
  public readonly fallbackImage = 'assets/images/unp-institution.jpg';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getNoticias().subscribe({
      next: (data) => {
        this.newsItems.set(data.slice(0, 6));
        this.currentSlide.set(0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.startAutoRotate();
  }

  public nextSlide(): void {
    const totalSlides = this.newsItems().length;
    const next = (this.currentSlide() + 1) % totalSlides;
    this.currentSlide.set(next);
  }

  public prevSlide(): void {
    const totalSlides = this.newsItems().length;
    const prev = (this.currentSlide() - 1 + totalSlides) % totalSlides;
    this.currentSlide.set(prev);
  }

  public goToSlide(slideId: number): void {
    this.currentSlide.set(slideId);
  }

  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = this.fallbackImage;
    }
  }

  private startAutoRotate(): void {
    setInterval(() => {
      if (this.newsItems().length > 0) {
        this.nextSlide();
      }
    }, 4000);
  }
}
