import { Component, ViewEncapsulation, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { HeroComponent } from './components/hero/hero.component';
import { BannersComponent } from './components/banners/banners.component';
import { SectionsComponent } from './components/sections/sections.component';
import { ServicesComponent } from './components/services/services.component';
import { NewsComponent } from './components/news/news.component';
import { ContactComponent } from './components/contact/contact.component';
import { AccessibilityBarComponent } from '../../layout/accessibility-bar/accessibility-bar.component';
import { 
  Noticia, 
  AccesoRapido, 
  FAQItem, 
  CanalAtencion, 
  InstitucionInfo,
  HeroData,
  BannerPrincipal,
  SeccionInformativa 
} from '../../core/models/noticia.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    BannersComponent,
    SectionsComponent,
    ServicesComponent,
    NewsComponent,
    ContactComponent,
    AccessibilityBarComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.Emulated (default)
})
export class HomeComponent implements OnInit {
  // Services
  private dataService = inject(DataService);
  private router = inject(Router);

  // Signals para estado reactivo (migrado desde AngularJS $scope)
  public loading = signal<boolean>(false);
  public error = signal<string | null>(null);

  // Datos de la página (migrados desde AngularJS controller)
  public noticias = signal<Noticia[]>([]);
  public accesosRapidos = signal<AccesoRapido[]>([]);
  public faqItems = signal<FAQItem[]>([]);
  public canalesAtencion = signal<CanalAtencion[]>([]);
  public institucionInfo = signal<InstitucionInfo | null>(null);
  public heroData = signal<HeroData | null>(null);
  public bannersPrincipales = signal<BannerPrincipal[]>([]);
  public seccionesInformativas = signal<SeccionInformativa[]>([]);

  // Estado del FAQ (migrado desde AngularJS)
  public openFAQId = signal<number | null>(null);

  // Datos estáticos del Hero (migrados desde AngularJS)
  private heroStaticData: HeroData = {
    titulo: "Protección integral para quienes están en riesgo",
    subtitulo: "La Unidad Nacional de Protección garantiza la seguridad y el derecho a la vida de personas en situación de vulnerabilidad",
    botones: [
      {
        texto: "Solicitar protección",
        enlace: "/atencion-servicios/tramites",
        tipo: "primario",
        aria: "Iniciar proceso de solicitud de protección"
      },
      {
        texto: "Línea vida 103",
        enlace: "/atencion-servicios/linea-vida-103",
        tipo: "secundario",
        aria: "Llamar a línea vida 103"
      },
      {
        texto: "PQRSD",
        enlace: "/atencion-servicios/pqrsd",
        tipo: "terciario",
        aria: "Presentar PQRSD"
      }
    ]
  };

  constructor() {
    console.log('HomeComponent: Componente inicializado');
  }

  ngOnInit(): void {
    this.loadData();
  }

  // Cargar datos asíncronos (migrado desde AngularJS)
  public loadData(): void {
    console.log('HomeComponent: Cargando datos...');
    this.loading.set(true);

    // Cargar todos los datos en paralelo
    this.dataService.getNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        console.log('Noticias cargadas:', data.length);
      },
      error: (err) => {
        console.error('Error cargando noticias:', err);
        this.error.set('Error al cargar noticias');
      }
    });

    this.dataService.getAccesosRapidos().subscribe({
      next: (data) => {
        this.accesosRapidos.set(data);
        console.log('Accesos rápidos cargados:', data.length);
      },
      error: (err) => {
        console.error('Error cargando accesos rápidos:', err);
        this.error.set('Error al cargar accesos rápidos');
      }
    });

    this.dataService.getFAQ().subscribe({
      next: (data) => {
        this.faqItems.set(data);
        console.log('FAQ items cargados:', data.length);
      },
      error: (err) => {
        console.error('Error cargando FAQ:', err);
        this.error.set('Error al cargar FAQ');
      }
    });

    this.dataService.getCanalesAtencion().subscribe({
      next: (data) => {
        this.canalesAtencion.set(data);
        console.log('Canales de atención cargados:', data.length);
      },
      error: (err) => {
        console.error('Error cargando canales de atención:', err);
        this.error.set('Error al cargar canales de atención');
      }
    });

    this.dataService.getInstitucionInfo().subscribe({
      next: (data) => {
        this.institucionInfo.set(data);
        console.log('Información institucional cargada');
      },
      error: (err) => {
        console.error('Error cargando información institucional:', err);
        this.error.set('Error al cargar información institucional');
      }
    });

    this.dataService.getHeroData().subscribe({
      next: (data) => {
        this.heroData.set(data);
        console.log('Datos del hero cargados');
      },
      error: (err) => {
        console.error('Error cargando datos del hero:', err);
        // Usar datos estáticos como fallback
        this.heroData.set(this.heroStaticData);
      }
    });

    this.dataService.getBannersPrincipales().subscribe({
      next: (data) => {
        this.bannersPrincipales.set(data);
        console.log('Banners principales cargados:', data.length);
      },
      error: (err) => {
        console.error('Error cargando banners principales:', err);
        this.error.set('Error al cargar banners principales');
      }
    });

    this.dataService.getSeccionesInformativas().subscribe({
      next: (data) => {
        this.seccionesInformativas.set(data);
        console.log('Secciones informativas cargadas:', data.length);
      },
      error: (err) => {
        console.error('Error cargando secciones informativas:', err);
        this.error.set('Error al cargar secciones informativas');
      }
    });

    // Fin de carga inmediato
    this.loading.set(false);
  }

  // Métodos del FAQ (migrados desde AngularJS)
  public toggleFAQ(itemId: number): void {
    const currentOpenId = this.openFAQId();
    this.openFAQId.set(currentOpenId === itemId ? null : itemId);
  }

  public isFAQOpen(itemId: number): boolean {
    return this.openFAQId() === itemId;
  }

  // Manejo de eventos (migrados desde AngularJS)
  public handleCTAClick(boton: any): void {
    console.log('CTA clickeado:', boton.texto);
    // Analytics o lógica adicional aquí
    if (boton.enlace) {
      this.router.navigate([boton.enlace]);
    }
  }

  public handleAccesoRapidoClick(acceso: BannerPrincipal): void {
    console.log('Acceso rápido:', acceso.titulo);
    // Analytics o lógica adicional aquí
    if (acceso.enlace) {
      this.router.navigate([acceso.enlace]);
    }
  }

  // Utilidades (migradas desde AngularJS)
  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-CO', options);
  }

  public truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  }

  // Navegación
  public navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // Computed properties para estado derivado
  public hasError = computed(() => this.error() !== null);
  public errorMessage = computed(() => this.error() || '');
  public hasData = computed(() => 
    this.noticias().length > 0 || 
    this.accesosRapidos().length > 0 || 
    this.faqItems().length > 0
  );
}
