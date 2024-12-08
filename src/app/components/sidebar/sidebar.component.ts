import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener,Input } from '@angular/core';
import { navbarData } from './nav-bar-data';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Si necesitas funcionalidades de Angular comunes

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterModule, CommonModule], // Asegúrate de incluir RouterModule aquí
  standalone: true,
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('250ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('250ms',
          style({opacity: 0})
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('500ms', 
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'})
          ])
        )
      ])
    ])
  ]
})


export class SideBarComponent implements OnInit {
  @Output() onToggleSideNav = new EventEmitter<{collapsed: boolean, screenWidth: number}>();
  @Input() collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768 ) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
    }
  }

  ngOnInit(): void {
      if (typeof window !== 'undefined') {
        this.screenWidth = window.innerWidth;
        //console.log('El objeto window está disponible:', window);
      }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }
}
