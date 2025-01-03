import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CohorteService, Cohorte } from '../cohorte.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import Swal from 'sweetalert2'; // Importation de SweetAlert2

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

  constructor(private cohorteService: CohorteService) {}

  ngOnInit() {
    this.loadCohortes(); // Charger les cohortes au démarrage
  }

  loadCohortes() {
    this.cohorteService.getCohortes().subscribe({
      next: (data) => {
        this.cohortes = data;
        console.log('Cohortes chargées :', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cohortes :', error);
        Swal.fire('Erreur', 'Impossible de charger les cohortes.', 'error'); // SweetAlert pour l'erreur
      },
    });
  }

  openAddCohorteForm() {
    this.isAddCohorteFormVisible = true;
  }

  cancelAddCohorte() {
    this.isAddCohorteFormVisible = false;
    this.newCohorte = { nom: '', code: '', date_de_creation: '' };
    this.loadCohortes();
  }

  /* addCohorte() {
    if (this.newCohorte.nom.trim() && this.newCohorte.code.trim() && this.newCohorte.date_de_creation) {
      this.cohorteService.addCohorte(this.newCohorte).subscribe({
        next: (data) => {
          this.cohortes.push(data); // Ajouter la cohorte à la liste
          this.cancelAddCohorte(); // Réinitialiser le formulaire
          console.log('Cohorte ajoutée :', data);
          Swal.fire('Succès', 'La cohorte a été ajoutée.', 'success'); // SweetAlert pour le succès
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la cohorte :', error);
          Swal.fire('Erreur', 'Impossible d\'ajouter la cohorte.', 'error'); // SweetAlert pour l'erreur
        },
      });
    } else {
      Swal.fire('Erreur', 'Tous les champs sont obligatoires.', 'error'); // SweetAlert pour champs vides
    }
  }
 */

/* 
  addCohorte() {
    if (this.newCohorte.nom.trim() && this.newCohorte.code.trim() && this.newCohorte.date_de_creation) {
      // Vérifier si le nom de la cohorte existe déjà
      this.cohorteService.checkCohorteNameExists(this.newCohorte.nom).subscribe({
        next: (exists) => {
          if (exists) {
            Swal.fire('Erreur', 'Une cohorte avec ce nom existe déjà.', 'error');
          } else {
            // Ajouter la cohorte si le nom est unique
            this.cohorteService.addCohorte(this.newCohorte).subscribe({
              next: (data) => {
                this.cohortes.push(data);
                this.cancelAddCohorte();
                Swal.fire('Succès', 'La cohorte a été ajoutée.', 'success');
              },
              error: (error) => {
                console.error('Erreur lors de l\'ajout de la cohorte :', error);
                Swal.fire('Erreur', 'Impossible d\'ajouter la cohorte.', 'error');
              },
            });
          }
        },
        error: (error) => {
          console.error('Erreur lors de la vérification du nom de la cohorte :', error);
          Swal.fire('Erreur', 'Impossible de vérifier le nom de la cohorte.', 'error');
        },
      });
    } else {
      Swal.fire('Erreur', 'Tous les champs sont obligatoires.', 'error');
    }
  } */


  addCohorte() {
    if (this.newCohorte.nom.trim() && this.newCohorte.code.trim() && this.newCohorte.date_de_creation) {
      
      // Vérifier si la date d'ajout est antérieure ou égale à la date actuelle
      const currentDate = new Date();
      const inputDate = new Date(this.newCohorte.date_de_creation);

      if (inputDate > currentDate) {
        Swal.fire('Erreur', 'La date de création ne peut pas être dans le futur.', 'error');
        return;
      }

      // Vérifier si le nom de la cohorte existe déjà
      this.cohorteService.checkCohorteNameExists(this.newCohorte.nom).subscribe({
        next: (exists) => {
          if (exists) {
            Swal.fire('Erreur', 'Une cohorte avec ce nom existe déjà.', 'error');
          } else {
            // Ajouter la cohorte si le nom est unique et la date est valide
            this.cohorteService.addCohorte(this.newCohorte).subscribe({
              next: (data) => {
                this.cohortes.push(data);
                this.cancelAddCohorte();
                Swal.fire('Succès', 'La cohorte a été ajoutée.', 'success');
              },
              error: (error) => {
                console.error('Erreur lors de l\'ajout de la cohorte :', error);
                Swal.fire('Erreur', 'Impossible d\'ajouter la cohorte.', 'error');
              },
            });
          }
        },
        error: (error) => {
          console.error('Erreur lors de la vérification du nom de la cohorte :', error);
          Swal.fire('Erreur', 'Impossible de vérifier le nom de la cohorte.', 'error');
        },
      });
    } else {
      Swal.fire('Erreur', 'Tous les champs sont obligatoires.', 'error');
    }
  }
  enableEditing(cohorte: Cohorte): void {
    this.editingCohorteId = cohorte.id!;
    this.newCohorteName = cohorte.nom;
  }

  updateCohorteName(cohorte: Cohorte): void {
    if (!this.newCohorteName.trim()) {
      Swal.fire('Erreur', 'Le nom de la cohorte ne peut pas être vide.', 'error'); // SweetAlert pour nom vide
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
        Swal.fire('Succès', 'La cohorte a été mise à jour.', 'success'); // SweetAlert pour le succès
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        Swal.fire('Erreur', 'Impossible de mettre à jour la cohorte.', 'error'); // SweetAlert pour erreur de mise à jour
      }
    });
  }

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
        Swal.fire('Erreur', 'Impossible de charger la cohorte avec les étudiants.', 'error'); // SweetAlert pour erreur de chargement
      },
    });
  }
}
