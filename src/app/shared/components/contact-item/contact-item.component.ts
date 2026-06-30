import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer__contact-item">
      <i class="material-icons footer__contact-icon">{{ icon() }}</i>
      <span>{{ value() }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'contact-item-host'
  }
})
export class ContactItemComponent {
  icon = input.required<string>();
  value = input.required<string>();
}
