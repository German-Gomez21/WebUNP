import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Noticia,
  AccesoRapido,
  FAQItem,
  CanalAtencion,
  InstitucionInfo,
  HeroData,
  BannerPrincipal,
  SeccionInformativa,
  Tramite,
  CanalAtencionDetalle
} from '../models/noticia.model';

export interface NormativaDocumento {
  id: number;
  titulo: string;
  categoria: string;
  tipo: string;
  numero: string;
  fecha: string;
  descripcion: string;
  estado: string;
  dependencia: string;
  formato: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // En producción, esto sería la URL real del API
  private readonly API_BASE_URL = 'https://api.unp.gov.co';

  constructor(private http: HttpClient) { }

  // Método para obtener noticias - migrado de $q.when a Observable
  getNoticias(): Observable<Noticia[]> {
    // Simulación de datos mock con Observable
    return of([
      {
        id: 1,
        titulo: "UNP fortalece programa de protección para líderes sociales",
        fecha: "2024-04-15",
        resumen: "La Unidad Nacional de Protección anuncia nuevas medidas para garantizar la seguridad de líderes y defensores de derechos humanos en todo el territorio nacional.",
        categoria: "Protección",
        imagen: "assets/images/hero-protection.jpg",
        slug: "unp-fortalece-programa-de-proteccion-para-lideres-sociales",
        subtitulo: "Nuevas medidas de seguridad para defensores y líderes sociales",
        contenido: "La Unidad Nacional de Protección presentó una nueva línea de acompañamiento técnico para fortalecer la seguridad integral de líderes sociales, defensores de derechos humanos y personas que participen en procesos de incidencia pública. La medida incluye reforzamiento de protocolos, actualización de herramientas de seguimiento y mayor coordinación interinstitucional.",
        autor: "Oficina de Comunicaciones",
        etiquetas: ["Protección", "Seguridad", "Líderes sociales"],
        destacada: true,
        tipo: 'destacada' as const,
        contenidoHtml: "<p>La Unidad Nacional de Protección presentó una nueva línea de acompañamiento técnico para fortalecer la seguridad integral de líderes sociales, defensores de derechos humanos y personas que participen en procesos de incidencia pública.</p><p>La medida incluye reforzamiento de protocolos, actualización de herramientas de seguimiento y mayor coordinación interinstitucional con entidades territoriales y nacionales.</p>"
      },
      {
        id: 2,
        titulo: "Convocatoria abierta para esquema de protección colectiva",
        fecha: "2024-04-12",
        resumen: "Comunidades y organizaciones pueden solicitar medidas de protección colectiva a través del nuevo proceso digital implementado por la UNP.",
        categoria: "Convocatorias",
        imagen: "assets/images/complaint-office.jpg",
        slug: "convocatoria-abierta-para-esquema-de-proteccion-colectiva",
        subtitulo: "Proceso digital para comunidades y organizaciones",
        contenido: "La convocatoria tiene como propósito ampliar el acceso a medidas de protección colectiva para comunidades que afrontan situaciones de riesgo. La UNP habilitó un proceso digital para la presentación de solicitudes y seguimiento de trámites.",
        autor: "Subdirección de Atención",
        etiquetas: ["Convocatorias", "Protección colectiva"],
        contenidoHtml: "<p>La convocatoria tiene como propósito ampliar el acceso a medidas de protección colectiva para comunidades que afrontan situaciones de riesgo.</p><p>La UNP habilitó un proceso digital para la presentación de solicitudes y seguimiento de trámites, lo que reduce tiempos de respuesta y mejora la trazabilidad.</p>"
      },
      {
        id: 3,
        titulo: "Informe de gestión 2024: más de 8.000 personas protegidas",
        fecha: "2024-04-10",
        resumen: "La entidad presenta resultados del primer trimestre del año, destacando el aumento en la cobertura del programa de protección.",
        categoria: "Gestión",
        imagen: "assets/images/transparency-office.jpg",
        slug: "informe-de-gestion-2024-mas-de-8000-personas-protegidas",
        subtitulo: "Cobertura del programa crece en todo el país",
        contenido: "El informe de gestión 2024 evidencia el fortalecimiento de la cobertura del programa de protección, con un incremento en el número de personas atendidas y en la implementación de medidas coordinadas con autoridades locales.",
        autor: "Unidad de Planeación",
        etiquetas: ["Gestión", "Indicadores"],
        contenidoHtml: "<p>El informe de gestión 2024 evidencia el fortalecimiento de la cobertura del programa de protección, con un incremento en el número de personas atendidas.</p><p>También se reporta un avance importante en la implementación de medidas coordinadas con autoridades locales y entidades de seguridad.</p>"
      },
      {
        id: 4,
        titulo: "Nuevo protocolo de atención en emergencias",
        fecha: "2024-04-08",
        resumen: "Se implementa un sistema de respuesta rápida para situaciones de riesgo que amenacen a personas bajo esquema de protección.",
        categoria: "Protocolos",
        imagen: "assets/images/protection-special.jpg",
        slug: "nuevo-protocolo-de-atencion-en-emergencias",
        subtitulo: "Respuesta rápida en situaciones de alto riesgo",
        contenido: "Con el fin de reducir tiempos de respuesta, la UNP implementó un protocolo actualizado para la atención de emergencias relacionadas con riesgo inminente, desprotección o eventos de alto impacto.",
        autor: "Dirección de Operaciones",
        etiquetas: ["Protocolos", "Emergencias"],
        contenidoHtml: "<p>Con el fin de reducir tiempos de respuesta, la UNP implementó un protocolo actualizado para la atención de emergencias relacionadas con riesgo inminente.</p><p>El protocolo contempla protocolos de coordinación, despliegue y evaluación inmediata para eventos de alto impacto.</p>"
      },
      {
        id: 5,
        titulo: "UNP certifica 500 funcionarios en derechos humanos",
        fecha: "2024-04-05",
        resumen: "Personal de la unidad completa programa de formación internacional para mejorar la atención a personas en situación de riesgo.",
        categoria: "Formación",
        imagen: "assets/images/confidential-identity.jpg",
        slug: "unp-certifica-500-funcionarios-en-derechos-humanos",
        subtitulo: "Capacitación especializada para la atención integral",
        contenido: "Cinco cientos de funcionarios de la UNP culminaron un ciclo formativo especializado en derechos humanos, protección de personas en riesgo y respuesta a situaciones de vulnerabilidad.",
        autor: "Escuela de Formación",
        etiquetas: ["Formación", "Capacitación"],
        contenidoHtml: "<p>Cinco cientos de funcionarios de la UNP culminaron un ciclo formativo especializado en derechos humanos, protección de personas en riesgo y respuesta a situaciones de vulnerabilidad.</p><p>La formación fortalece capacidades técnicas, éticas y operativas en todo el país.</p>"
      },
      {
        id: 6,
        titulo: "La UNP amplía su red de acompañamiento territorial",
        fecha: "2024-03-28",
        resumen: "Nuevos equipos de apoyo reforzarán la presencia institucional en regiones con mayor demanda de protección.",
        categoria: "Territorio",
        imagen: "assets/images/hero-linea-vida.jpg",
        slug: "la-unp-amplia-su-red-de-acompanamiento-territorial",
        subtitulo: "Mayor cobertura en regiones de alta prioridad",
        contenido: "La UNP ha ampliado su red de acompañamiento territorial para garantizar una respuesta más cercana y oportuna en regiones de alta prioridad.",
        autor: "Coordinación Territorial",
        etiquetas: ["Territorio", "Cobertura"],
        contenidoHtml: "<p>La UNP ha ampliado su red de acompañamiento territorial para garantizar una respuesta más cercana y oportuna en regiones de alta prioridad.</p><p>La estrategia busca fortalecer la coordinación con autoridades locales y mejorar el acceso a los servicios de protección.</p>"
      }
    ]).pipe(delay(10));
  }

