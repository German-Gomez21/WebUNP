import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  PqrsdAccesoRapido,
  PqrsdCanal,
  PqrsdDocumento,
  PqrsdFaqItem,
  PqrsdInforme,
  PqrsdPaso,
  PqrsdTipo
} from '../models/pqrsd.model';

@Injectable({ providedIn: 'root' })
export class PqrsdService {
  getAccesosRapidos(): Observable<PqrsdAccesoRapido[]> {
    return of([
      {
        id: 1,
        titulo: 'Radicar una PQRSD',
        descripcion: 'Use el canal virtual para presentar su solicitud de forma guiada.',
        icono: 'send',
        enlace: '#radicacion',
        tipo: 'primario',
        destacado: true
      },
      {
        id: 2,
        titulo: 'Consultar estado',
        descripcion: 'Revise el estado de su solicitud y los tiempos de respuesta.',
        icono: 'search',
        enlace: '#ruta',
        tipo: 'secundario'
      },
      {
        id: 3,
        titulo: 'Carta de trato digno',
        descripcion: 'Conozca los derechos y deberes de la atención ciudadana.',
        icono: 'gavel',
        enlace: '#trato-digno',
        tipo: 'secundario'
      },
      {
        id: 4,
        titulo: 'Línea Vida 103',
        descripcion: 'Acceso inmediato a orientación y apoyo para situaciones de riesgo.',
        icono: 'phone_in_talk',
        enlace: '/linea-vida-103',
        tipo: 'secundario'
      }
    ]);
  }

  getTipos(): Observable<PqrsdTipo[]> {
    return of([
      {
        id: 1,
        titulo: 'Peticiones',
        descripcion: 'Solicitudes de información, documentos o trámites.',
        icono: 'description',
        ejemplo: 'Solicitud de información o copia de documentos.'
      },
      {
        id: 2,
        titulo: 'Quejas',
        descripcion: 'Señalamientos sobre una actuación, omisión o servicio deficiente.',
        icono: 'report_problem',
        ejemplo: 'Inconformidad con la atención recibida.'
      },
      {
        id: 3,
        titulo: 'Reclamos',
        descripcion: 'Manifestaciones por presuntas irregularidades o incumplimientos.',
        icono: 'feedback',
        ejemplo: 'Solicitud de corrección frente a una actuación.'
      },
      {
        id: 4,
        titulo: 'Sugerencias',
        descripcion: 'Propuestas para mejorar los servicios o los procesos.',
        icono: 'lightbulb',
        ejemplo: 'Ideas para fortalecer la atención ciudadana.'
      },
      {
        id: 5,
        titulo: 'Denuncias',
        descripcion: 'Reportes de conductas irregulares o hechos que requieran seguimiento.',
        icono: 'security',
        ejemplo: 'Situaciones que afecten derechos o procedimientos.'
      },
      {
        id: 6,
        titulo: 'Solicitudes anónimas',
        descripcion: 'Casos en los que no se disponga de datos del solicitante.',
        icono: 'visibility_off',
        ejemplo: 'Radicación sin datos de identificación.'
      }
    ]);
  }

  getPasos(): Observable<PqrsdPaso[]> {
    return of([
      {
        id: 1,
        titulo: 'Identifique su solicitud',
        descripcion: 'Seleccione la categoría que mejor corresponda a su necesidad.',
        detalle: 'Si no está seguro, use el canal de orientación y el equipo de atención le indicará la ruta adecuada.'
      },
      {
        id: 2,
        titulo: 'Prepare sus datos',
        descripcion: 'Tenga a mano su identificación y los soportes relacionados.',
        detalle: 'En caso de anonimato, puede radicar la solicitud sin datos de contacto.'
      },
      {
        id: 3,
        titulo: 'Radique por el canal oficial',
        descripcion: 'Envíe la solicitud a través del canal virtual o el canal prescrito.',
        detalle: 'Recibirá un número de radicado para realizar seguimiento.'
      },
      {
        id: 4,
        titulo: 'Consulte y haga seguimiento',
        descripcion: 'Revise el estado de su solicitud y las respuestas emitidas.',
        detalle: 'Si la respuesta no satisface su solicitud, podrá solicitar revisión dentro de los tiempos definidos.'
      }
    ]);
  }

