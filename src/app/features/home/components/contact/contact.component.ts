import { Component, signal } from '@angular/core';
import { InstitutionalCarouselComponent } from '../../../../shared/components/institutional-carousel/institutional-carousel.component';

@Component({
  selector: 'contact-component',
  standalone: true,
  imports: [InstitutionalCarouselComponent],
  template: `
        <!-- Canales de Atención -->
        <section class="section section--blue">
            <div class="container">
                <div class="section__header section__header--white">
                    <h2 class="section__title">Canales de Atención</h2>
                    <p class="section__subtitle">Comunícate con nosotros cuando lo necesites</p>
                </div>
                
                <div class="contact-channels">
                    <div class="contact-channel">
                        <div class="contact-channel__icon">
                            <i class="material-icons contact-channel__icon-text">phone</i>
                        </div>
                        <div class="contact-channel__content">
                            <h3 class="contact-channel__title">Línea Nacional</h3>
                            <p class="contact-channel__value">01 8000 118 228</p>
                            <p class="contact-channel__description">Atención las 24 horas, los 7 días de la semana</p>
                        </div>
                    </div>
                    
                    <div class="contact-channel">
                        <div class="contact-channel__icon">
                            <i class="material-icons contact-channel__icon-text">email</i>
                        </div>
                        <div class="contact-channel__content">
                            <h3 class="contact-channel__title">Correo Electrónico</h3>
                            <p class="contact-channel__value">correspondencia&#64;unp.gov.co</p>
                            <p class="contact-channel__description">Respuesta en máximo 48 horas hábiles</p>
                        </div>
                    </div>
                    
                    <div class="contact-channel">
                        <div class="contact-channel__icon">
                            <i class="material-icons contact-channel__icon-text">business</i>
                        </div>
                        <div class="contact-channel__content">
                            <h3 class="contact-channel__title">Dirección Nacional</h3>
                            <p class="contact-channel__value">Carrera 44 # 20-21 Bogotá D.C.</p>
                            <p class="contact-channel__description">Horario de atención: Lunes a viernes 8:00 a.m. - 5:00 p.m.</p>
                        </div>
                    </div>
                    
                    <div class="contact-channel">
                        <div class="contact-channel__icon">
                            <i class="material-icons contact-channel__icon-text">chat</i>
                        </div>
                        <div class="contact-channel__content">
                            <h3 class="contact-channel__title">Chat en Línea</h3>
                            <p class="contact-channel__value">Disponible en nuestra web</p>
                            <p class="contact-channel__description">Lunes a viernes 8:00 a.m. - 6:00 p.m.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Carrusel Institucional -->
        <app-institutional-carousel></app-institutional-carousel>
        
        <!-- FAQ -->
        <section class="section section--white">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">Preguntas Frecuentes</h2>
                    <p class="section__subtitle">Resuelve tus dudas sobre nuestros servicios</p>
                </div>
                
                <div class="faq-container">
                    <div class="faq-item">
                        <button class="faq-item__question" (click)="toggleFAQ(0)">
                            <span class="faq-item__question-text">¿Quién puede solicitar protección de la UNP?</span>
                            <span class="faq-item__toggle">
                                <i class="material-icons faq-item__toggle-icon">{{ isExpanded(0) ? 'expand_less' : 'expand_more' }}</i>
                            </span>
                        </button>
                        <div class="faq-item__answer" [style.display]="isExpanded(0) ? 'block' : 'none'">
                            <div class="faq-item__answer-content">
                                <p>Pueden solicitar protección personas que se encuentren en situación de riesgo extraordinario debido a su actividad política, pública, social o humanitaria. Esto incluye líderes sociales, defensores de derechos humanos, funcionarios públicos, periodistas, entre otros.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-item__question" (click)="toggleFAQ(1)">
                            <span class="faq-item__question-text">¿Cómo realizo una solicitud de protección?</span>
                            <span class="faq-item__toggle">
                                <i class="material-icons faq-item__toggle-icon">{{ isExpanded(1) ? 'expand_less' : 'expand_more' }}</i>
                            </span>
                        </button>
                        <div class="faq-item__answer" [style.display]="isExpanded(1) ? 'block' : 'none'">
                            <div class="faq-item__answer-content">
                                <p>Puedes realizar tu solicitud a través de nuestros canales oficiales: línea telefónica nacional 01 8000 112 951, correo electrónico solicitud&#64;unp.gov.co, o presencialmente en nuestras sedes a nivel nacional. También puedes iniciar el proceso a través de nuestra plataforma digital.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-item__question" (click)="toggleFAQ(2)">
                            <span class="faq-item__question-text">¿Qué documentos necesito para solicitar protección?</span>
                            <span class="faq-item__toggle">
                                <i class="material-icons faq-item__toggle-icon">{{ isExpanded(2) ? 'expand_less' : 'expand_more' }}</i>
                            </span>
                        </button>
                        <div class="faq-item__answer" [style.display]="isExpanded(2) ? 'block' : 'none'">
                            <div class="faq-item__answer-content">
                                <p>Debes presentar documento de identidad, declaración juramentada de los hechos de riesgo, pruebas que respalden tu situación (amenazas, atentados, hostigamiento), y cualquier otro documento que demuestre la vulnerabilidad de tu situación.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-item__question" (click)="toggleFAQ(3)">
                            <span class="faq-item__question-text">¿Cuánto tiempo toma el proceso de evaluación?</span>
                            <span class="faq-item__toggle">
                                <i class="material-icons faq-item__toggle-icon">{{ isExpanded(3) ? 'expand_less' : 'expand_more' }}</i>
                            </span>
                        </button>
                        <div class="faq-item__answer" [style.display]="isExpanded(3) ? 'block' : 'none'">
                            <div class="faq-item__answer-content">
                                <p>El proceso de evaluación puede tomar entre 15 y 30 días hábiles dependiendo de la complejidad del caso. En situaciones de riesgo inminente, se pueden adoptar medidas de protección inmediatas.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <button class="faq-item__question" (click)="toggleFAQ(4)">
                            <span class="faq-item__question-text">¿Qué tipo de medidas de protección ofrece la UNP?</span>
                            <span class="faq-item__toggle">
                                <i class="material-icons faq-item__toggle-icon">{{ isExpanded(4) ? 'expand_less' : 'expand_more' }}</i>
                            </span>
                        </button>
                        <div class="faq-item__answer" [style.display]="isExpanded(4) ? 'block' : 'none'">
                            <div class="faq-item__answer-content">
                                <p>Ofrecemos medidas de protección como escoltas, vehículos blindados, dispositivos de comunicación, seguridad en residencia y trabajo, traslados temporales, y apoyo psicosocial. Las medidas son personalizadas según el nivel de riesgo evaluado.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  `
})
export class ContactComponent {
  // Signals to track which FAQ items are expanded
  expandedItems = signal<Set<number>>(new Set());

  constructor() { }

  toggleFAQ(index: number): void {
    const current = this.expandedItems();
    const newExpanded = new Set(current);
    
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    
    this.expandedItems.set(newExpanded);
  }

  isExpanded(index: number): boolean {
    return this.expandedItems().has(index);
  }
}
