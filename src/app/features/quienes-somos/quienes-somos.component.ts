import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface IdentityCard {
  title: string;
  description: string;
  icon: string;
}

interface FunctionalArea {
  title: string;
  description: string;
  icon: string;
}

interface OrganizationNode {
  title: string;
  description: string;
  level: string;
}

interface InstitutionalSymbol {
  name: string;
  description: string;
  meaning: string;
}

@Component({
  selector: 'app-quienes-somos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.scss']
})
export class QuienesSomosComponent {
  readonly breadcrumbItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Quiénes Somos', url: '/quienes-somos' }
  ];

  readonly identityCards: IdentityCard[] = [
    {
      title: 'Historia',
      description: 'Nacimos para fortalecer la protección integral de la población en situación de riesgo y construir confianza institucional.',
      icon: 'history_edu'
    },
    {
      title: 'Propósito',
      description: 'Orientamos nuestra gestión al acompañamiento humano, la prevención del riesgo y la respuesta oportuna.',
      icon: 'volunteer_activism'
    },
    {
      title: 'Valores',
      description: 'Actuamos con respeto, ética, transparencia y compromiso con la vida y la dignidad de las personas.',
      icon: 'verified'
    }
  ];

  readonly functions: FunctionalArea[] = [
    {
      title: 'Protección integral',
      description: 'Diseñamos estrategias de acompañamiento, prevención y respuesta para atender a personas en situación de riesgo.',
      icon: 'shield'
    },
    {
      title: 'Atención oportuna',
      description: 'Ofrecemos canales de contacto, orientación y seguimiento para resolver necesidades y solicitudes de forma clara.',
      icon: 'support_agent'
    },
    {
      title: 'Gestión institucional',
      description: 'Coordinamos procesos técnicos, administrativos y de servicio con enfoque en la calidad y la trazabilidad.',
      icon: 'dashboard_customize'
    },
    {
      title: 'Transparencia',
      description: 'Generamos información accesible y confiable para fortalecer la relación con la ciudadanía y los actores del sector.',
      icon: 'visibility'
    }
  ];

  readonly organizationChart: OrganizationNode[] = [
    {
      title: 'Dirección General',
      description: 'Define la orientación estratégica y el marco de gestión institucional.',
      level: 'Alta dirección'
    },
    {
      title: 'Unidades de apoyo',
      description: 'Aseguran los procesos técnicos, jurídicos y administrativos del sistema.',
      level: 'Apoyo institucional'
    },
    {
      title: 'Equipos territoriales',
      description: 'Articulan la atención y el acompañamiento en cada contexto y región.',
      level: 'Operación territorial'
    }
  ];

  readonly institutionalSymbols: InstitutionalSymbol[] = [
    {
      name: 'Logotipo institucional',
      description: 'Representa la identidad gráfica de la entidad y su vocación de servicio.',
      meaning: 'Símbolo de presencia, confianza y reconocimiento público.'
    },
    {
      name: 'Escudo',
      description: 'Refuerza la legitimidad institucional y su vínculo con la protección de derechos.',
      meaning: 'Expresa continuidad, autoridad y compromiso con la ciudadanía.'
    },
    {
      name: 'Bandera',
      description: 'Se utiliza como emblema de representación en ceremonias y actos institucionales.',
      meaning: 'Representa unidad, identidad y propósito colectivo.'
    }
  ];

  readonly messageTitle = 'Compromiso con la ciudadanía';
  readonly messageBody = 'La Unidad Nacional de Protección fortalece su relación con la sociedad mediante una gestión abierta, responsable y orientada al bienestar, en el marco del respeto por los derechos humanos y la confianza pública.';
}
