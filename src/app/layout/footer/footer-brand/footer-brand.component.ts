import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterBrandData } from '../../../shared/interfaces/footer.interfaces';

@Component({
  selector: 'app-footer-brand',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer__brand">
      <a href="/" class="footer__logo-link" aria-label="Ir a la página de inicio">
        <img [src]="brandData().logoPath" 
             [alt]="brandData().logoAlt" 
             class="footer__logo">
      </a>
      <p class="footer__description">
        {{ brandData().description }}
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-brand-host'
  }
})
export class FooterBrandComponent {
  brandData = input.required<FooterBrandData>();
}