  getNoticiaBySlug(slug: string): Observable<Noticia | undefined> {
    return this.getNoticias().pipe(
      map(noticias => noticias.find(noticia => noticia.slug === slug))
    );
  }

  getNormativaDocumentos(): Observable<NormativaDocumento[]> {
    return of([
      {
        id: 1,
        titulo: 'Ley 1099 de 2006 - Ley de Atención Integral a la Primera Infancia',
        categoria: 'Leyes y Decretos',
        tipo: 'Ley',
        numero: 'Ley 1099 de 2006',
        fecha: '2006-01-01',
        descripcion: 'Marco general de protección y desarrollo de la infancia, con incidencia en la atención y coordinación institucional.',
        estado: 'Vigente',
        dependencia: 'UNP',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/normativa/leyes-y-decretos/'
      },
      {
        id: 2,
        titulo: 'Decreto 1066 de 2015 - Decreto Único Reglamentario Sectorial',
        categoria: 'Leyes y Decretos',
        tipo: 'Decreto',
        numero: 'Decreto 1066 de 2015',
        fecha: '2015-05-26',
        descripcion: 'Normativa sectorial reglamentaria aplicada a la organización, administración y control de la entidad.',
        estado: 'Vigente',
        dependencia: 'Presidencia',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/normativa/decreto-unico-sectorial-decreto-1066-%E2%80%8B-26-%E2%80%8B%E2%80%8Bde-mayo-2%E2%80%8B015/'
      },
      {
        id: 3,
        titulo: 'Resolución de políticas de protección de la información',
        categoria: 'Resoluciones',
        tipo: 'Resolución',
        numero: 'Resolución 001 de 2024',
        fecha: '2024-03-15',
        descripcion: 'Lineamientos internos para la gestión, manejo y cifrado de información sensible y de seguridad institucional.',
        estado: 'Vigente',
        dependencia: 'UNP',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/normativa/resoluciones-y-circulares/'
      },
      {
        id: 4,
        titulo: 'Política de Seguridad de la Información y Protección de Datos Personales',
        categoria: 'Políticas',
        tipo: 'Política',
        numero: 'PSI-001',
        fecha: '2025-05-01',
        descripcion: 'Directriz institucional para la protección de datos personales, manejo seguro de información y respuesta a incidentes.',
        estado: 'Vigente',
        dependencia: 'UNP',
        formato: 'HTML',
        url: 'https://www.unp.gov.co/normativa/politicas-de-seguridad-de-la-informacion-y-proteccion-de-datos-personales/'
      },
      {
        id: 5,
        titulo: 'Plan Estratégico de la Unidad Nacional de Protección',
        categoria: 'Políticas',
        tipo: 'Plan',
        numero: 'PE-2025',
        fecha: '2025-02-12',
        descripcion: 'Plan institucional orientado al fortalecimiento de la protección, la innovación y la mejora continua del servicio.',
        estado: 'Activo',
        dependencia: 'UNP',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/'
      },
      {
        id: 6,
        titulo: 'Normograma institucional de la UNP',
        categoria: 'Normograma',
        tipo: 'Normograma',
        numero: 'NORM-001',
        fecha: '2026-01-20',
        descripcion: 'Registro consolidado de normas, disposiciones, directrices y proyectos normativos vigentes para consulta rápida.',
        estado: 'Actualizado',
        dependencia: 'SUIJ',
        formato: 'HTML',
        url: 'https://www.unp.gov.co/normativa/normograma/'
      },
      {
        id: 7,
        titulo: 'Circular externa de coordinación con autoridades competentes',
        categoria: 'Resoluciones',
        tipo: 'Circular',
        numero: 'Circular 018 de 2025',
        fecha: '2025-07-10',
        descripcion: 'Circular que consolida lineamientos para la coordinación interinstitucional y la atención prioritaria de casos.',
        estado: 'Vigente',
        dependencia: 'Ministerio del Interior',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/normativa/resoluciones-y-circulares/'
      },
      {
        id: 8,
        titulo: 'Manual de seguridad y cumplimiento institucional',
        categoria: 'Políticas',
        tipo: 'Manual',
        numero: 'MS-2025',
        fecha: '2025-09-18',
        descripcion: 'Manual técnico para el cumplimiento de protocolos de seguridad, control interno y respuesta a riesgos.',
        estado: 'Vigente',
        dependencia: 'SUCOP',
        formato: 'PDF',
        url: 'https://www.unp.gov.co/'
      }
    ]).pipe(delay(20));
  }

