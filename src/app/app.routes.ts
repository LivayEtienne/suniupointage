import { Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ReussiComponent } from './reussi/reussi.component';
import { ApprenantComponent } from './apprenant/apprenant.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection par défaut vers login
  { path: 'login', component: AuthentificationComponent },  // Page de connexion
  { path: 'reussi', component: ReussiComponent },  // Page après connexion réussie
  { path: 'apprenant', component: ApprenantComponent }, // Page des apprenants
  { path: '**', redirectTo: '/login' },  // Redirection par défaut pour les URL non valides
  //{ path: 'apprenant', component: ApprenantComponent }, // Page des apprenants
];
