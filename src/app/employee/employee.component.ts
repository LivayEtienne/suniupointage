import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule], // Modules nécessaires
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  newEmployee: any = {
    user_id: null,
    fonction: '',
    id_departement: null,
  };

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    );
  }

  addEmployee() {
    this.employeeService.createEmployee(this.newEmployee).subscribe(
      (response) => {
        console.log('Employé ajouté:', response);
        this.loadEmployees(); // Recharger la liste des employés
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de l\'employé:', error);
      }
    );
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        console.log('Employé supprimé');
        this.loadEmployees(); // Recharger la liste après la suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'employé:', error);
      }
    );
  }
}
