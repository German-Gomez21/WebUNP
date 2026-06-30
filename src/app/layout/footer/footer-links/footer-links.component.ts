import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLinkComponent } from '../../../shared/components/footer-link/footer-link.component';
import { FooterLink } from '../../../shared/interfaces/footer.interfaces';

@Component({
  selector: 'app-footer-links',
  standalone: true,
  imports: [
    CommonModule,
    FooterLinkComponent
  ],
  template: `
    <div class="footer__column footer__column--{{ columnType() }}">
      <h4 class="footer__title">{{ title() }}</h4>
      <ul class="footer__links">
        @for (link of links(); track link.nombre) {
          <app-footer-link 
            [link]="link"
            (linkClicked)="onLinkClick($event)" />
        }
      </ul>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-links-host'
  }
})
export class FooterLinksComponent {
  title = input.required<string>();
  links = input.required<FooterLink[]>();
  columnType = input.required<'services' | 'institutional' | 'social'>();
  linkClicked = output<string>();

  onLinkClick(enlace: string): void {
    this.linkClicked.emit(enlace);
  }
}
