import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionalCarouselComponent} from '../../shared/components/institutional-carousel/institutional-carousel.component';

@Component({
  selector: 'app-linea-vida-103',
  standalone: true,
  imports: [CommonModule, InstitutionalCarouselComponent],
  templateUrl: './linea-vida-103.component.html',
  styleUrls: ['./linea-vida-103.component.scss']
})
export class LineaVida103Component {
  constructor() { }
}
