import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { ApprenantComponent } from './apprenant/apprenant.component';

import { DepartementComponent } from './departement/departement.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CohorteComponent } from './cohorte/cohorte.component';
import { EmployeeComponent } from './employee/employee.component';
import { SidebarComponent } from './sidebar/sidebar.component';


export const routes: Routes = [
   
    {
        path: 'apprenant',
        component: ApprenantComponent  // Correction ici (minuscule)
    },
    
    /* {
        path: '',
        redirectTo: 'connexion',
        pathMatch: 'full'  // Correction ici (slash aprÃ¨s connexion)
    }, */
    {
        path: 'departement',
        component: DepartementComponent
    },
    {
        path: 'cohorte',
        component: CohorteComponent
    },
    {
        path: 'employe',
        component: EmployeeComponent   // Correction ici (minuscule)
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'sidebar',
        component: SidebarComponent
    }
    
];