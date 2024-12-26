import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apprenant',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './apprenant.component.html',
  styleUrls: ['./apprenant.component.css'],
})

export class ApprenantComponent implements OnInit {
  apprenants: any[] = [];
  isEditMode: boolean = false;
  selectedApprenant: any = null;

  // Variables pour le formulaire
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  role: string = 'apprenant'; // Rôle par défaut
  adresse: string = '';
  telephone: string = '';
  fonction: string = '';
  cohorte: string = '';
  isModalOpen: boolean = false;
  errorMessage: string = '';

  // Variables pour la pagination
  currentPage: number = 1;  // Page actuelle
  itemsPerPage: number = 5;  // Nombre d'éléments par page
  totalItems: number = 0;    // Total des éléments

  constructor() {}

  ngOnInit(): void {
    this.loadApprenants();
  }

  loadApprenants(): void {
    // Simuler des données pour tester sans service
    this.apprenants = [
      { id: 1, user: { nom: 'John', prenom: 'Doe', email: 'john.doe@example.com', role: 'apprenant', adresse: '123 rue', telephone: '1234567890', fonction: 'Étudiant' }, cohorte: { id: 'C1', name: 'Cohorte 1' } },
      { id: 2, user: { nom: 'Jane', prenom: 'Doe', email: 'jane.doe@example.com', role: 'apprenant', adresse: '456 rue', telephone: '9876543210', fonction: 'Étudiant' }, cohorte: { id: 'C2', name: 'Cohorte 2' } },
    ];
    this.totalItems = this.apprenants.length;
  }

  get paginatedApprenants() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.apprenants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nom = '';
    this.prenom = '';
    this.email = '';
    this.password = '';
    this.role = 'apprenant';
    this.adresse = '';
    this.telephone = '';
    this.fonction = '';
    this.cohorte = '';
    this.errorMessage = '';
    this.isEditMode = false;
    this.selectedApprenant = null;
  }

  onSubmit(): void {
    const apprenantData = {
      user: {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        role: this.role,
        adresse: this.adresse,
        telephone: this.telephone,
        fonction: this.fonction,
      },
      cohorte: { id: this.cohorte },
    };

    if (this.isEditMode && this.selectedApprenant) {
      // Mettre à jour un apprenant
      const index = this.apprenants.findIndex(a => a.id === this.selectedApprenant.id);
      if (index !== -1) {
        this.apprenants[index] = { ...this.apprenants[index], ...apprenantData };
        alert('Apprenant mis à jour avec succès');
      }
    } else {
      // Ajouter un nouvel apprenant
      const newId = this.apprenants.length ? Math.max(...this.apprenants.map(a => a.id)) + 1 : 1;
      this.apprenants.push({ id: newId, ...apprenantData });
      alert('Apprenant ajouté avec succès');
    }
    this.loadApprenants();
    this.closeModal();
  }

  openEditModal(apprenant: any): void {
    this.isEditMode = true;
    this.selectedApprenant = { ...apprenant };
    this.nom = apprenant.user.nom;
    this.prenom = apprenant.user.prenom;
    this.email = apprenant.user.email;
    this.role = apprenant.user.role;
    this.adresse = apprenant.user.adresse;
    this.telephone = apprenant.user.telephone;
    this.fonction = apprenant.user.fonction;
    this.cohorte = apprenant.cohorte.id;
    this.openModal();
  }

  onAddClick(): void {
    this.resetForm();
    this.openModal();
  }

  deleteApprenant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      this.apprenants = this.apprenants.filter(apprenant => apprenant.id !== id);
      alert('Apprenant supprimé avec succès');
      this.loadApprenants();
    }
  }
}
