// Modelo de datos para el sistema de navegación
// Estructura del menú principal y submenús
import { SearchResult } from './noticia.model';

export interface MenuItem {
  nombre: string;
  enlace: string;
  activo: boolean;
  submenu: SubMenuItem[];
}

export interface SubMenuItem {
  nombre: string;
  enlace: string;
}

export interface MenuState {
  activeMenu: number | null;
  hoveredMenu: number | null;
  isHoveringDropdown: boolean;
  openSubmenus: { [key: number]: boolean };
  mobileMenuOpen: boolean;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  showResults: boolean;
}
