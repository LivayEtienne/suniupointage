import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { ButtonlectureComponent } from './buttonlecture/buttonlecture.component';
import { DashvigileComponent } from './dashvigile/dashvigile.component';
import { VigileComponent } from './vigile/vigile.component';
import { Auth1Component } from './auth1/auth1.component';
import { EmployerComponent } from './employer/employer.component';
import { CohorteComponent } from './cohorte/cohorte.component';
import { DepartmentComponent } from './department/department.component';

import { AuthGuard } from './auth.guard'; // Import du AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: AuthComponent },  

  // Routes protégées
  { path: 'dasbord', component: DasbordComponent },
  { path: 'pointage', component: PointageComponent, canActivate: [AuthGuard] },
  { path: 'cohorte', component: CohorteComponent, canActivate: [AuthGuard] },
  { path: 'departement', component: DepartmentComponent, canActivate: [AuthGuard] },
  { path: 'apprenant', component: ApprenantComponent, canActivate: [AuthGuard] },
  { path: 'historique', component: HistoriqueComponent, canActivate: [AuthGuard] },
  { path: 'auth1', component: Auth1Component, canActivate: [AuthGuard] },
  { path: 'dashvigile', component: DashvigileComponent, canActivate: [AuthGuard] },
  { path: 'vigile', component: VigileComponent },
  { path: 'employer', component: EmployerComponent, canActivate: [AuthGuard] },
  { path: 'buttonlecture', component: ButtonlectureComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '/login' } // Redirection pour les URL non valides
];
