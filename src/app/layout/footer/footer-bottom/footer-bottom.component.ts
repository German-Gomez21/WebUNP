import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLinkComponent } from '../../../shared/components/footer-link/footer-link.component';
import { FooterLink } from '../../../shared/interfaces/footer.interfaces';

@Component({
  selector: 'app-footer-bottom',
  standalone: true,
  imports: [
    CommonModule,
    FooterLinkComponent
  ],
  template: `
    <div class="footer__bottom">
      <div class="container">
        <div class="footer__bottom-content">
          <div class="footer__copyright">
            <p>&copy; {{ currentYear() }} Unidad Nacional de Protección - UNP. 
            Todos los derechos reservados.</p>
          </div>
          <div class="footer__bottom-links">
            @for (link of institutionalLinks(); track link.nombre) {
              <app-footer-link 
                [link]="link"
                (linkClicked)="onLinkClick($event)" />
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-bottom-host'
  }
})
export class FooterBottomComponent {
  institutionalLinks = input.required<FooterLink[]>();
  linkClicked = output<string>();

  currentYear = computed(() => new Date().getFullYear());

  onLinkClick(enlace: string): void {
    this.linkClicked.emit(enlace);
  }
}
