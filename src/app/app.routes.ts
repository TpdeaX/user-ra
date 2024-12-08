import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ExperienciaRaComponent } from './components/experiencia-ra/experiencia-ra.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' }, 
  { path: 'main', component: MainComponent },  
  { path: 'exp-ra', component: ExperienciaRaComponent },                    
  { path: '**', redirectTo: 'main' }                
];
