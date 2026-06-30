import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social-link',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a [href]="social().enlace" 
       class="footer__social-link"
       (click)="onSocialClick(social().enlace)"
       target="_blank"
       rel="noopener noreferrer"
       [attr.aria-label]="ariaLabel">
        <i class="material-icons">{{ social().icono }}</i>
    </a>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'social-link-host'
  }
})
export class SocialLinkComponent {
  social = input.required<{ nombre: string; icono: string; enlace: string }>();
  socialClicked = output<string>();

  get ariaLabel(): string {
    return `Síguenos en ${this.social().nombre}`;
  }

  onSocialClick(enlace: string): void {
    this.socialClicked.emit(enlace);
  }
}
