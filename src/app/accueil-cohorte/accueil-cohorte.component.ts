import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CohorteService } from '../cohorte.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil-cohorte',
  imports: [SidebarComponent, DashboardComponent, CommonModule],
  templateUrl: './accueil-cohorte.component.html',
  styleUrls: ['./accueil-cohorte.component.css'], // Attention au pluriel ici !
})
export class AccueilCohorteComponent implements OnInit {
  // Variable pour stocker les cohortes
  cohortes: any[] = [];

  constructor(private cohorteService: CohorteService, private router: Router) {}

  ngOnInit(): void {
    // Appel de la méthode pour récupérer les cohortes au chargement du composant
    this.cohorteService.getCohortes().subscribe(
      (data) => {
        this.cohortes = data; // Stocker les cohortes récupérées
        console.log('Cohortes récupérées', this.cohortes);
      },
      (error) => {
        console.error('Erreur lors de la récupération des cohortes', error);
      }
    );
  }

  // Méthode pour naviguer vers le composant CohorteComponent
  naviguerVersCohorte(): void {
    this.router.navigate(['/cohorte']);
  }
}
