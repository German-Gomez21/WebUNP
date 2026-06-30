export interface FooterLink {
  nombre: string;
  enlace: string;
}

export interface SocialMedia {
  nombre: string;
  icono: string;
  enlace: string;
}

export interface ContactInfo {
  telefono: string;
  correo: string;
  direccion: string;
  horario: string;
}

export interface FooterColumnData {
  title: string;
  links: FooterLink[];
}

export interface FooterBrandData {
  logoPath: string;
  logoAlt: string;
  description: string;
}
