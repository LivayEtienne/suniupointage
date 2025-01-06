import { DashboardService } from './../dashboard.service';

import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  userCount: number = 0;  // Initialisation de la variable pour stocker le nombre d'utilisateurs
  cohorteCount: number = 0;  // Variable pour stocker le nombre de cohortes

  departmentCount: number = 0; 
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getUserCount().subscribe(
      data => {
        this.userCount = data.userCount;  // Récupérer le nombre d'utilisateurs depuis la réponse de l'API
      },
      error => {
        console.error('Erreur lors de la récupération du nombre d\'utilisateurs', error);
      }
    );

    this.dashboardService.getDepartmentCount().subscribe(
      data => {
        this.departmentCount = data.departmentCount;  // Récupère le nombre de départements
      },
      error => {
        console.error('Erreur lors de la récupération du nombre de départements', error);
      }
    );
    this.dashboardService.getCohorteCount().subscribe(
      data => {
        this.cohorteCount = data.cohorteCount;  // Récupère le nombre de cohortes
      },
      error => {
        console.error('Erreur lors de la récupération du nombre de cohortes', error);
      }
    );
  }

  }
  