  getCanales(): Observable<PqrsdCanal[]> {
    return of([
      {
        id: 1,
        titulo: 'Canal virtual',
        descripcion: 'Ruta principal para presentar y consultar su solicitud.',
        icono: 'language',
        enlace: '#radicacion',
        etiqueta: 'Recomendado'
      },
      {
        id: 2,
        titulo: 'Correo institucional',
        descripcion: 'Use el correo oficial cuando la solicitud requiera soporte adicional.',
        icono: 'mail',
        enlace: undefined,
        etiqueta: 'Consulte la guía institucional'
      },
      {
        id: 3,
        titulo: 'Atención telefónica',
        descripcion: 'Orientación general sobre el trámite y canales disponibles.',
        icono: 'call',
        enlace: '/linea-vida-103',
        etiqueta: 'Línea Vida 103'
      },
      {
        id: 4,
        titulo: 'Directorio y sedes',
        descripcion: 'Información de contacto y ubicaciones de atención.',
        icono: 'location_on',
        enlace: '/la-unp',
        etiqueta: 'Consulta la información institucional'
      }
    ]);
  }

  getDocumentos(): Observable<PqrsdDocumento[]> {
    return of([
      {
        id: 1,
        titulo: 'Procedimiento de PQRSD',
        descripcion: 'Información general sobre la ruta y los tiempos de respuesta.',
        icono: 'rule',
        enlace: undefined,
        estado: 'proximamente'
      },
      {
        id: 2,
        titulo: 'Carta de trato digno',
        descripcion: 'Documento institucional que orienta la atención al ciudadano.',
        icono: 'article',
        enlace: '#trato-digno',
        estado: 'disponible'
      },
      {
        id: 3,
        titulo: 'Formatos y guías',
        descripcion: 'Orientación para completar la solicitud y preparar soportes.',
        icono: 'description',
        enlace: undefined,
        estado: 'proximamente'
      },
      {
        id: 4,
        titulo: 'Normatividad relacionada',
        descripcion: 'Referencias normativas aplicables al trámite.',
        icono: 'gavel',
        enlace: undefined,
        estado: 'proximamente'
      }
    ]);
  }

  getInformes(): Observable<PqrsdInforme[]> {
    return of([
      {
        id: 1,
        periodo: '2024',
        titulo: 'Informe de gestión de PQRSD',
        descripcion: 'Resumen de solicitudes recibidas, respuesta y seguimiento.',
        enlace: undefined,
        estado: 'proximamente'
      },
      {
        id: 2,
        periodo: '2023',
        titulo: 'Informe consolidado',
        descripcion: 'Análisis de tendencias y canales utilizados por los ciudadanos.',
        enlace: undefined,
        estado: 'proximamente'
      }
    ]);
  }

  getFaq(): Observable<PqrsdFaqItem[]> {
    return of([
      {
        id: 1,
        pregunta: '¿Qué diferencia hay entre una queja y un reclamo?',
        respuesta: 'Una queja señala una inconformidad frente a la atención o a una actuación. Un reclamo busca corregir una presunta irregularidad o incumplimiento.'
      },
      {
        id: 2,
        pregunta: '¿Puedo radicar una solicitud sin datos de contacto?',
        respuesta: 'Sí, cuando la solicitud sea anónima o no se cuente con información suficiente para identificar al solicitante. La entidad evaluará la viabilidad del trámite.'
      },
      {
        id: 3,
        pregunta: '¿Cuánto tiempo tarda una respuesta?',
        respuesta: 'El tiempo de respuesta depende del tipo de solicitud y de los soportes aportados. La ruta institucional define los plazos aplicables.'
      },
      {
        id: 4,
        pregunta: '¿Cómo puedo hacer seguimiento a mi solicitud?',
        respuesta: 'Debe conservar el número de radicado y consultar el canal oficial de seguimiento o el canal de atención asignado.'
      }
    ]);
  }
}
