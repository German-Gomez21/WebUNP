import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SearchResult } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  // Base de datos de búsqueda migrada desde AngularJS
  private readonly searchDatabase: SearchResult[] = [
    { title: 'PQRSD', description: 'Presenta tus solicitudes', icon: 'send', url: '/atencion/pqrsd' },
    { title: 'La UNP', description: 'Conoce nuestra institución', icon: 'account_balance', url: '/la-unp' },
    { title: 'Transparencia', description: 'Accede a información pública', icon: 'visibility', url: '/transparencia' },
    { title: 'Normativa', description: 'Consulta el marco legal', icon: 'gavel', url: '/normativa' },
    { title: 'Director', description: 'Información del director', icon: 'person', url: '/la-unp/director' },
    { title: '¿Quiénes somos?', description: 'Misión y visión', icon: 'help_outline', url: '/la-unp/quienes-somos' },
    { title: '¿Qué hacemos?', description: 'Nuestras funciones', icon: 'work', url: '/la-unp/que-hacemos' },
    { title: 'Sede Principal', description: 'Ubicación y contacto', icon: 'location_on', url: '/la-unp/sede-principal' },
    { title: 'Sedes Regionales', description: 'Oficinas en el país', icon: 'location_city', url: '/la-unp/sedes-regionales' },
    { title: 'Noticias', description: 'Últimas novedades', icon: 'article', url: '/noticias' },
    { title: 'Contratación', description: 'Procesos de contratación', icon: 'description', url: '/transparencia/contratacion' },
    { title: 'Convocatorias', description: 'Oportunidades laborales', icon: 'work_outline', url: '/atencion/convocatorias' },
    { title: 'Trámites', description: 'Servicios y trámites', icon: 'assignment', url: '/atencion/tramites' },
    { title: 'Servicios', description: 'Oferta de servicios', icon: 'miscellaneous_services', url: '/atencion/servicios' },
    { title: 'Contacto', description: 'Información de contacto', icon: 'phone', url: '/contacto' },
    { title: 'Petición', description: 'Solicita información', icon: 'search', url: '/atencion/pqrsd/peticion' },
    { title: 'Queja', description: 'Reporta conductas', icon: 'warning', url: '/atencion/pqrsd/queja' },
    { title: 'Reclamo', description: 'Solicita soluciones', icon: 'report_problem', url: '/atencion/pqrsd/reclamo' },
    { title: 'Sugerencia', description: 'Envía propuestas', icon: 'lightbulb', url: '/atencion/pqrsd/sugerencia' },
    { title: 'Denuncia', description: 'Reporta irregularidades', icon: 'gavel', url: '/atencion/pqrsd/denuncia' }
  ];

  // Signals para estado reactivo de búsqueda
  public searchQuery = signal<string>('');
  public searchResults = signal<SearchResult[]>([]);
  public showSearchResults = signal<boolean>(false);

  constructor() {}

  // Método de búsqueda migrado desde AngularJS
  performSearch(query: string): Observable<SearchResult[]> {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (normalizedQuery.length < 2) {
      this.searchResults.set([]);
      this.showSearchResults.set(false);
      return of([]);
    }

    // Filtrar resultados
    const results = this.searchDatabase.filter(item => 
      item.title.toLowerCase().includes(normalizedQuery) || 
      item.description.toLowerCase().includes(normalizedQuery)
    ).slice(0, 5); // Limitar a 5 resultados

    // Actualizar signals
    this.searchResults.set(results);
    this.showSearchResults.set(true);

    return of(results);
  }

  // Seleccionar resultado de búsqueda
  selectResult(result: SearchResult): void {
    this.searchQuery.set(result.title);
    this.showSearchResults.set(false);
    
    // Navegación (implementar con Router)
    window.location.href = result.url;
  }

  // Ocultar resultados
  hideResults(): void {
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 200);
  }

  // Limpiar búsqueda
  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showSearchResults.set(false);
  }
}
