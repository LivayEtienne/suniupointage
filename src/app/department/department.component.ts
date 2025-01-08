import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';
import { HttpClient } from '@angular/common/http';
import { SidebareComponent } from '../sidebare/sidebare.component';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-department',

    standalone: true, // Utilisation des composants autonomes
    imports: [CommonModule, FormsModule, SidebareComponent,DashboardComponent], // Modules nécessaires
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

  // Ajouter un département
  addDepartment(): void {
    console.log('Tentative d\'ajout d\'un département'); // Log initial
  
    if (!this.newDepartment.nom || !this.newDepartment.code || !this.newDepartment.date_de_creation) {
      console.error('Formulaire invalide. Champs requis manquants.', this.newDepartment);
      alert('Veuillez remplir tous les champs');
      return;
    }
  
    console.log('Données envoyées pour ajout :', this.newDepartment);
  
    this.departmentService.createDepartment(this.newDepartment).subscribe(
      (response) => {
        console.log('Département ajouté avec succès :', response);
        this.getDepartments(); // Recharger la liste des départements
        this.cancelAddDepartment(); // Fermer le formulaire
        this.getDepartments();
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du département :', error);
      }
    );
  }
  
}
