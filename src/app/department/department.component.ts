import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { SidebareComponent } from '../sidebare/sidebare.component';
import { CompteurComponent } from '../compteur/compteur.component';


import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department',

    standalone: true, // Utilisation des composants autonomes
    imports: [CommonModule, FormsModule, SidebareComponent, CompteurComponent ], // Modules nécessaires
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];
  isAddDepartmentFormVisible: boolean = false; // Pour gérer la visibilité du formulaire
  newDepartment = {
    nom: '',
    code: '',
    date_de_creation: ''
  };
  editingDepartmentId: number | null = null; // ID du département en cours d'édition
updatedDepartmentName: string = ''; // Nouveau nom du département


  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.getDepartments();
  }

  // Récupérer les départements depuis le service
  getDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (data) => {
        console.log('Départements récupérés :', data);
        this.departments = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des départements :', error);
      }
    );
  }

  // Ouvrir le formulaire d'ajout de département
  openAddDepartmentForm(): void {
    this.isAddDepartmentFormVisible = true;
  }

  // Annuler l'ajout de département
  cancelAddDepartment(): void {
    this.isAddDepartmentFormVisible = false;
  }

 


  // Vérifier que la date de création est antérieure ou égale à la date actuelle
  isValidDate(date: string): boolean {
    const currentDate = new Date();
    const inputDate = new Date(date);
    return inputDate <= currentDate;
  }

   
      // Ajouter un département
  addDepartment(): void {
    if (!this.newDepartment.nom || !this.newDepartment.code || !this.newDepartment.date_de_creation) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Veuillez remplir tous les champs'
      });
      return;
    }

    // Vérifier la date
    if (!this.isValidDate(this.newDepartment.date_de_creation)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La date de création ne peut pas être dans le futur.'
      });
      return;
    }

    // Vérifier si le nom existe déjà
    this.departmentService.checkDepartmentNameExists(this.newDepartment.nom).subscribe({
      next: (exists) => {
        if (exists) {
          Swal.fire({
            icon: 'error',
            title: 'Nom déjà pris',
            text: 'Un département avec ce nom existe déjà.'
          });
        } else {
          this.departmentService.createDepartment(this.newDepartment).subscribe(
            (response) => {
              console.log('Département ajouté :', response);
              this.getDepartments(); // Recharger la liste des départements
              this.cancelAddDepartment(); // Fermer le formulaire
              Swal.fire({
                icon: 'success',
                title: 'Département ajouté',
                text: 'Le département a été ajouté avec succès'
              });
            },
            (error) => {
              console.error('Erreur lors de l\'ajout du département :', error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de l\'ajout du département'
              });
            }
          );
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification du nom du département :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de vérifier le nom du département.'
        });
      }
    });
  }
    

  enableEditing(department: any): void {
    this.editingDepartmentId = department.id; // Enregistre l'ID du département en cours d'édition
    this.updatedDepartmentName = department.nom; // Pré-remplit le champ avec le nom existant
  }
  

  updateDepartmentName(department: any): void {
    if (!this.updatedDepartmentName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Nom vide',
        text: 'Le nom du département ne peut pas être vide.'
      });
      return;
    }
  
    const updatedDepartment = { ...department, nom: this.updatedDepartmentName };
  
    this.departmentService.updateDepartment(department.id, updatedDepartment).subscribe(
      (response) => {
        console.log('Département mis à jour :', response);
        this.getDepartments(); // Recharge les départements après la mise à jour
        this.editingDepartmentId = null; // Désactive le mode édition
        Swal.fire({
          icon: 'success',
          title: 'Département mis à jour',
          text: 'Le département a été mis à jour avec succès'
        });
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du département :', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la mise à jour du département'
        });
      }
    );
  }
  
  cancelEditing(): void {
    this.editingDepartmentId = null;
    this.updatedDepartmentName = '';
  }
  
  
 
/* deleteDepartment(departmentId: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Vous ne pourrez pas revenir en arrière !',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimer !'
  }).then((result) => {
    if (result.isConfirmed) {
      this.departmentService.deleteDepartment(departmentId).subscribe(
        () => {
          Swal.fire('Supprimé!', 'Le département a été supprimé.', 'success');
          this.getDepartments(); // Recharger la liste des départements après la suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du département :', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
        }
      );
    }
  });
} */

  deleteDepartment(departmentId: number): void {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Veuillez saisir le code secret pour confirmer.',
      icon: 'warning',
      input: 'password', // Champ de saisie
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Code secret'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      preConfirm: (inputValue) => {
        const secretCode = 'khalifa87'; // Le code secret attendu
        if (inputValue !== secretCode) {
          Swal.showValidationMessage('Code secret incorrect !');
          return false;
        }
        return true; // Validation réussie
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(departmentId).subscribe(
          () => {
            Swal.fire('Supprimé!', 'Le département a été supprimé.', 'success');
            this.getDepartments(); // Recharger la liste des départements après la suppression
          },
          (error) => {
            console.error('Erreur lors de la suppression du département :', error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression.', 'error');
          }
        );
      }
    });
  }
  
}