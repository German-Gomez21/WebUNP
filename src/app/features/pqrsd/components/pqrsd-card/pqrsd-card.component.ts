import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pqrsd-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pqrsd-card.component.html',
  styleUrls: ['./pqrsd-card.component.scss']
})
export class PqrsdCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() icon = 'article';
  @Input() link?: string;
  @Input() meta?: string;
  @Input() variant: 'primary' | 'secondary' = 'secondary';
  @Input() featured = false;
}
