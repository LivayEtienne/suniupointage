

import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { VigileComponent } from './vigile/vigile.component';
import { ApprenantComponent } from './apprenant/apprenant.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { DepartementComponent } from './departement/departement.component';

import { CohorteComponent } from './cohorte/cohorte.component';
import { AccueilCohorteComponent } from './accueil-cohorte/accueil-cohorte.component';

export const routes: Routes = [
    {
        path: 'vigile',
        component: VigileComponent  // Correct
    },
    {
        path: 'cohorte',
        component: CohorteComponent
    },
    {
        path: 'accueil-cohorte',
        component: AccueilCohorteComponent
    },
    {
        path: 'apprenant',
        component: ApprenantComponent  // Correction ici (minuscule)
    },
    {
    path: 'connexion',
    component: ConnexionComponent
    }, 
   
    /* {
        path: '',
        redirectTo: 'connexion',
        pathMatch: 'full'  // Correction ici (slash après connexion)
    }, */
    {
        path: 'departement',
        component: DepartementComponent
    },
    
];