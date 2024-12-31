import { Component } from '@angular/core';
import { SocketService } from '../socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-buttonlecture',
  imports: [FormsModule, CommonModule],
  templateUrl: './buttonlecture.component.html',
  styleUrls: ['./buttonlecture.component.css']
})
export class ButtonlectureComponent {
  isAffectationVisible: boolean = false;
  cardUID: string = ''; // Pour afficher l'UID de la carte
  cardInfo: string = ''; // Pour afficher le message de bienvenue ou l'erreur

  constructor(private websocketService: SocketService) {}

  ngOnInit() {
    // Se connecter au serveur WebSocket lorsque le composant est initialisé
    this.websocketService.connect('ws://localhost:3000'); // Remplacez par l'URL de votre WebSocket

    // Souscrire aux messages reçus
    this.websocketService.getMessages().subscribe((message) => {
      console.log('Message reçu dans le composant:', message);

      if (message.status === 'connected') {
        this.cardUID = message.uid || ''; // Vérifiez si l'UID est fourni
        this.cardInfo = `Bienvenue ${message.name || 'inconnu'}, rôle: ${message.role || 'indéfini'}`;
        this.isAffectationVisible = true; // Afficher le champ affectation
      } else if (message.status === 'error') {
        const match = message.message.match(/UID de la carte : (\w+)/);
        this.cardUID = match ? match[1] : 'UID non trouvé'; // Extraire l'UID du message d'erreur si disponible
        this.cardInfo = message.message; // Afficher un message d'erreur si l'utilisateur n'est pas trouvé
        this.isAffectationVisible = false; // Ne pas afficher le champ affectation
      }
    });
  }

  // Méthode pour basculer l'affichage du champ affectation
  toggleAffectation() {
    this.isAffectationVisible = !this.isAffectationVisible;
  }
}
