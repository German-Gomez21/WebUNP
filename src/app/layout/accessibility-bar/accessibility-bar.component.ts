import { Component, signal, computed, AfterViewInit, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accessibility-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-bar.component.html',
  styleUrls: ['./accessibility-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AccessibilityBarComponent implements AfterViewInit {
  
  // Signals para gestionar el estado
  isContrastActive = signal(false);
  isIncreaseActive = signal(false);
  isDecreaseActive = signal(false);
  currentFontSize = signal(16);
  
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngAfterViewInit() {
    // Inicializar el estado del contraste basado en las clases del body
    this.initializeContrastState();
    
    // Cargar preferencia guardada en localStorage
    this.loadDarkModePreference();
    
    // Agregar listener para detectar Tab key
    this.renderer.listen('document', 'keyup', (e: KeyboardEvent) => {
      this.detectTabKey(e);
    });

    // Agregar listeners para eventos hover en los botones
    this.addHoverListeners();
  }

  initializeContrastState() {
    const bodyElement = document.body;
    const botoncontraste = document.getElementById('botoncontraste');
    
    console.log('🔧 Inicializando estado de contraste');
    console.log('📋 Clases del body al iniciar:', bodyElement?.className);
    
    // Verificar si ya hay un modo de contraste activo
    const isDarkMode = bodyElement?.classList.contains('modo_oscuro-govco');
    const isLightMode = bodyElement?.classList.contains('modo_claro-govco');
    
    if (isDarkMode) {
      console.log('🌓 Modo oscuro detectado, activando botón');
      botoncontraste?.classList.add('active-barra-accesibilidad-govco');
      this.isContrastActive.set(true);
    } else {
      console.log('☀️ Modo claro o sin modo, asegurando botón desactivado');
      botoncontraste?.classList.remove('active-barra-accesibilidad-govco');
      this.isContrastActive.set(false);
      
      // Si no hay ninguna clase de modo, establecer modo claro por defecto
      if (!isLightMode && bodyElement) {
        bodyElement.classList.add('modo_claro-govco');
        console.log('✅ Establecido modo claro por defecto');
      }
    }
    
    console.log('📋 Estado inicial del contraste:', {
      isContrastActive: this.isContrastActive(),
      bodyClasses: bodyElement?.className,
      buttonActive: botoncontraste?.classList.contains('active-barra-accesibilidad-govco')
    });
  }

  addHoverListeners() {
    console.log('🔍 Iniciando listeners para hover en barra de accesibilidad');
    
    // Verificar que los tooltips existen en el DOM
    setTimeout(() => {
      console.log('🔍 Verificando elementos en el DOM:');
      
      // Verificar contenedor principal
      const barraContainer = document.querySelector('.barra-accesibilidad-govco');
      console.log('📋 Barra contenedora:', {
        existe: !!barraContainer,
        rect: barraContainer?.getBoundingClientRect(),
        estilos: barraContainer ? window.getComputedStyle(barraContainer) : null,
        visible: barraContainer ? 
          (window.getComputedStyle(barraContainer).display !== 'none' && 
           window.getComputedStyle(barraContainer).visibility !== 'hidden' &&
           window.getComputedStyle(barraContainer).opacity !== '0') : false
      });
      
      const titlecontraste = document.getElementById('titlecontraste');
      const titledisminuir = document.getElementById('titledisminuir');
      const titleaumentar = document.getElementById('titleaumentar');
      
      console.log('📋 Tooltip contraste:', {
        existe: !!titlecontraste,
        texto: titlecontraste?.textContent,
        innerHTML: titlecontraste?.innerHTML,
        clases: titlecontraste?.className,
        rect: titlecontraste?.getBoundingClientRect(),
        padre: titlecontraste?.parentElement?.tagName,
        padreClases: titlecontraste?.parentElement?.className
      });
      
      console.log('📋 Tooltip disminuir:', {
        existe: !!titledisminuir,
        texto: titledisminuir?.textContent,
        innerHTML: titledisminuir?.innerHTML,
        clases: titledisminuir?.className,
        rect: titledisminuir?.getBoundingClientRect(),
        padre: titledisminuir?.parentElement?.tagName,
        padreClases: titledisminuir?.parentElement?.className
      });
      
      console.log('📋 Tooltip aumentar:', {
        existe: !!titleaumentar,
        texto: titleaumentar?.textContent,
        innerHTML: titleaumentar?.innerHTML,
        clases: titleaumentar?.className,
        rect: titleaumentar?.getBoundingClientRect(),
        padre: titleaumentar?.parentElement?.tagName,
        padreClases: titleaumentar?.parentElement?.className
      });
      
      // Verificar viewport
      console.log('🖥️ Viewport:', {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY
      });
    }, 500);
    
    // Botón contraste
    const botoncontraste = document.getElementById('botoncontraste');
    const titlecontraste = document.getElementById('titlecontraste');
    
    if (botoncontraste && titlecontraste) {
      console.log('✅ Botón contraste y tooltip encontrados');
      
      this.renderer.listen(botoncontraste, 'mouseenter', () => {
        console.log('🖱️ Mouse ENTER en botón contraste');
        console.log('📋 Estilo del tooltip antes:', {
          opacity: titlecontraste.style.opacity,
          visibility: titlecontraste.style.visibility,
          display: window.getComputedStyle(titlecontraste).display
        });
        
        // Verificar estilos después de un pequeño delay
        setTimeout(() => {
          console.log('📋 Estilo del tooltip después (100ms):', {
            opacity: titlecontraste.style.opacity,
            visibility: titlecontraste.style.visibility,
            display: window.getComputedStyle(titlecontraste).display,
            computedOpacity: window.getComputedStyle(titlecontraste).opacity,
            computedVisibility: window.getComputedStyle(titlecontraste).visibility,
            position: window.getComputedStyle(titlecontraste).position,
            right: window.getComputedStyle(titlecontraste).right,
            top: window.getComputedStyle(titlecontraste).top,
            zIndex: window.getComputedStyle(titlecontraste).zIndex
          });
        }, 100);
      });
      
      this.renderer.listen(botoncontraste, 'mouseleave', () => {
        console.log('🖱️ Mouse LEAVE en botón contraste');
      });
    } else {
      console.log('❌ No se encontró botón contraste o tooltip');
    }
    
    // Botón disminuir
    const botondisminuir = document.getElementById('botondisminuir');
    const titledisminuir = document.getElementById('titledisminuir');
    
    if (botondisminuir && titledisminuir) {
      console.log('✅ Botón disminuir y tooltip encontrados');
      
      this.renderer.listen(botondisminuir, 'mouseenter', () => {
        console.log('🖱️ Mouse ENTER en botón disminuir');
        console.log('📋 Estilo del tooltip antes:', {
          opacity: titledisminuir.style.opacity,
          visibility: titledisminuir.style.visibility,
          display: window.getComputedStyle(titledisminuir).display
        });
        
        setTimeout(() => {
          console.log('📋 Estilo tooltip disminuir después (100ms):', {
            opacity: titledisminuir.style.opacity,
            visibility: titledisminuir.style.visibility,
            computedOpacity: window.getComputedStyle(titledisminuir).opacity,
            computedVisibility: window.getComputedStyle(titledisminuir).visibility,
            position: window.getComputedStyle(titledisminuir).position,
            right: window.getComputedStyle(titledisminuir).right,
            top: window.getComputedStyle(titledisminuir).top,
            zIndex: window.getComputedStyle(titledisminuir).zIndex
          });
        }, 100);
      });
      
      this.renderer.listen(botondisminuir, 'mouseleave', () => {
        console.log('🖱️ Mouse LEAVE en botón disminuir');
      });
    } else {
      console.log('❌ No se encontró botón disminuir o tooltip');
    }
    
    // Botón aumentar
    const botonaumentar = document.getElementById('botonaumentar');
    const titleaumentar = document.getElementById('titleaumentar');
    
    if (botonaumentar && titleaumentar) {
      console.log('✅ Botón aumentar y tooltip encontrados');
      
      this.renderer.listen(botonaumentar, 'mouseenter', () => {
        console.log('🖱️ Mouse ENTER en botón aumentar');
        console.log('📋 Estilo del tooltip antes:', {
          opacity: titleaumentar.style.opacity,
          visibility: titleaumentar.style.visibility,
          display: window.getComputedStyle(titleaumentar).display
        });
        
        setTimeout(() => {
          console.log('📋 Estilo tooltip aumentar después (100ms):', {
            opacity: titleaumentar.style.opacity,
            visibility: titleaumentar.style.visibility,
            computedOpacity: window.getComputedStyle(titleaumentar).opacity,
            computedVisibility: window.getComputedStyle(titleaumentar).visibility,
            position: window.getComputedStyle(titleaumentar).position,
            right: window.getComputedStyle(titleaumentar).right,
            top: window.getComputedStyle(titleaumentar).top,
            zIndex: window.getComputedStyle(titleaumentar).zIndex
          });
        }, 100);
      });
      
      this.renderer.listen(botonaumentar, 'mouseleave', () => {
        console.log('🖱️ Mouse LEAVE en botón aumentar');
      });
    } else {
      console.log('❌ No se encontró botón aumentar o tooltip');
    }
  }

  detectTabKey(e: KeyboardEvent) {
    if (e.keyCode === 9) {
      const botoncontraste = document.getElementById('botoncontraste');
      const botonaumentar = document.getElementById('botonaumentar');
      const botondisminuir = document.getElementById('botondisminuir');

      if (botoncontraste?.classList.contains('active-barra-accesibilidad-govco')) {
        botoncontraste.classList.toggle('active-barra-accesibilidad-govco');
      }
      if (botonaumentar?.classList.contains('active-barra-accesibilidad-govco')) {
        botonaumentar.classList.toggle('active-barra-accesibilidad-govco');
      }
      if (botondisminuir?.classList.contains('active-barra-accesibilidad-govco')) {
        botondisminuir.classList.toggle('active-barra-accesibilidad-govco');
      }
    }
  }

  cambiarContexto() {
    const botoncontraste = document.getElementById('botoncontraste');
    const botonaumentar = document.getElementById('botonaumentar');
    const botondisminuir = document.getElementById('botondisminuir');
    const bodyElement = document.body;

    console.log('🔄 Cambiando contexto de contraste');
    console.log('📋 Estado actual del body:', {
      modoOscuro: bodyElement?.classList.contains('modo_oscuro-govco'),
      modoClaro: bodyElement?.classList.contains('modo_claro-govco'),
      clases: bodyElement?.className
    });

    if (botoncontraste) {
      // Toggle del botón de contraste
      const wasActive = botoncontraste.classList.contains('active-barra-accesibilidad-govco');
      console.log('📋 Botón contraste estaba activo:', wasActive);
      
      if (!wasActive) {
        botoncontraste.classList.add('active-barra-accesibilidad-govco');
        this.isContrastActive.set(true);
      } else {
        botoncontraste.classList.remove('active-barra-accesibilidad-govco');
        this.isContrastActive.set(false);
      }
    }

    // Desactivar otros botones
    if (botondisminuir?.classList.contains('active-barra-accesibilidad-govco')) {
      botondisminuir.classList.remove('active-barra-accesibilidad-govco');
      this.isDecreaseActive.set(false);
    }
    if (botonaumentar?.classList.contains('active-barra-accesibilidad-govco')) {
      botonaumentar.classList.remove('active-barra-accesibilidad-govco');
      this.isIncreaseActive.set(false);
    }

    // Cambiar modo de contraste en toda la página
    if (bodyElement) {
      const isDarkMode = bodyElement.classList.contains('modo_oscuro-govco');
      console.log('🌓 Modo oscuro activo:', isDarkMode);
      
      if (isDarkMode) {
        // Cambiar a modo claro
        bodyElement.classList.remove('modo_oscuro-govco');
        bodyElement.classList.add('modo_claro-govco');
        console.log('✅ Cambiado a modo claro');
        this.saveDarkModePreference(false);
        
        // Verificar estilos aplicados
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(bodyElement);
          console.log('🎨 Estilos computados en modo claro:', {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            clases: bodyElement.className
          });
        }, 100);
      } else {
        // Cambiar a modo oscuro
        bodyElement.classList.remove('modo_claro-govco');
        bodyElement.classList.add('modo_oscuro-govco');
        console.log('✅ Cambiado a modo oscuro');
        this.saveDarkModePreference(true);
        
        // Verificar estilos aplicados
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(bodyElement);
          console.log('🎨 Estilos computados en modo oscuro:', {
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color,
            clases: bodyElement.className
          });
        }, 100);
      }
      
      console.log('📋 Nuevo estado del body:', {
        modoOscuro: bodyElement.classList.contains('modo_oscuro-govco'),
        modoClaro: bodyElement.classList.contains('modo_claro-govco'),
        clases: bodyElement.className
      });
    }
  }

  disminuirTamanio() {
    const botoncontraste = document.getElementById('botoncontraste');
    const botonaumentar = document.getElementById('botonaumentar');
    const botondisminuir = document.getElementById('botondisminuir');

    if (botondisminuir && !botondisminuir.classList.contains('active-barra-accesibilidad-govco')) {
      botondisminuir.classList.toggle('active-barra-accesibilidad-govco');
      this.isDecreaseActive.set(true);
    }

    // Desactivar otros botones
    if (botonaumentar?.classList.contains('active-barra-accesibilidad-govco')) {
      botonaumentar.classList.remove('active-barra-accesibilidad-govco');
      this.isIncreaseActive.set(false);
    }
    if (botoncontraste?.classList.contains('active-barra-accesibilidad-govco')) {
      botoncontraste.classList.remove('active-barra-accesibilidad-govco');
      this.isContrastActive.set(false);
    }

    // Disminuir tamaño de fuente
    this.adjustFontSize('disminuir');
  }

  aumentarTamanio() {
    const botoncontraste = document.getElementById('botoncontraste');
    const botonaumentar = document.getElementById('botonaumentar');
    const botondisminuir = document.getElementById('botondisminuir');

    if (botonaumentar && !botonaumentar.classList.contains('active-barra-accesibilidad-govco')) {
      botonaumentar.classList.toggle('active-barra-accesibilidad-govco');
      this.isIncreaseActive.set(true);
    }

    // Desactivar otros botones
    if (botondisminuir?.classList.contains('active-barra-accesibilidad-govco')) {
      botondisminuir.classList.remove('active-barra-accesibilidad-govco');
      this.isDecreaseActive.set(false);
    }
    if (botoncontraste?.classList.contains('active-barra-accesibilidad-govco')) {
      botoncontraste.classList.remove('active-barra-accesibilidad-govco');
      this.isContrastActive.set(false);
    }

    // Aumentar tamaño de fuente
    this.adjustFontSize('aumentar');
  }

  private adjustFontSize(operador: 'aumentar' | 'disminuir') {
    // Obtener todos los elementos de texto de toda la página
    const texto = document.getElementsByTagName('p');
    const titulos = document.getElementsByTagName('h1');
    const titulos2 = document.getElementsByTagName('h2');
    const titulos3 = document.getElementsByTagName('h3');
    const titulos4 = document.getElementsByTagName('h4');
    const titulos5 = document.getElementsByTagName('h5');
    const titulos6 = document.getElementsByTagName('h6');
    const spans = document.getElementsByTagName('span');
    const divs = document.getElementsByTagName('div');
    const lis = document.getElementsByTagName('li');
    const anchors = document.getElementsByTagName('a');

    // Combinar todos los elementos en un solo array
    const todosLosElementos = [
      ...Array.from(texto),
      ...Array.from(titulos),
      ...Array.from(titulos2),
      ...Array.from(titulos3),
      ...Array.from(titulos4),
      ...Array.from(titulos5),
      ...Array.from(titulos6),
      ...Array.from(spans),
      ...Array.from(divs),
      ...Array.from(lis),
      ...Array.from(anchors)
    ];

    for (const element of todosLosElementos) {
      const total = this.tamanioElemento(element);
      let nuevoTamanio: number;

      if (operador === 'aumentar') {
        if (total <= 64) {
          nuevoTamanio = total + 1;
        } else {
          continue; // No aumentar si ya está en el máximo
        }
      } else {
        nuevoTamanio = total - 1;
        if (nuevoTamanio < 8) continue; // No disminuir por debajo de 8px
      }

      element.style.fontSize = nuevoTamanio + 'px';
    }
  }

  private tamanioElemento(element: Element): number {
    const tamanioParrafo = window.getComputedStyle(element, null).getPropertyValue('font-size');
    return parseFloat(tamanioParrafo);
  }

  private loadDarkModePreference() {
    const savedMode = localStorage.getItem('unp-dark-mode');
    const bodyElement = document.body;
    
    if (savedMode === 'dark' && bodyElement) {
      bodyElement.classList.remove('modo_claro-govco');
      bodyElement.classList.add('modo_oscuro-govco');
      
      const botoncontraste = document.getElementById('botoncontraste');
      botoncontraste?.classList.add('active-barra-accesibilidad-govco');
      this.isContrastActive.set(true);
      
      console.log('🌙 Modo oscuro recuperado desde localStorage');
    }
  }

  private saveDarkModePreference(isDark: boolean) {
    localStorage.setItem('unp-dark-mode', isDark ? 'dark' : 'light');
    console.log('💾 Preferencia de modo guardada:', isDark ? 'oscuro' : 'claro');
  }
}
