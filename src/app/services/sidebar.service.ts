import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarStateSubject = new BehaviorSubject<boolean>(false);  // Estado inicial: false
  sidebarState$ = this.sidebarStateSubject.asObservable(); // Hacemos que el estado sea observable

  constructor() {}

  // Método para alternar el estado del sidebar
  toggleSidebar(): void {
    this.sidebarStateSubject.next(!this.sidebarStateSubject.value);  // Cambia el estado
  }

  // Método para obtener el estado actual del sidebar
  getSidebarState(): boolean {
    return this.sidebarStateSubject.value;
  }
}
