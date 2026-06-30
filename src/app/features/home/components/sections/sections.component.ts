import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { SeccionInformativa } from '../../../../core/models/noticia.model';

@Component({
  selector: 'sections-component',
  standalone: true,
  imports: [CommonModule],
  template: `
        <!-- Secciones Informativas -->
        <section class="section">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">Conoce la UNP</h2>
                    <p class="section__subtitle">Explora nuestras áreas institucionales</p>
                </div>
                
                <div class="info-sections-grid">
                    <div class="info-section-card" *ngFor="let section of sections()">
                        <div class="info-section-card__image" 
                             [style.background-image]="'url(' + section.imagen + ')'" 
                             style="background-size: cover; 
                                    background-position: center; 
                                    background-repeat: no-repeat;
                                    display: flex; 
                                    align-items: center; 
                                    justify-content: center;
                                    position: relative;">
                            <!-- Gradiente fallback si no hay imagen -->
                            <div style="position: absolute; 
                                       top: 0; 
                                       left: 0; 
                                       right: 0; 
                                       bottom: 0; 
                                       background: linear-gradient(135deg, rgba(51, 102, 204, 0.1), rgba(40, 81, 163, 0.1)); 
                                       z-index: 1;"></div>
                        </div>
                        <div class="info-section-card__content">
                            <h3 class="info-section-card__title">{{section.titulo}}</h3>
                            <p class="info-section-card__description">{{section.descripcion}}</p>
                            <ul class="info-section-card__items">
                                <li class="info-section-card__item" *ngFor="let item of section.items">
                                    <i class="material-icons info-section-card__item-icon">check_circle</i>
                                    {{item}}
                                </li>
                            </ul>
                            <a [href]="section.enlace" class="info-section-card__link">Ver más</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Sección ¿Qué hace la UNP? -->
        <section class="section section--gray">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">¿Qué hace la UNP?</h2>
                </div>
                
                <div class="section__content">
                    <div class="row">
                        <div class="col-md-8">
                            <p class="section__text">La Unidad Nacional de Protección es la entidad del Estado colombiano responsable de diseñar, coordinar e implementar medidas de seguridad integral para personas que enfrentan riesgos extraordinarios por su actividad política, pública, social o humanitaria. Trabajamos para garantizar el derecho a la vida, la integridad personal, la libertad y la seguridad de líderes sociales, defensores de derechos humanos, funcionarios públicos y otras personas en situación de vulnerabilidad.</p>
                        </div>
                        <div class="col-md-4">
                            <div class="services-list">
                                <h3 class="services-list__title">Nuestros servicios</h3>
                                <ul class="services-list__items">
                                    <li class="services-list__item">
                                        <i class="material-icons services-list__icon">check</i>
                                        Esquemas individuales de protección
                                    </li>
                                    <li class="services-list__item">
                                        <i class="material-icons services-list__icon">check</i>
                                        Esquemas colectivos de protección
                                    </li>
                                    <li class="services-list__item">
                                        <i class="material-icons services-list__icon">check</i>
                                        Análisis de riesgo
                                    </li>
                                    <li class="services-list__item">
                                        <i class="material-icons services-list__icon">check</i>
                                        Capacitación en autoprotección
                                    </li>
                                    <li class="services-list__item">
                                        <i class="material-icons services-list__icon">check</i>
                                        Acompañamiento psicosocial
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  `
})
export class SectionsComponent implements OnInit {
  private dataService = inject(DataService);
  public sections = signal<SeccionInformativa[]>([]);

  ngOnInit(): void {
    this.dataService.getSeccionesInformativas().subscribe(data => {
      this.sections.set(data);
    });
  }
}
