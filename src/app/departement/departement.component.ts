import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrls: ['./departement.component.css']
})
export class DepartementComponent implements OnInit {
  departments: Department[] = [];
  isAddDepartmentFormVisible: boolean = false;
  newDepartment: Department = {
    nom: '',
    code: '',
    date_de_creation: ''
  };

  constructor() {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    // Exemple de données locales pour initialiser la liste des départements
    this.departments = [
      { nom: 'Informatique', code: 'INFO', date_de_creation: '2020-01-15' },
      { nom: 'Mathematiques', code: 'MATH', date_de_creation: '2019-09-01' }
    ];
    console.log('Départements chargés :', this.departments);
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
      this.departments.push({ ...this.newDepartment });
      this.cancelAddDepartment();
      console.log('Département ajouté :', this.newDepartment);
    } else {
      console.log('Tous les champs sont obligatoires.');
    }
  }
}
