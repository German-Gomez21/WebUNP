// Content Item Model - Interfaz base para todos los contenidos
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  link?: string;
  status: 'draft' | 'published' | 'archived';
  created_at?: Date;
  updated_at?: Date;
  order?: number;
}

// News Item - Extensión para noticias
export interface NewsItem extends ContentItem {
  category: string;
  date: string;
  featured_image?: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
}

// Service Item - Extensión para servicios
export interface ServiceItem extends ContentItem {
  subtitle?: string;
  details?: string;
  category: string;
  priority: number;
  featured?: boolean;
}

// Carousel Slide - Para el hero carousel
export interface CarouselSlide extends ContentItem {
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_type: 'image' | 'gradient';
  background_value: string;
  order: number;
}
