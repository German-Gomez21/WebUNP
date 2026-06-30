import { Injectable, signal } from '@angular/core';
import { Noticia } from '../models/noticia.model';

export type EditorialStatus = 'borrador' | 'en_revision' | 'aprobado' | 'programado' | 'publicado' | 'archivado' | 'rechazado';

export interface AuditEntry {
  usuario: string;
  accion: string;
  fecha: string;
  detalle?: string;
}

export interface EditorialNoticia extends Noticia {
  estado: EditorialStatus;
  fechaPublicacion?: string;
  dependencia?: string;
  seoTitle?: string;
  seoDescription?: string;
  version?: number;
  auditoria?: AuditEntry[];
  revisadoPor?: string;
  requiereRevision?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminNewsService {
  private readonly editorialNews = signal<EditorialNoticia[]>([
    {
      id: 1,
      titulo: 'UNP fortalece programa de protección para líderes sociales',
      fecha: '2026-06-15',
      resumen: 'Se implementan nuevas medidas de acompañamiento para personas en riesgo con enfoque territorial y preventivo.',
      categoria: 'Protección',
      imagen: 'assets/images/hero-protection.jpg',
      slug: 'unp-fortalece-programa-de-proteccion-para-lideres-sociales',
      subtitulo: 'Nuevas medidas para defensores y líderes sociales',
      contenido: 'La UNP presenta un nuevo esquema de acompañamiento técnico y operativo para ampliar la protección de líderes sociales.',
      autor: 'Oficina de Comunicaciones',
      etiquetas: ['Protección', 'Seguridad'],
      destacada: true,
      tipo: 'destacada',
      contenidoHtml: '<p>La UNP presenta un nuevo esquema de acompañamiento técnico y operativo.</p>',
      estado: 'publicado',
      fechaPublicacion: '2026-06-15',
      dependencia: 'Comunicaciones',
      seoTitle: 'Programa de protección para líderes sociales',
      seoDescription: 'Conozca las nuevas medidas del programa de protección de la UNP para líderes sociales.',
      version: 3,
      auditoria: [
        { usuario: 'Editor Senior', accion: 'publicado', fecha: '2026-06-15', detalle: 'Publicación autorizada' }
      ],
      revisadoPor: 'Coordinación editorial',
      requiereRevision: true
    },
    {
      id: 2,
      titulo: 'Convocatoria abierta para esquema de protección colectiva',
      fecha: '2026-06-12',
      resumen: 'Se habilita el proceso digital para que comunidades y organizaciones soliciten medidas de protección colectiva.',
      categoria: 'Convocatorias',
      imagen: 'assets/images/complaint-office.jpg',
      slug: 'convocatoria-abierta-para-esquema-de-proteccion-colectiva',
      subtitulo: 'Proceso digital para comunidades en riesgo',
      contenido: 'La convocatoria busca ampliar el acceso a medidas de protección colectiva para comunidades que enfrentan situaciones de riesgo.',
      autor: 'Subdirección de Atención',
      etiquetas: ['Convocatorias', 'Protección colectiva'],
      contenidoHtml: '<p>Se habilita el proceso digital para la solicitud de medidas de protección colectiva.</p>',
      estado: 'en_revision',
      fechaPublicacion: '2026-06-20',
      dependencia: 'Atención ciudadana',
      seoTitle: 'Convocatoria de protección colectiva',
      seoDescription: 'Conozca el proceso para solicitar medidas de protección colectiva ante la UNP.',
      version: 2,
      auditoria: [
        { usuario: 'Editor', accion: 'creado', fecha: '2026-06-12', detalle: 'Borrador cargado' },
        { usuario: 'Revisor', accion: 'revision', fecha: '2026-06-13', detalle: 'Pendiente de aprobación' }
      ],
      requiereRevision: true
    },
    {
      id: 3,
      titulo: 'La UNP amplía su red de acompañamiento territorial',
      fecha: '2026-06-08',
      resumen: 'Nuevos equipos de apoyo reforzarán la presencia institucional en regiones de alta prioridad.',
      categoria: 'Territorio',
      imagen: 'assets/images/hero-linea-vida.jpg',
      slug: 'la-unp-amplia-su-red-de-acompanamiento-territorial',
      subtitulo: 'Mayor cobertura en regiones prioritarias',
      contenido: 'La red territorial se fortalecerá para acercar servicios de acompañamiento a las regiones con mayor demanda.',
      autor: 'Coordinación Territorial',
      etiquetas: ['Territorio', 'Cobertura'],
      contenidoHtml: '<p>La red territorial se fortalecerá para acercar servicios de acompañamiento.</p>',
      estado: 'programado',
      fechaPublicacion: '2026-06-30',
      dependencia: 'Territorio',
      seoTitle: 'Red de acompañamiento territorial',
      seoDescription: 'La UNP amplía su red de acompañamiento territorial.',
      version: 1,
      auditoria: [
        { usuario: 'Editor Senior', accion: 'programado', fecha: '2026-06-08', detalle: 'Publicado automáticamente el 30/06/2026' }
      ],
      requiereRevision: true
    }
  ]);

  getNoticias(): EditorialNoticia[] {
    return this.editorialNews();
  }

  getStats() {
    const noticias = this.editorialNews();
    return {
      publicadas: noticias.filter(item => item.estado === 'publicado').length,
      borradores: noticias.filter(item => item.estado === 'borrador').length,
      programadas: noticias.filter(item => item.estado === 'programado').length,
      archivadas: noticias.filter(item => item.estado === 'archivado').length,
      revision: noticias.filter(item => item.estado === 'en_revision' || item.estado === 'rechazado').length
    };
  }

  getById(id: number): EditorialNoticia | undefined {
    return this.editorialNews().find(item => item.id === id);
  }

  save(noticia: EditorialNoticia): EditorialNoticia {
    const existing = this.editorialNews().find(item => item.id === noticia.id);

    if (existing) {
      const updated: EditorialNoticia = {
        ...existing,
        ...noticia,
        version: (existing.version ?? 1) + 1,
        auditoria: [
          ...(existing.auditoria ?? []),
          {
            usuario: noticia.revisadoPor ?? 'Editor',
            accion: noticia.estado,
            fecha: noticia.fechaPublicacion ?? new Date().toISOString(),
            detalle: 'Actualización desde el panel editorial'
          }
        ]
      };

      this.editorialNews.update(items => items.map(item => item.id === noticia.id ? updated : item));
      return updated;
    }

    const created: EditorialNoticia = {
      ...noticia,
      id: Date.now(),
      version: 1,
      auditoria: [
        {
          usuario: noticia.revisadoPor ?? 'Editor',
          accion: 'creado',
          fecha: new Date().toISOString(),
          detalle: 'Nueva noticia creada desde el panel editorial'
        }
      ]
    };

    this.editorialNews.update(items => [created, ...items]);
    return created;
  }

  updateStatus(id: number, estado: EditorialStatus): void {
    const current = this.getById(id);
    if (!current) {
      return;
    }

    const updated: EditorialNoticia = {
      ...current,
      estado,
      version: (current.version ?? 1) + 1,
      auditoria: [
        ...(current.auditoria ?? []),
        {
          usuario: 'Sistema',
          accion: estado,
          fecha: new Date().toISOString(),
          detalle: 'Cambio de estado ejecutado desde el panel'
        }
      ]
    };

    this.editorialNews.update(items => items.map(item => item.id === id ? updated : item));
  }
}
