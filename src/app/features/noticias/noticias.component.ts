import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Noticia } from '../../core/models/noticia.model';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {
  public noticias = signal<Noticia[]>([]);
  public loading = signal(true);
  public categorias = signal<{ id: string; nombre: string }[]>([]);
  public categoriaSeleccionada = signal('todas');
  public busqueda = signal('');
  public paginaActual = signal(1);
  public elementosPorPagina = 6;
  public readonly fallbackImage = 'assets/images/unp-institution.jpg';

  public noticiasFiltradas = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const categoria = this.categoriaSeleccionada();
    const noticias = this.noticias().filter((noticia) => {
      const coincideCategoria = categoria === 'todas' || noticia.categoria.toLowerCase() === categoria.toLowerCase();
      const coincideTexto = !texto || [noticia.titulo, noticia.resumen, noticia.categoria, noticia.autor ?? '']
        .join(' ')
        .toLowerCase()
        .includes(texto);
      return coincideCategoria && coincideTexto;
    });

    return [...noticias].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  public noticiasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.noticiasFiltradas().slice(inicio, inicio + this.elementosPorPagina);
  });

  public totalPaginas = computed(() => Math.max(1, Math.ceil(this.noticiasFiltradas().length / this.elementosPorPagina)));
  public noticiaDestacada = computed(() => this.noticias().find((item) => item.destacada) ?? this.noticias()[0]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.dataService.getNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });

    this.dataService.getCategorias().subscribe({
      next: (data) => this.categorias.set(data)
    });
  }

  public aplicarFiltroCategoria(categoria: string): void {
    this.categoriaSeleccionada.set(categoria);
    this.paginaActual.set(1);
  }

  public limpiarFiltros(): void {
    this.categoriaSeleccionada.set('todas');
    this.busqueda.set('');
    this.paginaActual.set(1);
  }

  public cambiarPagina(pagina: number): void {
    this.paginaActual.set(pagina);
  }

  public onBusqueda(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.busqueda.set(target.value);
    this.paginaActual.set(1);
  }

  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = this.fallbackImage;
      target.onerror = null;
    }
  }
}
