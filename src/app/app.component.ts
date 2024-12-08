import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SideBarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { SidebarService } from './services/sidebar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,SideBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'user-ra';
  sidebarCollapsed = false;
  isMobile = false; // Detectar si está en dispositivo móvil

  constructor(private sidebarService: SidebarService,
    private breakpointObserver: BreakpointObserver  
  ) {}

  ngOnInit() {
    // Detectar pantallas pequeñas
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.sidebarService.toggleSidebar();  // Alternar el estado en el servicio
    console.log('Sidebar toggled:', this.sidebarCollapsed);
  }

}