  getCategorias(): Observable<{ id: string; nombre: string }[]> {
    return of([
      { id: 'todas', nombre: 'Todas las categorías' },
      { id: 'proteccion', nombre: 'Protección' },
      { id: 'convocatorias', nombre: 'Convocatorias' },
      { id: 'gestion', nombre: 'Gestión' },
      { id: 'protocolos', nombre: 'Protocolos' },
      { id: 'formacion', nombre: 'Formación' },
      { id: 'territorio', nombre: 'Territorio' }
    ]).pipe(delay(0));
  }

  getNoticiasRelacionadas(slug: string, categoria: string): Observable<Noticia[]> {
    return this.getNoticias().pipe(
      map(noticias => noticias.filter(noticia => noticia.slug !== slug && noticia.categoria === categoria).slice(0, 3))
    );
  }

  // Datos de accesos rápidos
  getAccesosRapidos(): Observable<AccesoRapido[]> {
    return of([
      {
        id: 1,
        titulo: "Trámites",
        descripcion: "Solicita y consulta tus trámites de protección",
        icono: "assets/icons/tramites.svg",
        enlace: "/atencion-servicios/tramites",
        color: "#3366CC"
      },
      {
        id: 2,
        titulo: "Atención al ciudadano",
        descripcion: "Canales de comunicación y apoyo",
        icono: "assets/icons/atencion.svg",
        enlace: "/atencion",
        color: "#28A745"
      },
      {
        id: 3,
        titulo: "Noticias",
        descripcion: "Información relevante de la UNP",
        icono: "assets/icons/noticias.svg",
        enlace: "/noticias",
        color: "#FF6B35"
      },
      {
        id: 4,
        titulo: "Directorio",
        descripcion: "Contactos y sedes nacionales",
        icono: "assets/icons/directorio.svg",
        enlace: "/directorio",
        color: "#6C757D"
      },
      {
        id: 5,
        titulo: "Transparencia",
        descripcion: "Información pública y rendición de cuentas",
        icono: "assets/icons/transparencia.svg",
        enlace: "/transparencia",
        color: "#17A2B8"
      },
      {
        id: 6,
        titulo: "Preguntas frecuentes",
        descripcion: "Resuelve tus dudas sobre nuestros servicios",
        icono: "assets/icons/faq.svg",
        enlace: "/faq",
        color: "#6F42C1"
      }
    ]).pipe(delay(30)); // Reducido de 200ms
  }

