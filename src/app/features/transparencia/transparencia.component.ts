import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TransparenciaDocumento {
  id: number;
  titulo: string;
  categoria: string;
  tipo: string;
  fecha: string;
  resumen: string;
  destacada: boolean;
  href: string;
}

interface TransparenciaAcordeon {
  titulo: string;
  contenido: string;
}

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransparenciaComponent {
  public readonly filtros = ['Todos', 'Informes', 'Resoluciones', 'Políticas', 'Datos abiertos'];
  public readonly busqueda = signal('');
  public readonly categoriaActiva = signal('Todos');
  public readonly indiceAbierto = signal(0);

  public readonly documentos = signal<TransparenciaDocumento[]>([
    {
      id: 1,
      titulo: 'Informe anual de gestión 2025',
      categoria: 'Informes',
      tipo: 'PDF',
      fecha: '2026-03-18',
      resumen: 'Resumen ejecutivo de resultados, indicadores de atención y compromisos institucionales del periodo 2025.',
      destacada: true,
      href: '#'
    },
    {
      id: 2,
      titulo: 'Resolución de régimen interno y procedimiento disciplinario',
      categoria: 'Resoluciones',
      tipo: 'PDF',
      fecha: '2026-01-22',
      resumen: 'Normativa aplicable para la gestión interna, evaluación y atención de solicitudes de la Unidad Nacional de Protección.',
      destacada: false,
      href: '#'
    },
    {
      id: 3,
      titulo: 'Política de protección de datos y acceso a la información',
      categoria: 'Políticas',
      tipo: 'HTML',
      fecha: '2025-11-04',
      resumen: 'Lineamientos para el tratamiento responsable de información y la garantía de los derechos de las personas.',
      destacada: false,
      href: '#'
    },
    {
      id: 4,
      titulo: 'Indicadores de atención y servicio al ciudadano',
      categoria: 'Datos abiertos',
      tipo: 'CSV',
      fecha: '2025-09-15',
      resumen: 'Conjunto de datos abiertos para consulta de tiempos de respuesta, canales de atención y gestión de casos.',
      destacada: true,
      href: '#'
    },
    {
      id: 5,
      titulo: 'Plan de acción para transparencia y participación ciudadana',
      categoria: 'Informes',
      tipo: 'PDF',
      fecha: '2025-08-12',
      resumen: 'Estrategias de mejora y seguimiento para ampliar la claridad, disponibilidad y trazabilidad de la información institucional.',
      destacada: false,
      href: '#'
    }
  ]);

  public readonly acordeones: TransparenciaAcordeon[] = [
    {
      titulo: '¿Qué es la transparencia institucional en la UNP?',
      contenido: 'La transparencia permite que cualquier persona conozca el marco normativo, la organización, los indicadores de gestión y las decisiones que afectan el servicio institucional.'
    },
    {
      titulo: '¿Dónde se publican los documentos?',
      contenido: 'Los documentos se consolidan en esta sección para facilitar la consulta, filtros por categoría, búsqueda por palabras clave y acceso rápido a descargas.'
    },
    {
      titulo: '¿Cómo se actualiza la información?',
      contenido: 'La información se mantiene actualizada con informes, resoluciones y datos de interés público, siguiendo el ciclo de gestión institucional y las fechas de publicación.'
    }
  ];

  public readonly documentosFiltrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const categoria = this.categoriaActiva();

    return this.documentos().filter((documento) => {
      const coincideCategoria = categoria === 'Todos' || documento.categoria === categoria;
      const coincideTexto = !texto || [documento.titulo, documento.resumen, documento.categoria, documento.tipo]
        .join(' ')
        .toLowerCase()
        .includes(texto);

      return coincideCategoria && coincideTexto;
    });
  });

  public readonly destacados = computed(() => this.documentos().filter((documento) => documento.destacada).slice(0, 3));

  public readonly documentosRecientes = computed(() => [...this.documentos()].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 4));

  public setCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }

  public toggleAcordeon(index: number): void {
    this.indiceAbierto.set(this.indiceAbierto() === index ? -1 : index);
  }
}
