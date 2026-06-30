export interface PqrsdAccesoRapido {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  enlace?: string;
  tipo: 'primario' | 'secundario';
  destacado?: boolean;
}

export interface PqrsdTipo {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  ejemplo: string;
}

export interface PqrsdPaso {
  id: number;
  titulo: string;
  descripcion: string;
  detalle: string;
}

export interface PqrsdCanal {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  enlace?: string;
  etiqueta?: string;
}

export interface PqrsdDocumento {
  id: number;
  titulo: string;
  descripcion: string;
  icono: string;
  enlace?: string;
  estado: 'disponible' | 'proximamente';
}

export interface PqrsdInforme {
  id: number;
  periodo: string;
  titulo: string;
  descripcion: string;
  enlace?: string;
  estado: 'disponible' | 'proximamente';
}

export interface PqrsdFaqItem {
  id: number;
  pregunta: string;
  respuesta: string;
}
