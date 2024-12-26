import { Routes } from '@angular/router';
import { DepartementComponent } from './departement/departement.component';
import { ApprenantComponent } from './apprenant/apprenant.component';

export const routes: Routes = [
    { path: '', redirectTo: 'departement', pathMatch: 'full'},
    { path: 'departement', component: ApprenantComponent}
];
