import { Component, signal, inject, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  ctaText: string;
  ctaIcon: string;
  ctaLink: string;
}

@Component({
  selector: 'hero-component',
  standalone: true,
  imports: [CommonModule],
  template: `
        <!-- Hero Section -->
        <section class="hero">
            <!-- Hero Carousel Full Width -->
            <div class="hero-carousel">
                <div class="hero-carousel__inner">
                    @for (slide of slides(); track slide.id) {
                        <div class="hero-carousel__item" 
                             [class.hero-carousel__item--active]="currentSlide() === slide.id"
                             [style.background-image]="slide.gradient">
                            <div class="hero-carousel__background" 
                                 [style.background-image]="'url(' + slide.image + ')'">
                                <div class="hero-carousel__overlay"></div>
                            </div>
                            <div class="hero-carousel__content">
                                <div class="container">
                                    <div class="hero-carousel__caption">
                                        <h2 class="hero-carousel__title">{{ slide.title }}</h2>
                                        <p class="hero-carousel__subtitle">{{ slide.subtitle }}</p>
                                        <button class="hero-carousel__cta" (click)="navigateToSlide(slide.ctaLink)">
                                            <i class="material-icons hero-carousel__cta-icon">{{ slide.ctaIcon }}</i>
                                            <span class="hero-carousel__cta-text">{{ slide.ctaText }}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                
                <!-- Navigation Controls -->
                <button class="hero-carousel__control hero-carousel__control--prev" 
                        (click)="prevSlide()" 
                        aria-label="Anterior">
                    <i class="material-icons">chevron_left</i>
                </button>
                <button class="hero-carousel__control hero-carousel__control--next" 
                        (click)="nextSlide()" 
                        aria-label="Siguiente">
                    <i class="material-icons">chevron_right</i>
                </button>
                
                <!-- Indicators -->
                <div class="hero-carousel__indicators">
                    @for (slide of slides(); track slide.id) {
                        <button class="hero-carousel__indicator" 
                                [class.hero-carousel__indicator--active]="currentSlide() === slide.id"
                                (click)="goToSlide(slide.id)" 
                                [attr.aria-label]="'Slide ' + (slide.id + 1)"></button>
                    }
                </div>
            </div>
        </section>
  `
})
export class HeroComponent implements AfterViewInit {
  private router = inject(Router);
  
  // Signals para estado del carrusel
  public currentSlide = signal<number>(0);
  public slides = signal<HeroSlide[]>([
    {
      id: 0,
      title: "Solicitar Protección",
      subtitle: "Accede al programa de protección para personas en situación de riesgo extraordinario",
      image: "assets/images/hero-protection.jpg",
      gradient: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
      ctaText: "Solicitar ahora",
      ctaIcon: "shield",
      ctaLink: "/solicitar-proteccion"
    },
    {
      id: 1,
      title: "Línea Vida 103",
      subtitle: "Llama gratis las 24 horas para reportar situaciones de riesgo y recibir ayuda inmediata",
      image: "assets/images/hero-linea-vida.jpg",
      gradient: "linear-gradient(135deg, #dc2626, #f87171)",
      ctaText: "Llamar ahora",
      ctaIcon: "phone_in_talk",
      ctaLink: "/linea-vida-103"
    },
    {
      id: 2,
      title: "PQRSD",
      subtitle: "Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias de forma segura",
      image: "assets/images/hero-pqrsd.jpg",
      gradient: "linear-gradient(135deg, #059669, #10b981)",
      ctaText: "Enviar PQRSD",
      ctaIcon: "mail",
      ctaLink: "/pqrsd"
    }
  ]);

  constructor() { }

  ngAfterViewInit(): void {
    // Iniciar auto-rotación del carrusel
    this.startAutoRotate();
  }

  public nextSlide(): void {
    const totalSlides = this.slides().length;
    const next = (this.currentSlide() + 1) % totalSlides;
    this.currentSlide.set(next);
  }

  public prevSlide(): void {
    const totalSlides = this.slides().length;
    const prev = (this.currentSlide() - 1 + totalSlides) % totalSlides;
    this.currentSlide.set(prev);
  }

  public goToSlide(slideId: number): void {
    this.currentSlide.set(slideId);
  }

  public navigateToSlide(link: string): void {
    if (link.includes('pqrsd.html')) {
      // Para PQRSD, abrir en nueva ventana o manejar especial
      window.location.href = link;
    } else {
      this.router.navigate([link]);
    }
  }

  private startAutoRotate(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambiar slide cada 5 segundos
  }
}
