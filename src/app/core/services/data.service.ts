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
        imagen: "assets/images/noticia1.jpg"
      },
      {
        id: 2,
        titulo: "Convocatoria abierta para esquema de protección colectiva",
        fecha: "2024-04-12",
        resumen: "Comunidades y organizaciones pueden solicitar medidas de protección colectiva a través del nuevo proceso digital implementado por la UNP.",
        categoria: "Convocatorias",
        imagen: "assets/images/noticia2.jpg"
      },
      {
        id: 3,
        titulo: "Informe de gestión 2024: más de 8.000 personas protegidas",
        fecha: "2024-04-10",
        resumen: "La entidad presenta resultados del primer trimestre del año, destacando el aumento en la cobertura del programa de protección.",
        categoria: "Gestión",
        imagen: "assets/images/noticia3.jpg"
      },
      {
        id: 4,
        titulo: "Nuevo protocolo de atención en emergencias",
        fecha: "2024-04-08",
        resumen: "Se implementa un sistema de respuesta rápida para situaciones de riesgo que amenacen a personas bajo esquema de protección.",
        categoria: "Protocolos",
        imagen: "assets/images/noticia4.jpg"
      },
      {
        id: 5,
        titulo: "UNP certifica 500 funcionarios en derechos humanos",
        fecha: "2024-04-05",
        resumen: "Personal de la unidad completa programa de formación internacional para mejorar la atención a personas en situación de riesgo.",
        categoria: "Formación",
        imagen: "assets/images/noticia5.jpg"
      }
    ]).pipe(delay(50)); // Reducido de 300ms a 50ms
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
        valor: "Carrera 7 # 32-12, Bogotá D.C.",
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
        color: "#FF6B35",
        enlace: "/linea-vida-103",
        destacado: true
      },
      {
        titulo: "Trámites y Servicios",
        descripcion: "Realiza tus solicitudes de protección en línea",
        icono: "description",
        color: "#3366CC",
        enlace: "/atencion-servicios/tramites",
        destacado: false
      },
      {
        titulo: "PQRSD",
        descripcion: "Presenta tus Peticiones, Quejas, Reclamos, Sugerencias y Denuncias",
        icono: "mail",
        color: "#28A745",
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
        enlace: "/la-unp",
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
        valor: "Carrera 7 # 32-12",
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
