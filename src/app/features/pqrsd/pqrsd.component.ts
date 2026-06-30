import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PqrsdService } from '../../core/services/pqrsd.service';
import {
  PqrsdAccesoRapido,
  PqrsdCanal,
  PqrsdDocumento,
  PqrsdFaqItem,
  PqrsdInforme,
  PqrsdPaso,
  PqrsdTipo
} from '../../core/models/pqrsd.model';
import { PqrsdCardComponent } from './components/pqrsd-card/pqrsd-card.component';
import { InstitutionalCarouselComponent} from '../../shared/components/institutional-carousel/institutional-carousel.component';

@Component({
  selector: 'app-pqrsd',
  standalone: true,
  imports: [CommonModule, RouterLink, PqrsdCardComponent, InstitutionalCarouselComponent],
  templateUrl: './pqrsd.component.html',
  styleUrls: ['./pqrsd.component.scss']
})
export class PqrsdComponent implements OnInit {
  accesosRapidos: PqrsdAccesoRapido[] = [];
  tipos: PqrsdTipo[] = [];
  pasos: PqrsdPaso[] = [];
  canales: PqrsdCanal[] = [];
  documentos: PqrsdDocumento[] = [];
  informes: PqrsdInforme[] = [];
  faqs: PqrsdFaqItem[] = [];
  openFaqId: number | null = null;
  isLoading = true;

  constructor(private pqrsdService: PqrsdService) {}

  ngOnInit(): void {
    this.loadContent();
  }

  toggleFaq(id: number): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }

  private loadContent(): void {
    this.isLoading = true;

    this.pqrsdService.getAccesosRapidos().subscribe((data) => {
      this.accesosRapidos = data;
    });

    this.pqrsdService.getTipos().subscribe((data) => {
      this.tipos = data;
    });

    this.pqrsdService.getPasos().subscribe((data) => {
      this.pasos = data;
    });

    this.pqrsdService.getCanales().subscribe((data) => {
      this.canales = data;
    });

    this.pqrsdService.getDocumentos().subscribe((data) => {
      this.documentos = data;
    });

    this.pqrsdService.getInformes().subscribe((data) => {
      this.informes = data;
    });

    this.pqrsdService.getFaq().subscribe((data) => {
      this.faqs = data;
      this.isLoading = false;
    });
  }
}
