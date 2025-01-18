import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SidebareComponent } from '../sidebare/sidebare.component';

@Component({
  selector: 'app-compteur',
  standalone: true,
  imports: [FormsModule, SidebareComponent],
  templateUrl: './compteur.component.html',
  styleUrls: ['./compteur.component.css']
})
export class CompteurComponent implements OnInit, AfterViewInit {
  totalUsers: number = 0;
  totalVigiles: number = 0;
  totalDepartements: number = 0;
  totalCohortes: number = 0;
  userStats: any = {};
  historiqueData: any[] = [];  // Données d'historique
  lineChartData: number[] = [];  // Nombre de personnes par heure d'arrivée
  lineChartLabels: string[] = []; // Heures d'arrivée
  barChartData: number[] = []; // Nombre de personnes par jour de la semaine
  barChartLabels: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']; // Jours de la semaine
  selectedDate: string = new Date().toISOString().split('T')[0];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadStats();
    this.loadHistoriqueData();
  }

  ngAfterViewInit() {
    // Exécuter des traitements après l'affichage du composant
  }

  loadStats() {
    this.apiService.getUserStats().subscribe({
      next: (data) => {
        this.totalUsers = data?.totalUsers ?? 0;
        this.totalVigiles = data?.totalVigiles ?? 0;
        this.totalDepartements = data?.totalDepartments ?? 0;
        this.totalCohortes = data?.totalCohortes ?? 0;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }

  loadHistoriqueData() {
    this.apiService.getHistoriqueData().subscribe({
      next: (data) => {
        this.historiqueData = data || [];
        this.prepareLineChartData();
        this.prepareBarChartData();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des historiques:', error);
      }
    });
  }
   // Ajouter la méthode onDateChange
   onDateChange(newDate: string): void {
    this.selectedDate = newDate;
    this.loadHistoriqueData(); // Recharger les données historiques avec la nouvelle date
  }

  prepareLineChartData() {
    const heuresArrivee = Array(24).fill(0); 
    const selectedDateObj = new Date(this.selectedDate);

    this.historiqueData.forEach((item: any) => {
      const heureEntree = new Date(item.heure_entree);
      if (heureEntree.toDateString() === selectedDateObj.toDateString()) {
        const heure = heureEntree.getHours();
        heuresArrivee[heure] += 1;
      }
    });

    this.lineChartLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    this.lineChartData = heuresArrivee;
  }

  prepareBarChartData() {
    const joursPresence = Array(7).fill(0);

    this.historiqueData.forEach((item: any) => {
      const heureEntree = new Date(item.heure_entree);
      let jourSemaine = heureEntree.getDay(); 
      jourSemaine = jourSemaine === 0 ? 6 : jourSemaine - 1;
      joursPresence[jourSemaine] += 1;
    });

    this.barChartData = joursPresence;
  }
}
