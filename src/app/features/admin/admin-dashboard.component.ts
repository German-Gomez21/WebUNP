import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminNewsPanelComponent } from './admin-news-panel.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNewsPanelComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    // Inicialización del dashboard administrativo
    console.log('Sistema CMS/CRM UNP - Iniciado');
  }
}
