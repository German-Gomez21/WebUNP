import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', './footer-responsive-text.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  constructor() {
    console.log('FooterComponent: Cargado con caja blanca y efecto de desborde');
  }
}
