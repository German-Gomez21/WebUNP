import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsItem {
  id: number;
  date: string;
  category: string;
  title: string;
  description: string;
  link: string;
  gradient: string;
  icon: string;
}

@Component({
  selector: 'news-component',
  standalone: true,
  imports: [CommonModule],
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
                            @for (item of newsItems(); track item.id) {
                                <div class="news-carousel__item">
                                    <div class="news-card">
                                        <div class="news-card__image" [style.background]="item.gradient">
                                            <i class="material-icons news-card__icon">{{ item.icon }}</i>
                                        </div>
                                        <div class="news-card__content">
                                            <div class="news-card__meta">
                                                <span class="news-card__date">{{ item.date }}</span>
                                                <span class="news-card__category">{{ item.category }}</span>
                                            </div>
                                            <h3 class="news-card__title">{{ item.title }}</h3>
                                            <p class="news-card__description">{{ item.description }}</p>
                                            <a href="#" class="news-card__link">Leer más <i class="material-icons">arrow_forward</i></a>
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
                        @for (item of newsItems(); track item.id) {
                            <button class="news-carousel__indicator" 
                                    [class.news-carousel__indicator--active]="currentSlide() === item.id"
                                    (click)="goToSlide(item.id)" 
                                    [attr.aria-label]="'Ir a slide ' + (item.id + 1)"></button>
                        }
                    </div>
                </div>
            </div>
        </section>
  `
})
export class NewsComponent implements AfterViewInit {
  public currentSlide = signal<number>(0);
  public newsItems = signal<NewsItem[]>([
    {
      id: 0,
      date: "15 de marzo, 2024",
      category: "Actualidad",
      title: "UNP fortalece medidas de protección",
      description: "La Unidad Nacional de Protección implementa nuevas estrategias para garantizar la seguridad de personas en situación de riesgo.",
      link: "#",
      gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
      icon: "article"
    },
    {
      id: 1,
      date: "12 de marzo, 2024",
      category: "Comunicado",
      title: "Nuevos canales de atención",
      description: "Se amplía la cobertura de servicios de atención con la implementación de plataformas digitales para mejor acceso ciudadano.",
      link: "#",
      gradient: "linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)",
      icon: "campaign"
    },
    {
      id: 2,
      date: "10 de marzo, 2024",
      category: "Evento",
      title: "Foro internacional sobre protección",
      description: "La UNP participa en encuentro global para compartir experiencias en protección de derechos humanos y sociales.",
      link: "#",
      gradient: "linear-gradient(135deg, #667EEA 0%, #764BA2 100%)",
      icon: "event"
    },
    {
      id: 3,
      date: "8 de marzo, 2024",
      category: "Seguridad",
      title: "Protocolo de emergencia actualizado",
      description: "Se implementan nuevos procedimientos de respuesta inmediata para situaciones de alto riesgo y protección ciudadana.",
      link: "#",
      gradient: "linear-gradient(135deg, #F093FB 0%, #F5576C 100%)",
      icon: "security"
    },
    {
      id: 4,
      date: "5 de marzo, 2024",
      category: "Comunidad",
      title: "Programa de protección comunitaria",
      description: "Se lanza iniciativa para fortalecer la protección en territorios vulnerables del país con apoyo integral.",
      link: "#",
      gradient: "linear-gradient(135deg, #FA709A 0%, #FEE140 100%)",
      icon: "people"
    },
    {
      id: 5,
      date: "2 de marzo, 2024",
      category: "Capacitación",
      title: "Talleres de prevención y autoprotección",
      description: "Se ofrecen espacios formativos para comunidades en situación de vulnerabilidad y prevención de riesgos.",
      link: "#",
      gradient: "linear-gradient(135deg, #30CFD0 0%, #330867 100%)",
      icon: "school"
    }
  ]);

  constructor() { }

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

  private startAutoRotate(): void {
    setInterval(() => {
      this.nextSlide();
    }, 4000);
  }
}
