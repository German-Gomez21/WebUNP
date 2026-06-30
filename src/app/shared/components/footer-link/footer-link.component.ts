import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer-link',
  standalone: true,
  imports: [CommonModule],
  template: `
    <li class="footer__links-item">
      <a [href]="link().enlace" 
         class="footer__link"
         (click)="onLinkClick(link().enlace)"
         [target]="isExternal() ? '_blank' : '_self'"
         [attr.rel]="isExternal() ? 'noopener noreferrer' : null">
        {{ link().nombre }}
      </a>
    </li>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-link-host'
  }
})
export class FooterLinkComponent {
  link = input.required<{ nombre: string; enlace: string }>();
  linkClicked = output<string>();

  onLinkClick(enlace: string): void {
    this.linkClicked.emit(enlace);
  }

  isExternal(): boolean {
    return this.link().enlace.startsWith('http');
  }
}
