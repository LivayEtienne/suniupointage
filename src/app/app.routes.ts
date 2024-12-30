/* import { Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ReussiComponent } from './reussi/reussi.component';
import { DepartementComponent } from './departement/departement.component';
import { CohorteComponent } from './cohorte/cohorte.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection par défaut vers login
  { path: 'login', component: AuthentificationComponent },  // Page de connexion
  { path: 'reussi', component: ReussiComponent },  // Page après connexion réussie
  { path: '**', redirectTo: '/' } , // Redirection par défaut pour les URL non valides
  { path: 'departement', component: DepartementComponent },  // Page détaillant le département
  { path: 'cohorte', component: CohorteComponent } //
];
 */

import { DepartmentComponent } from './department/department.component';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';

import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';

/*  import { DepartementComponent } from './departement/departement.component';  */

import { CohorteComponent } from './cohorte/cohorte.component';

export const routes: Routes = [
    
    {
        path: 'cohorte',
        component: CohorteComponent
    },
    
    
    
   
    /* {
        path: '',
        redirectTo: 'connexion',
        pathMatch: 'full'  // Correction ici (slash aprÃ¨s connexion)
    }, */
    /* {
        path: 'departement',
        component: DepartementComponent
    }, */
    
    {
      path: 'dashboard',
      component: DashboardComponent,
      
    },
    {
      path: 'sidebar',
      component: SidebarComponent,
    },
    {
      path: 'department',
      component: DepartmentComponent
    },

    { path: 'dasboard', component: DasbordComponent },
    { path: 'pointage', component: PointageComponent },
    { path: 'historique', component: HistoriqueComponent },
    { path: '', redirectTo: '/dasboard', pathMatch: 'full' }

];

