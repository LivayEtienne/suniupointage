// dasbord.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ApiService } from '../api.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dasbord',
  standalone: true, 
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './dasbord.component.html',
  styleUrl:'./dasbord.component.css',
})

export class DasbordComponent implements OnInit, AfterViewInit {
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


  loadStats() {
    this.apiService.getUserStats().subscribe({
      next: (data) => {
        this.totalUsers = data.totalUsers;
        this.totalVigiles = data.totalVigiles;
        this.totalDepartements = data.totalDepartments;
        this.totalCohortes = data.totalCohortes;
       
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }



  // Charger les données d'historique pour les graphiques
  loadHistoriqueData() {
    this.apiService.getHistoriqueData().subscribe({
      next: (data) => {
        this.historiqueData = data;
        this.prepareLineChartData();
        this.prepareBarChartData();
        this.initializeLineChart();
        this.initializeBarChart();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des historiques:', error);
      }
    });
  }


  // Préparer les données pour le graphique linéaire (heures d'arrivée)
  prepareLineChartData() {
    const heuresArrivee = Array(24).fill(0); // Tableau pour compter le nombre de personnes par heure (0-23 heures)
    const selectedDateObj = new Date(this.selectedDate);
    this.historiqueData.forEach((item: any) => {
      const heureEntree = new Date(item.heure_entree);
      if (heureEntree.toDateString() === selectedDateObj.toDateString()) {
        const heure = heureEntree.getHours();
        heuresArrivee[heure] += 1;
      }
    });

    this.lineChartLabels = Array.from({ length: 15 }, (_, i) => `${i+4}:00`); // Labels de 0h à 23h
    this.lineChartData = heuresArrivee.slice(4, 19); // Données pour le graphique linéaire
  }

  // Préparer les données pour le graphique en barres (jours de la semaine)
  prepareBarChartData() {
    const joursPresence = [0, 0, 0, 0, 0, 0, 0]; // Compteur des présences pour chaque jour de la semaine

    this.historiqueData.forEach((item: any) => {
      const heureEntree = new Date(item.heure_entree);
      const jourSemaine = heureEntree.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
      joursPresence[jourSemaine] += 1; // Incrémenter le compteur pour ce jour de la semaine
    });

    this.barChartData = joursPresence; // Données pour le graphique en barres
  }



  ngAfterViewInit() {
    this.initializeLineChart();
    this.initializeBarChart();
  }

  // Initialiser le graphique linéaire
  private initializeLineChart(): void {
    const ctx = document.querySelector('.line-chart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.lineChartLabels, // Heures d'arrivée (0h, 1h, ..., 23h)
          datasets: [{
            data: this.lineChartData, // Nombre de personnes par heure
            borderColor: '#818cf8',
            backgroundColor: 'rgba(129, 140, 248, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              },
               ticks: {
              stepSize: 1
            }
            }
          },
          maintainAspectRatio: false
        }
      });
    }
  }

  // Initialiser le graphique en barres
  private initializeBarChart(): void {
    const ctx = document.querySelector('.bar-chart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.barChartLabels, // Jours de la semaine
          datasets: [{
            data: this.barChartData, // Nombre de personnes par jour
            backgroundColor: ['#fbbf24', '#ef4444', '#fbbf24', '#ef4444', '#fbbf24', '#ef4444', '#fbbf24']
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: '#f3f4f6'
              }
              ,
               ticks: {
              stepSize: 1
            }
            }
          },
          maintainAspectRatio: false
        }
      });
    }
  }
  onDateChange() {
    this.prepareLineChartData();
    this.initializeLineChart();
  }
}