  // Datos de FAQ
  getFAQ(): Observable<FAQItem[]> {
    return of([
      {
        id: 1,
        pregunta: "¿Quién puede solicitar protección de la UNP?",
        respuesta: "Pueden solicitar protección personas que se encuentren en situación de riesgo extraordinario debido a su actividad política, pública, social o humanitaria. Esto incluye líderes sociales, defensores de derechos humanos, funcionarios públicos, periodistas, entre otros."
      },
      {
        id: 2,
        pregunta: "¿Cómo realizo una solicitud de protección?",
        respuesta: "Puedes realizar tu solicitud a través de nuestros canales oficiales: línea telefónica nacional 01 8000 112 951, correo electrónico solicitud@unp.gov.co, o presencialmente en nuestras sedes a nivel nacional. También puedes iniciar el proceso a través de nuestra plataforma digital."
      },
      {
        id: 3,
        pregunta: "¿Qué documentos necesito para solicitar protección?",
        respuesta: "Debes presentar documento de identidad, declaración juramentada de los hechos de riesgo, pruebas que respalden tu situación (amenazas, atentados, hostigamiento), y cualquier otro documento que demuestre la vulnerabilidad de tu situación."
      },
      {
        id: 4,
        pregunta: "¿Cuánto tiempo toma el proceso de evaluación?",
        respuesta: "El proceso de evaluación puede tomar entre 15 y 30 días hábiles dependiendo de la complejidad del caso. En situaciones de riesgo inminente, se pueden adoptar medidas de protección inmediatas."
      },
      {
        id: 5,
        pregunta: "¿Qué tipo de medidas de protección ofrece la UNP?",
        respuesta: "Ofrecemos medidas de protección como escoltas, vehículos blindados, dispositivos de comunicación, seguridad en residencia y trabajo, traslados temporales, y apoyo psicosocial. Las medidas son personalizadas según el nivel de riesgo evaluado."
      }
    ]).pipe(delay(40)); // Reducido de 250ms
  }

