import { Routes } from '@angular/router';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { VigileComponent } from './vigile/vigile.component';  
import { ButtonlectureComponent } from './buttonlecture/buttonlecture.component';
export const routes: Routes = [
    { path: '', redirectTo: 'button', pathMatch: 'full'},
    { path: 'button', component: ButtonlectureComponent},
    { path: 'apprenants', component: ApprenantComponent},
    { path: 'vigile', component: VigileComponent},
];
