import { Routes } from '@angular/router';
import { ApprenantComponent } from './apprenant/apprenant.component';

export const routes: Routes = [
    { path: '', redirectTo: 'apprenants', pathMatch: 'full'},
    { path: 'apprenants', component: ApprenantComponent}
];
