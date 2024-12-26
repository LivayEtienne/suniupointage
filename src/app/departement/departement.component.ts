
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../departement.service';

interface Department {
  nom: string;
  code: string;
  date_de_creation: string;
}

@Component({
  selector: 'app-departement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.css'],
  providers: [DepartmentService]
})
export class DepartementComponent implements OnInit {
  departments: Department[] = [];
  isAddDepartmentFormVisible: boolean = false;
  newDepartment: Department = {
    nom: '',
    code: '',
    date_de_creation: ''
  };

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        console.log('Départements chargés :', data);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des départements :', error);
      }
    });
  }

  openAddDepartmentForm() {
    this.isAddDepartmentFormVisible = true;
  }

  cancelAddDepartment() {
    this.isAddDepartmentFormVisible = false;
    this.newDepartment = { nom: '', code: '', date_de_creation: '' };
  }

  addDepartment() {
    if (this.newDepartment.nom.trim() && this.newDepartment.code.trim() && this.newDepartment.date_de_creation) {
      this.departmentService.addDepartment(this.newDepartment).subscribe({
        next: (data) => {
          this.departments.push(data);
          this.cancelAddDepartment();
          console.log('Département ajouté :', data);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du département :', error);
        }
      });
    } else {
      console.log('Tous les champs sont obligatoires.');
    }
  }
}
