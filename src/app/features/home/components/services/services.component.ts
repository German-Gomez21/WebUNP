import { Component } from '@angular/core';

@Component({
    selector: 'services-component',
    standalone: true,
    template: `
        <!-- Servicios y Rutas de Atención -->
        <section class="section">
            <div class="container">
                <div class="section__header">
                    <h2 class="section__title">Servicios y Rutas de Atención</h2>
                    <p class="section__subtitle">Múltiples canales para atenderte</p>
                </div>
                
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">description</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Gestione sus medidas de protección</h3>
                            <p class="service-card__description">Trámites, Otros Procedimientos Administrativos</p>
                            <p class="service-card__detail">Accede a todos los servicios de gestión de medidas de protección</p>
                        </div>
                    </div>
                    
                    <div class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">edit</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Licitaciones y contratación</h3>
                            <p class="service-card__description">Planes anuales de adquisiciones y manuales de contratación</p>
                            <p class="service-card__detail">Consulta toda la información sobre procesos de contratación</p>
                        </div>
                    </div>
                    
               
                        
                    <!--Seccion funcional para agregar link-->
                    <a href="/linea-vida-103/" target="_blank" class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">call</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Línea de Emergencia</h3>
                            <p class="service-card__description">Línea vida 103. Línea Gratuita – Marque 103 desde cualquier operador</p>
                            <p class="service-card__detail">Atención inmediata en situaciones de emergencia</p>
                        </div>
                    </a>
                    

                    
                    
                    <div class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">menu_book</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Notificaciones</h3>
                            <p class="service-card__description">Notificaciones Administrativas, Judiciales, Boletines Jurídicos, Control Disciplinario Interno y Actas Contentivas de los Acuerdos Conciliatorios</p>
                            <p class="service-card__detail">Accede a todas las notificaciones y comunicados oficiales</p>
                        </div>
                    </div>
                    
                    <a href="https://cp.usastreams.com/pr2g/APPlayerRadioHTML5.aspx?stream=https://radio.hqs.com.co:9004/stream&fondo=09&formato=mpeg&color=14&titulo=2&autoStart=1&vol=5&tipo=3&nombre=UNP+RADIO+EN+VIVO&botonPlay=2&imagen=https://i.postimg.cc/Gmxv0StD/nuevologoradio.png&opt=big" target="_blank" class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">headphones</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">UNP Radio (Señal en Vivo)</h3>
                            <p class="service-card__description">A un clic de Distancia</p>
                            <p class="service-card__detail">Escucha nuestra señal en vivo desde cualquier lugar</p>
                        </div>
                    </a>
                    
                    <div class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">child_care</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Zona Infantil</h3>
                            <p class="service-card__description">Los niños y niñas de Colombia pueden conocer la principal información acerca de la UNP</p>
                            <p class="service-card__detail">Espacio educativo y seguro para los más pequeños</p>
                        </div>
                    </div>
                    
                    <div class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">badge</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Certificaciones Contratistas</h3>
                            <p class="service-card__description">Certificaciones de contratos (OPS) para contratistas a partir de la vigencia 2023</p>
                            <p class="service-card__detail">Obtén tus certificaciones como contratista de la UNP</p>
                        </div>
                    </div>
                    
                    <a href="pqrsd.html" class="service-card">
                        <div class="service-card__icon">
                            <i class="material-icons service-card__icon-text">question_answer</i>
                        </div>
                        <div class="service-card__content">
                            <h3 class="service-card__title">Portal PQRSD</h3>
                            <p class="service-card__description">Peticiones, Quejas, Reclamos, Sugerencias y Denuncias</p>
                            <p class="service-card__detail">Canal directo para comunicarte con la UNP</p>
                        </div>
                    </a>
                </div>
            </div>
        </section>
  `
})
export class ServicesComponent {
    constructor() { }
}
