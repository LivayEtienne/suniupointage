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
import { AsignComponent } from './asign/asign.component';

import { AuthGuard } from './auth.guard'; // Import du AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: 'login', component: AuthComponent },  

  // Routes protégées
  { path: 'dasbord', component: DasbordComponent },
  { path: 'pointage', component: PointageComponent },
  { path: 'cohorte', component: CohorteComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'apprenant', component: ApprenantComponent },
  { path: 'historique', component: HistoriqueComponent },
  { path: 'auth1', component: Auth1Component },
  { path: 'dashvigile', component: DashvigileComponent },
  { path: 'vigile', component: VigileComponent },
  { path: 'employer', component: EmployerComponent },
  { path: 'buttonlecture', component: ButtonlectureComponent },
  { path: 'asign/:id', component: AsignComponent },// ✅ Route avec ID

  { path: '**', redirectTo: '/login' } // Redirection pour les URL non valides
];