  // Datos de canales de atención
  getCanalesAtencion(): Observable<CanalAtencion[]> {
    return of([
      {
        id: 1,
        tipo: "Línea Nacional",
        valor: "01 8000 112 951",
        descripcion: "Atención las 24 horas, los 7 días de la semana",
        icono: "phone"
      },
      {
        id: 2,
        tipo: "Correo Electrónico",
        valor: "contacto@unp.gov.co",
        descripcion: "Respuesta en máximo 48 horas hábiles",
        icono: "email"
      },
      {
        id: 3,
        tipo: "Dirección Nacional",
        valor: "Carrera 44 # 20-21 Bogotá D.C.",
        descripcion: "Horario de atención: Lunes a viernes 8:00 a.m. - 5:00 p.m.",
        icono: "location"
      },
      {
        id: 4,
        tipo: "Chat en Línea",
        valor: "Disponible en nuestra web",
        descripcion: "Lunes a viernes 8:00 a.m. - 6:00 p.m.",
        icono: "chat"
      }
    ]).pipe(delay(30)); // Reducido de 200ms
  }

  // Datos institucionales
  getInstitucionInfo(): Observable<InstitucionInfo> {
    return of({
      nombre: "Unidad Nacional de Protección",
      sigla: "UNP",
      mision: "Garantizar la protección integral de personas que se encuentren en situación de riesgo extraordinario, mediante la implementación de medidas de seguridad adecuadas y oportunas, para preservar la vida, integridad, libertad y seguridad de los protegidos.",
      vision: "Ser la entidad líder en protección de personas en riesgo, reconocida por su eficacia, transparencia y compromiso con los derechos humanos, contribuyendo a la construcción de una sociedad más justa y pacífica.",
      valores: ["Compromiso", "Transparencia", "Respeto", "Eficiencia", "Confidencialidad"],
      fundacion: "2011",
      naturaleza: "Entidad descentralizada del orden nacional, adscrita al Ministerio del Interior"
    }).pipe(delay(20)); // Reducido de 150ms
  }

  // Datos del Hero Section
  getHeroData(): Observable<HeroData> {
    return of({
      titulo: "Protección integral para quienes están en riesgo",
      subtitulo: "La Unidad Nacional de Protección garantiza la seguridad y el derecho a la vida de personas en situación de vulnerabilidad",
      botones: [
        {
          texto: "Solicitar protección",
          enlace: "/atencion-servicios/tramites",
          tipo: "primario" as const,
          aria: "Iniciar proceso de solicitud de protección"
        },
        {
          texto: "Línea vida 103",
          enlace: "/atencion-servicios/linea-vida-103",
          tipo: "secundario" as const,
          aria: "Llamar a línea vida 103"
        },
        {
          texto: "PQRSD",
          enlace: "/atencion-servicios/pqrsd",
          tipo: "terciario" as const,
          aria: "Presentar PQRSD"
        }
      ]
    }).pipe(delay(20)); // Reducido de 100ms
  }

  // Banners principales
  getBannersPrincipales(): Observable<BannerPrincipal[]> {
    return of([
      {
        titulo: "Línea Vida 103",
        descripcion: "Llama gratis las 24 horas para reportar situaciones de riesgo",
        icono: "phone",
        color: "#dc2626",
        enlace: "/linea-vida-103",
        destacado: true
      },
      {
        titulo: "Trámites y Servicios",
        descripcion: "Realiza tus solicitudes de protección en línea",
        icono: "description",
        color: "#dc2626",
        enlace: "/atencion-servicios/tramites",
        destacado: false
      },
      {
        titulo: "PQRSD",
        descripcion: "Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias",
        icono: "mail",
        color: "#dc2626",
        enlace: "/atencion-servicios/pqrsd",
        destacado: false
      }
    ]).pipe(delay(30)); // Reducido de 200ms
  }

  // Secciones informativas
  getSeccionesInformativas(): Observable<SeccionInformativa[]> {
    return of([
      {
        titulo: "La UNP",
        descripcion: "Conoce nuestra misión, visión y estructura organizacional",
        imagen: "assets/images/unp-institution.jpg",
        enlace: "/quienes-somos ",
        items: [
          "¿Quiénes somos?",
          "¿Qué hacemos?",
          "Organigrama",
          "Símbolos institucionales"
        ]
      },
      {
        titulo: "Transparencia",
        descripcion: "Accede a toda la información pública de la entidad",
        imagen: "assets/images/transparency-office.jpg",
        enlace: "/transparencia",
        items: [
          "Información de la entidad",
          "Contratación",
          "Planeación y presupuesto",
          "Datos abiertos"
        ]
      },
      {
        titulo: "Normativa",
        descripcion: "Consulta el marco legal que rige nuestra entidad",
        imagen: "assets/images/normativity-documents.jpg",
        enlace: "/normativa",
        items: [
          "Leyes y decretos",
          "Resoluciones",
          "Políticas",
          "Normograma"
        ]
      }
    ]).pipe(delay(40)); // Reducido de 250ms
  }

