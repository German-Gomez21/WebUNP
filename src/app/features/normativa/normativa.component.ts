import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DataService, NormativaDocumento } from '../../core/services/data.service';

@Component({
  selector: 'app-normativa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './normativa.component.html',
  styleUrls: ['./normativa.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NormativaComponent {
  private readonly dataService = inject(DataService);

  public readonly filtros = ['Todos', 'Leyes y Decretos', 'Resoluciones', 'Políticas', 'Normograma'];
  public readonly tipos = ['Todos', 'Ley', 'Decreto', 'Resolución', 'Circular', 'Política', 'Normograma'];
  public readonly dependencias = ['Todas', 'UNP', 'Presidencia', 'Ministerio del Interior', 'SUCOP', 'SUIJ'];

  public readonly busqueda = signal('');
  public readonly categoriaActiva = signal('Todos');
  public readonly tipoActivo = signal('Todos');
  public readonly dependenciaActiva = signal('Todas');
  public readonly anioActivo = signal('Todos');

  public readonly documentos = signal<NormativaDocumento[]>([]);

  constructor() {
    this.dataService.getNormativaDocumentos().subscribe((documentos) => {
      this.documentos.set(documentos);
    });
  }

  public readonly documentosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const categoria = this.categoriaActiva();
    const tipo = this.tipoActivo();
    const dependencia = this.dependenciaActiva();
    const anio = this.anioActivo();

    return this.documentos().filter((documento) => {
      const coincideCategoria = categoria === 'Todos' || documento.categoria === categoria;
      const coincideTipo = tipo === 'Todos' || documento.tipo === tipo;
      const coincideDependencia = dependencia === 'Todas' || documento.dependencia === dependencia;
      const coincideAnio = anio === 'Todos' || new Date(documento.fecha).getFullYear().toString() === anio;
      const coincideTexto = !texto || [
        documento.titulo,
        documento.numero,
        documento.descripcion,
        documento.dependencia,
        documento.categoria,
        documento.tipo
      ].join(' ').toLowerCase().includes(texto);

      return coincideCategoria && coincideTipo && coincideDependencia && coincideAnio && coincideTexto;
    });
  });

  public readonly documentosDestacados = computed(() => this.documentos().slice(0, 4));
  public readonly anios = computed(() => Array.from(new Set(this.documentos().map((documento) => new Date(documento.fecha).getFullYear().toString()))).sort((a, b) => Number(b) - Number(a)));

  public setCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }

  public setTipo(tipo: string): void {
    this.tipoActivo.set(tipo);
  }

  public setDependencia(dependencia: string): void {
    this.dependenciaActiva.set(dependencia);
  }

  public setAnio(anio: string): void {
    this.anioActivo.set(anio);
  }

  public limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoriaActiva.set('Todos');
    this.tipoActivo.set('Todos');
    this.dependenciaActiva.set('Todas');
    this.anioActivo.set('Todos');
  }
}
