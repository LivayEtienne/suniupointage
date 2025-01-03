

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CohorteService, Cohorte } from '../cohorte.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-cohorte',
  standalone: true, // Utilisation des composants autonomes
  imports: [CommonModule, FormsModule, DashboardComponent, SidebarComponent], // Modules nécessaires
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css'],
  providers: [CohorteService], // Fournisseur du service
})
export class CohorteComponent implements OnInit {
  cohortes: Cohorte[] = []; // Liste des cohortes
  isAddCohorteFormVisible: boolean = false; // Indicateur pour afficher/masquer le formulaire
  newCohorte: Cohorte = { nom: '', code: '', date_de_creation: '' }; // Nouveau modèle de cohorte

    // Propriétés ajoutées
    isApprenantsModalVisible: boolean = false; // Gérer l'affichage du modal
    selectedCohorteId: number | null = null; // ID de la cohorte sélectionnée pour afficher les apprenants
   
    apprenants: any[] = []; // Liste des apprenants d'une cohorte
    


  editingCohorteId: number | null = null; // ID de la cohorte en cours d'édition
  newCohorteName: string = ''; // Nouveau nom temporaire

  showApprenants(cohorteId: number): void {
    this.selectedCohorteId = cohorteId;
    this.isApprenantsModalVisible = true;

    this.cohorteService.getApprenants(cohorteId).subscribe({
      next: (apprenants) => {
        this.apprenants = apprenants;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des apprenants :', error);
      },
    });
  }

  closeApprenantsModal(): void {
    this.isApprenantsModalVisible = false;
    this.selectedCohorteId = null;
    this.apprenants = [];
  }

  constructor(private cohorteService: CohorteService) {}

  ngOnInit() {
    this.loadCohortes(); // Charger les cohortes au démarrage
  }

  /**
   * Charge toutes les cohortes depuis le service.
   */
  loadCohortes() {
    this.cohorteService.getCohortes().subscribe({
      next: (data) => {
        this.cohortes = data;
        console.log('Cohortes chargées :', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cohortes :', error);
      },
    });
  }

  /**
   * Ouvre le formulaire pour ajouter une cohorte.
   */
  openAddCohorteForm() {
    this.isAddCohorteFormVisible = true;
  }

  /**
   * Annule l'ajout d'une cohorte et réinitialise le formulaire.
   */
  cancelAddCohorte() {
    this.isAddCohorteFormVisible = false;
    this.newCohorte = { nom: '', code: '', date_de_creation: '' };
    this.loadCohortes(); 
  }

  /**
   * Ajoute une nouvelle cohorte via le service.
   */
  addCohorte() {
    if (this.newCohorte.nom.trim() && this.newCohorte.code.trim() && this.newCohorte.date_de_creation) {
      this.cohorteService.addCohorte(this.newCohorte).subscribe({
        next: (data) => {
          this.cohortes.push(data); // Ajouter la cohorte à la liste
          this.cancelAddCohorte(); // Réinitialiser le formulaire
          console.log('Cohorte ajoutée :', data);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la cohorte :', error);
        },
      });
    } else {
      console.log('Tous les champs sont obligatoires');
    }
  }



  // Active le mode édition pour une cohorte
  enableEditing(cohorte: Cohorte): void {
    this.editingCohorteId = cohorte.id!;
    this.newCohorteName = cohorte.nom;
  }

  // Met à jour le nom de la cohorte
  updateCohorteName(cohorte: Cohorte): void {
    if (!this.newCohorteName.trim()) {
      alert('Le nom de la cohorte ne peut pas être vide.');
      return;
    }

    const updatedCohorte = { nom: this.newCohorteName };

    this.cohorteService.updateCohorte(cohorte.id!, updatedCohorte).subscribe({
      next: (updated) => {
        // Mettez à jour la liste locale
        const index = this.cohortes.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          this.cohortes[index].nom = updated.nom;
        }
        this.cancelEditing();
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        alert('Impossible de mettre à jour la cohorte.');
      }
    });
  }

  // Annule le mode édition
  cancelEditing(): void {
    this.editingCohorteId = null;
    this.newCohorteName = '';
  }

  selectedCohorte: Cohorte | null = null;

loadCohorteWithStudents(id: number) {
  this.cohorteService.getCohorteWithStudents(id).subscribe({
    next: (cohorte) => {
      this.selectedCohorte = cohorte;
      console.log('Cohorte avec étudiants :', cohorte);
    },
    error: (err) => {
      console.error('Erreur lors du chargement de la cohorte :', err);
    },
  });
}



}