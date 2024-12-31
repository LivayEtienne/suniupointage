 import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DepartmentComponent } from './department/department.component';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';
import { Component } from '@angular/core';

/*  import { DepartementComponent } from './departement/departement.component';  */

import { CohorteComponent } from './cohorte/cohorte.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection par défaut vers login
  { path: 'login', component: AuthComponent },  // Page de connexion
  { path: 'dasbord', component: DasbordComponent },  // Page du tableau de bord
  { path: 'pointage', component: PointageComponent },  // Page de pointage
  { path: 'cohorte', component: CohorteComponent},
  { path: 'department', component: DepartmentComponent},
  { path: 'historique', component: HistoriqueComponent },
  { path: '**', redirectTo: '/' } , // Redirection par défaut pour les URL non valide

 // { path: '', redirectTo: '/dasboard', pathMatch: 'full' }

  ];
