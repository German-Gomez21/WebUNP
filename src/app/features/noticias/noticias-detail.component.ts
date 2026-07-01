import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Noticia } from '../../core/models/noticia.model';
import { InstitutionalCarouselComponent} from '../../shared/components/institutional-carousel/institutional-carousel.component';

@Component({
  selector: 'app-noticias-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, InstitutionalCarouselComponent],
  templateUrl: './noticias-detail.component.html',
  styleUrls: ['./noticias-detail.component.scss']
})
export class NoticiasDetailComponent implements OnInit {
  public noticia = signal<Noticia | null>(null);
  public relacionadas = signal<Noticia[]>([]);
  public loading = signal(true);
  public readonly fallbackImage = 'assets/images/unp-institution.jpg';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  public onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (target) {
      target.src = this.fallbackImage;
      target.onerror = null;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.dataService.getNoticiaBySlug(slug).subscribe({
        next: (noticia) => {
          this.noticia.set(noticia ?? null);
          if (noticia) {
            this.dataService.getNoticiasRelacionadas(noticia.slug ?? '', noticia.categoria).subscribe({
              next: (relacionadas) => this.relacionadas.set(relacionadas)
            });
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    });
  }
}
