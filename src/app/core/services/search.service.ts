import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';
import { SearchResult } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  private readonly staticDatabase: SearchResult[] = [
    { title: 'Inicio', description: 'Página principal del sitio', icon: 'home', url: '/' },
    { title: 'La UNP', description: 'Conoce nuestra institución', icon: 'account_balance', url: '/la-unp' },
    { title: 'Transparencia', description: 'Accede a información pública', icon: 'visibility', url: '/transparencia' },
    { title: 'Normativa', description: 'Consulta el marco legal', icon: 'gavel', url: '/normativa' },
    { title: 'Noticias', description: 'Últimas novedades e información institucional', icon: 'article', url: '/noticias' },
    { title: 'Trámites y servicios', description: 'Consulta procedimientos y servicios de atención', icon: 'assignment', url: '/atencion-servicios/tramites' },
    { title: 'Línea Vida 103', description: 'Canal de atención y apoyo', icon: 'phone', url: '/linea-vida-103' },
    { title: 'PQRSD', description: 'Presenta tus solicitudes, quejas y felicitaciones', icon: 'send', url: '/pqrsd' },
    { title: 'Contacto', description: 'Información de contacto institucional', icon: 'phone', url: '/contacto' }
  ];

  private searchIndex: SearchResult[] = [...this.staticDatabase];

  public searchQuery = signal<string>('');
  public searchResults = signal<SearchResult[]>([]);
  public showSearchResults = signal<boolean>(false);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('unp-editorial-news-changed', () => this.loadSearchIndex());
    }

    this.loadSearchIndex();
  }

  private loadSearchIndex(): void {
    forkJoin({
      noticias: this.dataService.getNoticias(),
      normativa: this.dataService.getNormativaDocumentos(),
      accesos: this.dataService.getAccesosRapidos(),
      faq: this.dataService.getFAQ(),
      canales: this.dataService.getCanalesAtencion(),
      tramites: this.dataService.getTramites()
    }).pipe(
      map(({ noticias, normativa, accesos, faq, canales, tramites }) => {
        const dynamicEntries: SearchResult[] = [
          ...noticias.map((noticia) => ({
            title: noticia.titulo,
            description: noticia.resumen,
            icon: 'article',
            url: `/noticias/${noticia.slug ?? noticia.id}`
          })),
          ...normativa.map((documento) => ({
            title: documento.titulo,
            description: documento.descripcion,
            icon: 'gavel',
            url: documento.url
          })),
          ...accesos.map((item) => ({
            title: item.titulo,
            description: item.descripcion,
            icon: item.icono,
            url: item.enlace
          })),
          ...faq.map((item) => ({
            title: item.pregunta,
            description: item.respuesta,
            icon: 'help_outline',
            url: '/atencion-servicios/tramites'
          })),
          ...canales.map((item) => ({
            title: item.tipo,
            description: item.descripcion,
            icon: item.icono,
            url: '/atencion-servicios/tramites'
          })),
          ...tramites.map((tramite) => ({
            title: tramite.nombre,
            description: tramite.descripcion,
            icon: 'assignment',
            url: '/atencion-servicios/tramites'
          }))
        ];

        const deduplicatedEntries = [...this.staticDatabase, ...dynamicEntries].filter((entry, index, array) => {
          return array.findIndex((item) => item.title === entry.title && item.url === entry.url) === index;
        });

        this.searchIndex = deduplicatedEntries;
      })
    ).subscribe();
  }

  performSearch(query: string): Observable<SearchResult[]> {
    const normalizedQuery = this.normalize(query).trim();

    if (normalizedQuery.length < 2) {
      this.searchResults.set([]);
      this.showSearchResults.set(false);
      return of([]);
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const results = this.searchIndex
      .filter((item) => {
        const haystack = this.normalize(`${item.title} ${item.description} ${item.url}`);
        return tokens.every((token) => haystack.includes(token));
      })
      .slice(0, 8);

    this.searchResults.set(results);
    this.showSearchResults.set(results.length > 0);
    return of(results);
  }

  selectResult(result: SearchResult): void {
    this.searchQuery.set(result.title);
    this.showSearchResults.set(false);
    this.router.navigateByUrl(result.url);
  }

  hideResults(): void {
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 200);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showSearchResults.set(false);
  }

  private normalize(value: string): string {
    return value
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
