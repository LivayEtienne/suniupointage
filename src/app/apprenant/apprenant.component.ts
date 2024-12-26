import { Component, OnInit } from '@angular/core';
import { ApprenantService } from '../apprenant.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apprenant',
  standalone: true,
  imports: [SidebarComponent, DashboardComponent, CommonModule, FormsModule],
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
  itemsPerPage: number = 5;  // Nombre d'éléments par page modifié à 5
  totalItems: number = 0;    // Total des éléments

  constructor(private apprenantService: ApprenantService) {}

  ngOnInit(): void {
    this.loadApprenants();
  }

  loadApprenants(): void {
    this.apprenantService.getApprenants().subscribe({
      next: (data: any[]) => {
        this.apprenants = data;
        this.totalItems = this.apprenants.length;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des apprenants:', error);
      },
    });
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
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: this.role,
      adresse: this.adresse,
      telephone: this.telephone,
      fonction: this.fonction,
      id_cohorte: this.cohorte,
    };

    if (this.isEditMode && this.selectedApprenant) {
      this.apprenantService
        .updateApprenant(this.selectedApprenant.id, apprenantData)
        .subscribe({
          next: () => {
            alert('Apprenant mis à jour avec succès');
            this.loadApprenants();
            this.closeModal();
          },
          error: (error: any) => {
            console.error('Erreur lors de la mise à jour:', error);
            alert('Erreur lors de la mise à jour');
          },
        });
    } else {
      this.apprenantService.registerUser(apprenantData).subscribe({
        next: (response: any) => {
          const apprenantCreationData = {
            id_user: response.id,
            id_cohorte: this.cohorte,
            fonction: this.fonction,
          };

          this.apprenantService.addApprenant(apprenantCreationData).subscribe({
            next: () => {
              this.loadApprenants();
              this.closeModal();
              alert('Apprenant inscrit avec succès');
            },
            error: (error: any) => {
              console.error("Erreur lors de l'ajout de l'apprenant:", error);
              alert("Erreur lors de l'ajout de l'apprenant");
            },
          });
        },
        error: (error: any) => {
          console.error('Erreur lors de l\'inscription:', error);
          alert('Erreur lors de l\'inscription');
        },
      });
    }
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

  deleteApprenant(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet apprenant ?')) {
      this.apprenantService.deleteApprenant(parseInt(id, 10)).subscribe({
        next: () => {
          alert('Apprenant supprimé avec succès');
          this.loadApprenants();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression');
        },
      });
    }
  }
  
}
