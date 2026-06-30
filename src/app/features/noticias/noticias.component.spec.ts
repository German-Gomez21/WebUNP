import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { NoticiasComponent } from './noticias.component';

describe('NoticiasComponent', () => {
  let fixture: ComponentFixture<NoticiasComponent>;
  let component: NoticiasComponent;
  let dataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    dataService = jasmine.createSpyObj('DataService', ['getNoticias', 'getCategorias']);
    dataService.getNoticias.and.returnValue(of([
      {
        id: 1,
        titulo: 'UNP fortalece programa de protección',
        fecha: '2024-04-15',
        resumen: 'Resumen de prueba',
        categoria: 'Protección',
        imagen: 'assets/images/hero-protection.jpg',
        slug: 'noticia-prueba',
        contenidoHtml: '<p>Contenido de prueba</p>'
      }
    ]));
    dataService.getCategorias.and.returnValue(of([{ id: 'todas', nombre: 'Todas' }]));

    await TestBed.configureTestingModule({
      imports: [NoticiasComponent, RouterTestingModule],
      providers: [{ provide: DataService, useValue: dataService }]
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders the featured news card after loading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('UNP fortalece programa de protección');
  });
});
