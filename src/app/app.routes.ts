import { Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ReussiComponent } from './reussi/reussi.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection par défaut vers login
  { path: 'login', component: AuthentificationComponent },  // Page de connexion
  { path: 'reussi', component: ReussiComponent },  // Page après connexion réussie
  { path: '**', redirectTo: '/login' }  // Redirection par défaut pour les URL non valides
];
