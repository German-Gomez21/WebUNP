import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminNewsService, EditorialNoticia, EditorialStatus } from '../../core/services/admin-news.service';

@Component({
  selector: 'app-admin-news-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-news-panel.component.html',
  styleUrls: ['./admin-news-panel.component.scss']
})
export class AdminNewsPanelComponent {
  @ViewChild('imageInput') imageInput?: ElementRef<HTMLInputElement>;

  private readonly editorMode = signal<'list' | 'form'>('list');
  private readonly selectedId = signal<number | null>(null);

  noticias = computed(() => this.adminNewsService.getNoticias());
  stats = computed(() => this.adminNewsService.getStats());
  selected = computed(() => {
    const id = this.selectedId();
    return id !== null ? this.adminNewsService.getById(id) : undefined;
  });

  modo = this.editorMode;
  filtroEstado = 'todos';
  busqueda = '';
  formulario: EditorialNoticia = this.createEmptyNews();
  etiquetasInput = '';

  readonly estados: EditorialStatus[] = ['borrador', 'en_revision', 'aprobado', 'programado', 'publicado', 'archivado', 'rechazado'];
  readonly categorias = ['Protección', 'Convocatorias', 'Gestión', 'Protocolos', 'Formación', 'Territorio'];

  constructor(private readonly adminNewsService: AdminNewsService) {}

  abrirCrear() {
    this.formulario = this.createEmptyNews();
    this.etiquetasInput = '';
    this.editorMode.set('form');
    this.selectedId.set(null);
  }

  abrirEditar(id: number) {
    const noticia = this.adminNewsService.getById(id);
    if (noticia) {
      this.formulario = { ...noticia };
      this.etiquetasInput = Array.isArray(noticia.etiquetas) ? noticia.etiquetas.join(', ') : '';
      this.selectedId.set(id);
      this.editorMode.set('form');
    }
  }

  volverAlListado() {
    this.editorMode.set('list');
  }

  guardar() {
    this.formulario.etiquetas = this.parseEtiquetas(this.etiquetasInput);
    const noticiaGuardada = this.adminNewsService.save(this.formulario);
    this.formulario = { ...noticiaGuardada };
    this.etiquetasInput = Array.isArray(noticiaGuardada.etiquetas) ? noticiaGuardada.etiquetas.join(', ') : '';
    this.selectedId.set(noticiaGuardada.id);
    this.editorMode.set('form');
  }

  cambiarEstado(id: number, estado: EditorialStatus) {
    this.adminNewsService.updateStatus(id, estado);
  }

  getNoticiasFiltradas() {
    const term = this.busqueda.toLowerCase();
    return this.noticias().filter(item => {
      const coincideEstado = this.filtroEstado === 'todos' || item.estado === this.filtroEstado;
      const coincideTexto = !term || [item.titulo, item.resumen, item.categoria, item.autor].join(' ').toLowerCase().includes(term);
      return coincideEstado && coincideTexto;
    });
  }

  triggerImageUpload() {
    this.imageInput?.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const safeName = file.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9._-]/g, '');
    this.formulario.imagen = `assets/images/uploads/${safeName}`;
  }

  private createEmptyNews(): EditorialNoticia {
    return {
      id: 0,
      titulo: '',
      fecha: new Date().toISOString().slice(0, 10),
      resumen: '',
      categoria: 'Protección',
      imagen: 'assets/images/hero-protection.jpg',
      slug: '',
      subtitulo: '',
      contenido: '',
      autor: 'Oficina de Comunicaciones',
      etiquetas: [],
      destacada: false,
      contenidoHtml: '',
      estado: 'borrador',
      fechaPublicacion: new Date().toISOString().slice(0, 10),
      dependencia: 'Comunicaciones',
      seoTitle: '',
      seoDescription: '',
      version: 1,
      auditoria: [],
      revisadoPor: 'Editor',
      requiereRevision: true
    };
  }

  private parseEtiquetas(value: string): string[] {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
}