  // Obtener trámites y servicios
  getTramites(): Observable<Tramite[]> {
    return of([
      {
        id: 1,
        nombre: "Solicitud de Medidas de Protección Individual",
        descripcion: "Procedimiento para solicitar medidas de seguridad ante situaciones de riesgo extraordinario o extremo.",
        dirigidoA: "Personas en situación de vulnerabilidad, líderes sociales, periodistas, funcionarios, entre otros.",
        requisitos: [
          "Diligenciar formulario oficial",
          "Relato detallado de hechos de peligro",
          "Fotocopia de documento de identidad"
        ],
        documentos: [
          { nombre: "Formulario Solicitud Individual", url: "assets/docs/formulario_individual.pdf", tipo: 'pdf' as const },
          { nombre: "Guía de Usuario", url: "assets/docs/guia_solicitud.pdf", tipo: 'pdf' as const }
        ],
        modalidad: "Virtual y Presencial",
        tiempoRespuesta: "30 días hábiles para evaluación",
        costo: "Gratuito",
        normatividad: ["Decreto 1066 de 2015", "Resolución 0800 de 2022"],
        categoria: "Protección",
        linkTramite: "https://tramites.unp.gov.co/individual"
      },
      {
        id: 2,
        nombre: "Solicitud de Medidas de Protección Colectiva",
        descripcion: "Protección dirigida a comunidades, organizaciones y grupos poblacionales en riesgo.",
        dirigidoA: "Comunidades étnicas, organizaciones sociales, colectivos de derechos humanos.",
        requisitos: [
          "Documento de representación legal",
          "Acta de asamblea o solicitud grupal",
          "Descripción del contexto de riesgo territorial"
        ],
        documentos: [
          { nombre: "Formulario Solicitud Colectiva", url: "assets/docs/formulario_colectivo.pdf", tipo: 'pdf' as const }
        ],
        modalidad: "Presencial / Correo Electrónico",
        tiempoRespuesta: "45 días hábiles",
        costo: "Gratuito",
        normatividad: ["Decreto 660 de 2018"],
        categoria: "Protección",
        linkTramite: "correspondencia@unp.gov.co"
      },
      {
        id: 3,
        nombre: "PQRSD (Peticiones, Quejas, Reclamos, Sugerencias y Denuncias)",
        descripcion: "Canal oficial para manifestar inquietudes, quejas o agradecimientos sobre el servicio.",
        dirigidoA: "Ciudadanía en general",
        requisitos: [
          "Datos de contacto",
          "Descripción clara de la solicitud"
        ],
        documentos: [],
        modalidad: "Virtual",
        tiempoRespuesta: "15 días hábiles",
        costo: "Gratuito",
        normatividad: ["Ley 1755 de 2015"],
        categoria: "Atención Ciudadana",
        linkTramite: "/atencion-servicios/pqrsd"
      }
    ]).pipe(delay(50));
  }

  getCanalesAtencionDetalle(): Observable<CanalAtencionDetalle[]> {
    return of([
      {
        id: 1,
        tipo: "Línea Vida 103",
        valor: "Marque 103",
        descripcion: "Emergencias de seguridad 24/7",
        icono: "phone_in_talk",
        horario: "24 horas"
      },
      {
        id: 2,
        tipo: "Sede Principal Bogotá",
        valor: "Carrera 44 # 20-21 Bogotá D.C.",
        descripcion: "Atención al ciudadano personalizada",
        icono: "location_on",
        horario: "Lunes a Viernes 8:00 AM - 5:00 PM"
      },
      {
        id: 3,
        tipo: "Correo Electrónico",
        valor: "correspondencia@unp.gov.co",
        descripcion: "Radicación formal de documentos",
        icono: "email",
        horario: "Permanente"
      }
    ]).pipe(delay(30));
  }
}
