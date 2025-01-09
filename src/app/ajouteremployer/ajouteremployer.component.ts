
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService,IUser,IDepartment } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl, FormGroup  } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ajouteremployer',
  imports: [CommonModule,
    FormsModule,ReactiveFormsModule,],
  templateUrl: './ajouteremployer.component.html',
  styleUrl: './ajouteremployer.component.css'
})
export class AjouteremployerComponent  implements OnInit{
  
  @Output() closeModal = new EventEmitter<void>();
  
  userData: Partial<IUser> = {
    nom: '',
    prenom: '',
    email: '',
    photo: '',
    adresse: '',
    telephone: '',
    role: '',
    statut: 'actif',
    cardId: '',
    historiqueId: 0,
    departement_id: undefined, 
     password: '',
    
  };

  currentPage: number = 1; // Page actuelle
itemsPerPage: number = 10; // Nombre d'utilisateurs par page
paginatedUsers: IUser[] = []; // Liste des utilisateurs affichés
errorMessage = '';  
filteredUsers: IUser[] = []; // Liste des utilisateurs filtrés

  stats = {
    totalUsers: 0,
    totalVigiles: 0,
    totalDepartments: 0,
    totalAdmins: 0
  };
  users: IUser[] = [];
  departments: IDepartment[] = [];
  selectedDepartmentId: string = '';
  isSubmitting = false;
 
  selectedFile: File | null = null;

  constructor(
    private apiService: ApiService) {  }

  ngOnInit() {
    this.loadDepartments();
    this.loadStats();
    this.loadEmployes();  // Recharger les utilisateurs
       
  }
  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (departments) => {
        console.log('Départements:', departments);
        this.departments = departments;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur chargement départements';
      }
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.userData.photo = file;  // Stocke le fichier dans userData
     
    }
  }
  


  loadEmployes(): void {
    this.apiService.getUsersByRole(['admin', 'vigile', 'employe']).subscribe({
      next: (data: IUser[]) => {
        this.users = data;
        this.filteredUsers = data; 
        this.updatePaginatedUsers(); // Mettre à jour les utilisateurs paginés
        this.loadEmployes();  // Recharger les utilisateurs
          
          this.loadStats();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      },
    });
  }

  loadStats(): void {
    this.apiService.getUserStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    });
  }




//partie pagination
updatePaginatedUsers(): void {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
}

  onSubmit() {
    if (!this.isFormValid()) return;
  
    this.isSubmitting = true;
  
    const formData = new FormData();
    formData.append('nom', this.userData.nom || '');
    formData.append('prenom', this.userData.prenom || '');
    formData.append('email', this.userData.email || '');
    formData.append('adresse', this.userData.adresse || '');
    formData.append('telephone', this.userData.telephone || '');
    formData.append('role', this.userData.role || '');
    formData.append('statut', this.userData.statut || 'actif');
    formData.append('departement_id', this.selectedDepartmentId || '');
    if (this.userData.photo instanceof File) {
      formData.append('photo', this.userData.photo); // Ajouter le fichier
    }
    if (this.userData.password) {
      formData.append('mot_de_passe', this.userData.password);
    }
  
    this.apiService.registerUser(formData).subscribe({
      next: (response: IUser) => {
        console.log('Succès:', response);
         Swal.fire('Succès', 'Utilisateur ajouter avec', 'success');
                  
        this.users.push(response); // Ajouter le nouvel utilisateur à la liste
        this.filteredUsers.push(response); // Mettre à jour les utilisateurs filtrés
        this.updatePaginatedUsers(); // Mettre à jour la pagination
        
        this.closeModal.emit();
        this.resetForm();
        this.loadStats(); // Recharger les statistiques
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création';
        this.isSubmitting = false;
      },
    });
  }

  isPrenomValid(): boolean {
    if (!this.userData.prenom) {
      return false; // Considère comme invalide si prénom est undefined
    }
    const prenomPattern = /^[a-zA-ZÀ-ÿ' -]{2,}$/; // Minimum 2 caractères, accepte les espaces
    return prenomPattern.test(this.userData.prenom);
  }
  
  
  isNomValid(): boolean {
    if (!this.userData.nom) {
      return false; // Considère comme invalide si nom est undefined
    }
    const nomPattern = /^[a-zA-ZÀ-ÿ\-']{2,}$/; // Minimum 2 caractères, pas de chiffres
    return nomPattern.test(this.userData.nom);
  }
  
  isEmailValid(): boolean {
    if (!this.userData.email) {
      return false; // Considère comme invalide si email est undefined
    }
    const emailPattern = /\S+@\S+\.\S+/; // Pattern simple pour les emails
    return emailPattern.test(this.userData.email);
  }
  

  isPhoneValid(): boolean {
    if (!this.userData.telephone) {
      return false; // Considère comme invalide si téléphone est undefined
    }
    const phonePattern = /^(75|76|77|78|70)\d{7}$/;
    return phonePattern.test(this.userData.telephone);
  }
  
  isPasswordValid(): boolean {
    if (!this.userData.password) {
      return false; // Considère comme invalide si password est undefined
    }
    return this.userData.password.length >= 8; // Minimum 8 caractères
  }
  
  
  isFormValid(): boolean {
    return !!(
      this.isPrenomValid() &&
      this.isNomValid() &&
      this.isEmailValid() &&
      this.isPhoneValid() &&
      this.userData.role &&
      this.selectedDepartmentId &&
      (!this.requiresPassword() || this.userData.password)
    );
  }
 
  resetForm() {
    this.userData = {
      nom: '',
      prenom: '',
      email: '',
      photo: '',
      adresse: '',
      telephone: '',
      role: '',
      statut: 'actif',
      cardId: ''
    };
    this.selectedDepartmentId = '';
    this.isSubmitting = false;
    this.errorMessage = '';
  }
  onClose() {
    this.closeModal.emit();
    this.loadStats();
    
  }
  

  requiresPassword(): boolean {
    return this.userData.role === 'admin' || this.userData.role === 'vigile';
  }
}
