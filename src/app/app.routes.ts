import { Routes } from '@angular/router';
import { DasbordComponent } from './dasbord/dasbord.component';
import { PointageComponent } from './pointage/pointage.component';
import { HistoriqueComponent } from './historique/historique.component';
import { EmployerComponent } from './employer/employer.component';
import { Component } from '@angular/core';
export const routes: Routes = [
    { path: 'dasboard', component: DasbordComponent },
    { path: 'pointage', component: PointageComponent },
    { path: 'historique', component: HistoriqueComponent },
    {path: 'employer' ,component: EmployerComponent},
    { path: '', redirectTo: '/dasboard', pathMatch: 'full' }
];
