

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CohorteService, Cohorte } from '../cohorte.service';
import { DasbordComponent } from '../dasbord/dasbord.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-cohorte',
  standalone: true, // Utilisation des composants autonomes
  imports: [CommonModule, FormsModule, DasbordComponent, SidebarComponent], // Modules nécessaires
  templateUrl: './cohorte.component.html',
  styleUrls: ['./cohorte.component.css'],
  providers: [CohorteService], // Fournisseur du service
})
export class CohorteComponent implements OnInit {
  cohortes: Cohorte[] = []; // Liste des cohortes
  isAddCohorteFormVisible: boolean = false; // Indicateur pour afficher/masquer le formulaire
  newCohorte: Cohorte = { nom: '', code: '', date_de_creation: '' }; // Nouveau modèle de cohorte

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
}