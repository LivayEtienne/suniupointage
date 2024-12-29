import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../department.service';
import { HttpClient } from '@angular/common/http';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department',

    standalone: true, // Utilisation des composants autonomes
    imports: [CommonModule, FormsModule, DashboardComponent,SidebarComponent], // Modules nécessaires
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
    if (!this.newDepartment.nom || !this.newDepartment.code || !this.newDepartment.date_de_creation) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.departmentService.createDepartment(this.newDepartment).subscribe(
      (response) => {
        console.log('Département ajouté :', response);
        this.getDepartments(); // Recharger la liste des départements
        this.cancelAddDepartment(); // Fermer le formulaire
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du département :', error);
      }
    );
  }
}
