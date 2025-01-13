// assigne.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { SidebareComponent } from '../sidebare/sidebare.component';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormControl, Validators, AbstractControl, FormGroup  } from '@angular/forms';
import Swal from 'sweetalert2';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  cardId?: string;
  statut: 'Active' | 'non actif' | 'Bloquer';
}


@Component({
  selector: 'app-assigne',
   imports: [CommonModule,
      FormsModule,SidebareComponent ],
  templateUrl: './assigne.component.html',
  styleUrls: ['./assigne.component.css']
})
export class AssigneComponent implements OnInit, OnDestroy {
  private socket$: WebSocketSubject<any>;
  users: User[] = [];
  selectedUser: User | null = null;
  lastScannedRfid: string = '';
  statusMessage: string = '';
  error: any;
  searchTerm: string = '';
  showModal: boolean = false;
// Liste des utilisateurs filtrés
currentPage: number = 1; // Page actuelle
itemsPerPage: number = 10; // Nombre d'utilisateurs par page
paginatedUsers: User[] = []; // Liste des utilisateurs affichés
errorMessage = '';  

searchQuery: string = '';
  constructor(private http: HttpClient) {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  ngOnInit() {
    this.loadUsers();
    this.initializeWebSocket();
  }

  ngOnDestroy() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  //pour gerer l
  private initializeWebSocket() {
    this.socket$.subscribe(
      (message) => {
        console.log('Message reçu:', message);
        if (message.type === 'access_denied' && message.cardId) {
       
          // Mettre à jour la variable lastScannedRfid avec le cardId scanné
          this.lastScannedRfid = message.cardId;
          console.log('UID scanné:', this.lastScannedRfid); // Vérifiez dans la console
        }
      },
      (error) => console.error('Erreur WebSocket:', error),
      () => console.log('WebSocket fermé')
    );
  }
  

  private loadUsers() {
    this.http.get<User[]>('http://localhost:3000/api/users').subscribe(
      (users) => {
        this.users = users;
        this.users = users; // Assurez-vous que cette ligne est exécutée correctement
        this.users = [...this.users]; // Mettez à jour les utilisateurs filtrés
        this.updatePaginatedUsers(); // Mettez à jour les utilisateurs paginés
        console.log('Utilisateurs chargés :', this.users); // Déboguez ici
        console.log('Utilisateurs chargés:', users);
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.statusMessage = 'Erreur lors du chargement des utilisateurs';
      }
    );
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.statusMessage = `Utilisateur ${user.prenom}  ${user.nom} sélectionné. En attente du scan de la carte...`;
  }

  private handleRfidScan(cardId: string) {
    console.log('UID scanné:', cardId);
    this.lastScannedRfid = cardId;
    
    if (this.selectedUser) {
      this.http.post(`http://localhost:3000/api/users/${this.selectedUser._id}/rfid`, { cardId })
        .subscribe(
          () => {
            this.statusMessage = `Carte RFID ${cardId} assignée à ${this.selectedUser?.nom}`;
            this.loadUsers(); // Recharger la liste pour mettre à jour l'affichage
          },
          (error) => {
            console.error('Erreur lors de l\'assignation:', error);
            this.statusMessage = 'Erreur lors de l\'assignation de la carte';
          }
        );
    } 
    else {
      this.statusMessage = 'Veuillez d\'abord sélectionner un utilisateur';
    }
  }

  assignRfid() {
    if (this.selectedUser && this.lastScannedRfid) {
      this.http.post(`http://localhost:3000/api/users/${this.selectedUser._id}/rfid`, { cardId: this.lastScannedRfid })
        .subscribe(
          () => {
            this.statusMessage = `Carte RFID ${this.lastScannedRfid} assignée à ${this.selectedUser?.nom}`;
            this.loadUsers(); // Recharge la liste des utilisateurs
            this.closeModal();
          },
          (error) => {
            console.error('Erreur lors de l\'assignation:', error);
            this.statusMessage = 'Erreur lors de l\'assignation de la carte';
          }
        );

        
    }
    
   
 

    else {
      this.statusMessage = 'Veuillez sélectionner un utilisateur et scanner une carte.';
    }
  }


  openAssignModal(user: User) {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal() {
    this.selectedUser = null;
    this.lastScannedRfid = '';
    this.showModal = false;
  }




//partie pagination

// Fonction pour mettre à jour la liste paginée
updatePaginatedUsers() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.paginatedUsers = this.users.slice(startIndex, endIndex);  // Utilisation du slicing pour paginer
}

// Fonction pour passer à la page suivante
nextPage() {
  if (this.currentPage < this.totalPages()) {
    this.currentPage++;
    this.updatePaginatedUsers();  // Met à jour les utilisateurs de la nouvelle page
  }
}

// Fonction pour passer à la page précédente
previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updatePaginatedUsers();  // Met à jour les utilisateurs de la nouvelle page
  }
}

// Fonction pour calculer le nombre total de pages
totalPages(): number {
  return Math.ceil(this.users.length / this.itemsPerPage);
}


searchUsers(): void {
  if (this.searchTerm) {
      this.users = this.users.filter(user => 
          user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.telephone.includes(this.searchTerm)
      );
  } else {
      this.users = this.users;
  }
  this.currentPage = 1;
  this.updatePaginatedUsers();
}
}