import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactItemComponent } from '../../../shared/components/contact-item/contact-item.component';
import { ContactInfo } from '../../../shared/interfaces/footer.interfaces';

@Component({
  selector: 'app-footer-contact',
  standalone: true,
  imports: [
    CommonModule,
    ContactItemComponent
  ],
  template: `
    <div class="footer__contact">
      <h4 class="footer__title">Información de Contacto</h4>
      <app-contact-item 
        icon="phone" 
        [value]="contactInfo().telefono" />
      <app-contact-item 
        icon="email" 
        [value]="contactInfo().correo" />
      <app-contact-item 
        icon="location_on" 
        [value]="contactInfo().direccion" />
      <app-contact-item 
        icon="schedule" 
        [value]="contactInfo().horario" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  host: {
    'class': 'footer-contact-host'
  }
})
export class FooterContactComponent {
  contactInfo = input.required<ContactInfo>();
}
