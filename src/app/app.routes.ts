 import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DepartmentComponent } from './department/department.component';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { Component } from '@angular/core';
import { ButtonlectureComponent } from './buttonlecture/buttonlecture.component';
import { DashvigileComponent } from './dashvigile/dashvigile.component';
import { VigileComponent } from './vigile/vigile.component';
import { Auth1Component } from './auth1/auth1.component';

/*  import { DepartementComponent } from './departement/departement.component';  */

import { CohorteComponent } from './cohorte/cohorte.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection par défaut vers login
  { path: 'login', component: AuthComponent },  // Page de connexion
  { path: 'dasbord', component: DasbordComponent },  // Page du tableau de bord
  { path: 'pointage', component: PointageComponent },  // Page de pointage
  { path: 'cohorte', component: CohorteComponent},
  { path: 'departement', component: DepartmentComponent},
  { path: 'apprenant', component: ApprenantComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'auth1', component: Auth1Component },
  { path: 'dashvigile', component: DashvigileComponent},
  { path: 'vigile', component: VigileComponent},
  
  
  { path: 'buttonlecture', component: ButtonlectureComponent },
  { path: '**', redirectTo: '/' } , // Redirection par défaut pour les URL non valide

 // { path: '', redirectTo: '/dasboard', pathMatch: 'full' }

  ];
