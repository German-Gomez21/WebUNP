// Interfaces de datos para el sistema UNP
// Tipado fuerte para toda la aplicación

export interface Noticia {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
  categoria: string;
  imagen: string;
  slug?: string;
  subtitulo?: string;
  contenido?: string;
  autor?: string;
  etiquetas?: string[];
  destacada?: boolean;
  tipo?: 'destacada' | 'general';
  contenidoHtml?: string;
}

export interface AccesoRapido {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  enlace: string;
  color: string;
}

export interface FAQItem {
  id: number;
  pregunta: string;
  respuesta: string;
}

export interface CanalAtencion {
  id: number;
  tipo: string;
  valor: string;
  descripcion: string;
  icono: string;
}

export interface InstitucionInfo {
  nombre: string;
  sigla: string;
  mision: string;
  vision: string;
  valores: string[];
  fundacion: string;
  naturaleza: string;
}

export interface HeroData {
  titulo: string;
  subtitulo: string;
  botones: HeroButton[];
}

export interface HeroButton {
  texto: string;
  enlace: string;
  tipo: 'primario' | 'secundario' | 'terciario';
  aria: string;
}

export interface BannerPrincipal {
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  enlace: string;
  destacado: boolean;
}

export interface SeccionInformativa {
  titulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
  items: string[];
}

export interface SearchResult {
  title: string;
  description: string;
  icon: string;
  url: string;
}

export interface Tramite {
  id: number;
  nombre: string;
  descripcion: string;
  dirigidoA: string;
  requisitos: string[];
  documentos: DocumentoTramite[];
  modalidad: string;
  tiempoRespuesta: string;
  costo: string;
  normatividad: string[];
  linkTramite?: string;
  categoria: string;
}

export interface DocumentoTramite {
  nombre: string;
  url: string;
  tipo: 'pdf' | 'doc' | 'link';
}

export interface CanalAtencionDetalle extends CanalAtencion {
  horario: string;
  enlace?: string;
}

/**
 * CarouselItem - Modelo de datos para cada diapositiva del carrusel institucional UNP.
 * Las propiedades de texto y botón son opcionales para máxima flexibilidad.
 */
export interface CarouselItem {
  id: number;
  /** Ruta de la imagen. Usar 'assets/images/...' para imágenes locales */
  image: string;
  /** Alt text para accesibilidad */
  imageAlt: string;
  /** Título principal de la diapositiva (opcional) */
  title?: string;
  /** Subtítulo o descripción breve (opcional) */
  subtitle?: string;
  /** Texto del botón de acción (opcional) */
  ctaText?: string;
  /** URL de destino del botón (opcional) */
  ctaLink?: string;
  /** Color de fondo de respaldo si la imagen no carga */
  fallbackGradient?: string;
}
