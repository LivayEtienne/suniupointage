import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auth1Service } from '../auth1.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth1',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth1.component.html',
  styleUrls: ['./auth1.component.css'],
})
export class Auth1Component implements OnInit, OnDestroy {
  userInfo: any = null;  // Pour stocker les informations de l'utilisateur
  uid: string = '';  // UID à envoyer au serveur

  constructor(private authService: Auth1Service) {}

  ngOnInit(): void {
    // S'abonner pour recevoir les informations utilisateur
    this.authService.userInfo$.subscribe((userInfo) => {
      this.userInfo = userInfo;  // Mise à jour des informations de l'utilisateur
    });
  }

  // Envoi de l'UID au serveur WebSocket
  sendUidToServer(): void {
    if (this.uid) {
      this.authService.sendUid(this.uid);
    } else {
      console.log('Veuillez entrer un UID');
    }
  }

  ngOnDestroy(): void {
    // Assurez-vous de fermer la connexion WebSocket quand le composant est détruit
    this.authService.closeSocket();
  }
}
