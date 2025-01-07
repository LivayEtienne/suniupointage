

import { Component,Input, Output, EventEmitter } from '@angular/core';

import { ApiService,IUser,IDepartment } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-modifier-apprenant',
  imports: [CommonModule,
    FormsModule],
  templateUrl: './modifier-apprenant.component.html',
  styleUrl: './modifier-apprenant.component.css'
})
export class ModifierApprenantComponent {

  @Input() selectedUser!: IUser;  // ID de l'utilisateur à modifier
  @Output() closeModal = new EventEmitter<void>();  // Evénement pour fermer le modal
  @Output() userUpdated = new EventEmitter<IUser>();  // Événement pour signaler la mise à jour

  photoFile: File | null = null;  // Fichier sélectionné pour la photo
  photoPreview: string | null = null;  // Prévisualisation de la photo
  

  userData: Partial<IUser> = {};  // Données de l'utilisateur à modifier
  
  departments: IDepartment[] = [];  // Liste des départements
  isSubmitting = false;  // Pour gérer l'état du formulaire (envoi)
  errorMessage = '';  // Pour afficher des messages d'erreur
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    if (this.selectedUser) {  // Utilisation de selectedUser au lieu de user
      this.userData = { ...this.selectedUser };
    }
    this.loadDepartments();
  }

  // Charger les données de l'utilisateur
  loadUser(userId: number) {
    this.apiService.getUserById(userId).subscribe({
      next: (user) => {
        this.userData = { ...user };  // Mettre à jour les données de l'utilisateur
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des données de l\'utilisateur';
      }
    });
  }

  // Charger les départements
  loadDepartments() {
    this.apiService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des départements';
      }
    });
  }

  // Soumettre le formulaire
  
  onSubmit() {
    this.isSubmitting = true;
    this.apiService.updateUser(this.userData.id!, this.userData).subscribe({
      next: (updatedUser) => {
        this.isSubmitting = false;
        this.userUpdated.emit(updatedUser); 
        this.closeModal.emit();  // Fermer le modal après la mise à jour
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
      }
    });
  }

  //controle de saisi


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

  onClose() {
    this.closeModal.emit();
  }
  //pour la gestion de la photo pour modifier

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.photoFile = input.files[0];  // Récupérer le fichier sélectionné
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string;  // Générer la prévisualisation
      };
      reader.readAsDataURL(this.photoFile);
    }
  }
  //valider si ya pas erreur

  hasErrors(): boolean {
    return (
      !this.isPrenomValid() ||
      !this.isNomValid() ||
      !this.isEmailValid() ||
      !this.isPhoneValid() 
    );
  }
  
}
