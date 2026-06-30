import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterLinkComponent } from '../../../shared/components/footer-link/footer-link.component';
import { SocialLinkComponent } from '../../../shared/components/social-link/social-link.component';
import { FooterLink, SocialMedia } from '../../../shared/interfaces/footer.interfaces';

@Component({
  selector: 'app-footer-social',
  standalone: true,
  imports: [
    CommonModule,
    FooterLinkComponent,
    SocialLinkComponent
  ],
  template: `
    <div class="footer__column footer__column--social">
      <h4 class="footer__title">Gobierno en Línea</h4>
      <ul class="footer__links">
        @for (link of govLinks(); track link.nombre) {
          <app-footer-link 
            [link]="link"
            (linkClicked)="onLinkClick($event)" />
        }
      </ul>
      
      <h4 class="footer__title footer__title--social">Síguenos</h4>
      <div class="footer__social">
        @for (social of socialMedia(); track social.nombre) {
          <app-social-link 
            [social]="social"
            (socialClicked)="onSocialClick($event)" />
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-social-host'
  }
})
export class FooterSocialComponent {
  govLinks = input.required<FooterLink[]>();
  socialMedia = input.required<SocialMedia[]>();
  linkClicked = output<string>();
  socialClicked = output<string>();

  onLinkClick(enlace: string): void {
    this.linkClicked.emit(enlace);
  }

  onSocialClick(enlace: string): void {
    this.socialClicked.emit(enlace);
  }
}
