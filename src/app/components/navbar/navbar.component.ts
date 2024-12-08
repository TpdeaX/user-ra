import { Component, Input, Output, EventEmitter, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, isPlatformBrowser, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule
  ],
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Input() isSidebarCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  isMobile = false;
  showDropdownMenu: boolean = false;

  onMenuButtonClick(): void {
    this.toggleSidebar.emit();
  }

  toggleSideBar(): void {
    // Puedes implementar la lógica aquí si es necesario
  }

  goToProfile(): void {
    // Puedes implementar la lógica para redirigir al perfil aquí si es necesario
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize', [])
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }


  private checkScreenSize() {
    const toolbarWidth = document.querySelector('.toolbar-container')?.clientWidth || 0;
    const titleWidth = document.querySelector('.title')?.clientWidth || 0;
    const rightButtonsWidth = document.querySelector('.toolbar-section-right')?.clientWidth || 0;

    // Lógica para habilitar/deshabilitar el menú desplegable según el espacio disponible
    this.isMobile = window.innerWidth <= 768; // Detectar móvil
    this.showDropdownMenu = toolbarWidth < titleWidth + rightButtonsWidth + 100; // Ajusta margen
  }

  navigateToExpRa(): void {
    window.location.href = '/exp-ra';
  }  
}
