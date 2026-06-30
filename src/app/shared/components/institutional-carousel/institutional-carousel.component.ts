import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  signal,
  computed,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselItem } from '../../../core/models/noticia.model';

@Component({
  selector: 'app-institutional-carousel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './institutional-carousel.component.html',
  styleUrls: ['./institutional-carousel.component.scss'],
})
export class InstitutionalCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Array de diapositivas. Se puede pasar desde el componente padre o usar los valores por defecto */
  @Input() items: CarouselItem[] = DEFAULT_CAROUSEL_ITEMS;
  /** Intervalo de auto-rotación en milisegundos. 0 = desactivado */
  @Input() autoPlayInterval: number = 5000;
  /** Título de la sección */
  @Input() sectionTitle: string = 'Novedades de la UNP';

  @ViewChild('track') trackRef!: ElementRef<HTMLDivElement>;

  public currentIndex = signal<number>(0);
  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;

  // Variables para swipe táctil
  private touchStartX = 0;
  private touchEndX = 0;

  public totalSlides = computed(() => this.items.length);

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.autoPlayInterval > 0) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  // ─── Navegación ─────────────────────────────────────────

  public goTo(index: number): void {
    this.currentIndex.set((index + this.items.length) % this.items.length);
  }

  public prev(): void {
    this.goTo(this.currentIndex() - 1);
    this.resetAutoPlay();
  }

  public next(): void {
    this.goTo(this.currentIndex() + 1);
    this.resetAutoPlay();
  }

  public navigate(link?: string): void {
    if (!link) return;
    if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      this.router.navigate([link]);
    }
  }

  // ─── Auto-play ──────────────────────────────────────────

  private startAutoPlay(): void {
    this.autoPlayTimer = setInterval(() => {
      this.goTo(this.currentIndex() + 1);
    }, this.autoPlayInterval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private resetAutoPlay(): void {
    this.stopAutoPlay();
    if (this.autoPlayInterval > 0) {
      this.startAutoPlay();
    }
  }

  // ─── Touch / Swipe ──────────────────────────────────────

  public onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  public onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? this.next() : this.prev();
    }
  }

  // ─── Helpers (template) ─────────────────────────────────

  public isActive(index: number): boolean {
    return this.currentIndex() === index;
  }
}

/**
 * Datos de prueba institucionales de la UNP.
 * REEMPLAZAR con datos reales provenientes de un servicio o CMS.
 */
export const DEFAULT_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 0,
    image: 'assets/images/carousel-1.jpg',
    imageAlt: 'Equipo de seguridad de la UNP junto a vehículo blindado institucional',
    title: 'Protección con Compromiso',
    subtitle: 'La UNP garantiza la seguridad de personas en situación de riesgo extraordinario en todo el territorio colombiano.',
    ctaText: 'Conocer el programa',
    ctaLink: '/la-unp',
    fallbackGradient: 'linear-gradient(135deg, #004884 0%, #002d52 100%)',
  },
  {
    id: 1,
    image: 'assets/images/carousel-2.png',
    imageAlt: 'Representantes de la UNP en reunión con líderes sociales y comunitarios',
    title: 'Diálogo y Participación Ciudadana',
    subtitle: 'Construimos confianza institucional mediante el diálogo permanente con los líderes y comunidades que protegemos.',
    ctaText: 'Solicitar protección',
    ctaLink: '/atencion-servicios/tramites',
    fallbackGradient: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
  },
  {
    id: 2,
    image: 'assets/images/carousel-3.jpg',
    imageAlt: 'Centro de operaciones y monitoreo de la Unidad Nacional de Protección',
    title: 'Tecnología al Servicio de la Seguridad',
    subtitle: 'Nuestros centros de operaciones trabajan las 24 horas para monitorear y responder ante cualquier situación de riesgo.',
    ctaText: 'Línea Vida 103',
    ctaLink: '/linea-vida-103',
    fallbackGradient: 'linear-gradient(135deg, #37474F 0%, #1A1E2A 100%)',
  },
];
