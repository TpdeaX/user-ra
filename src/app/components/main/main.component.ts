import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private router: Router) {} // Inyectamos el servicio Router

  startAdventure() {
    const overlay = document.getElementById('transition-overlay');
    overlay?.classList.add('active'); // Usa el operador de seguridad "?" en caso de que no encuentre el elemento.

    // Redirige después de la animación (600ms coincide con el tiempo de transición CSS)
    setTimeout(() => {
      window.location.href = '/exp-ra';
    }, 600);
  }
}
